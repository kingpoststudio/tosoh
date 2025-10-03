<svelte:options
  customElement={{
    tag: 'tosoh-webinar-listings',
    shadow: 'none',
  }}
/>

<script lang="ts">
  import { onMount } from 'svelte';
  import { fetchTableRows } from '../../services/fetchTableRows';
  import {
    defaultItemsLimit,
    defaultPagination,
    PROD_TOSOH_WEBINARS_TABLE_ID,
  } from '../../utils/constants';
  import ItemsGrid from '../../components/ItemsGrid/ItemsGrid.svelte';
  import PaginationWithLimit from '../../components/PaginationWithLimit/PaginationWithLimit.svelte';
  import Card from './Card.svelte';
  import ErrorCard from '../../components/ErrorCard/ErrorCard.svelte';
  import { mockWebinarCollectionRes } from './mock';
  import WebinarListingsFilters from './Filters.svelte';
  import type { ColumnId, WebinarListingsItem } from '../../../types/hubdb';
  import SkeletonCard from './SkeletonCard.svelte';
  import { setSearchParams } from '../../utils/urlUtils';
  import {
    constructFilterParams,
    constructRangePmFilters,
    getFilterColumnIds,
    isPast,
    isUpcoming,
  } from '../../utils/utils';
  import { fade } from 'svelte/transition';

  const formId = 'webinarListingsForm';
  let tableRows: any = $state([]);
  let totalItems = $state(0);
  let hasError = $state(false);
  let isLoading = $state(false);

  const webinarListingsWindow = window.Tosoh?.WebinarListings;
  // const tableId = window?.Tosoh?.WebinarListings?.tableId;
  const tableId = PROD_TOSOH_WEBINARS_TABLE_ID;
  const preselectedLanguage = webinarListingsWindow?.preselected_language;
  const upcomingSectionEyebrow = webinarListingsWindow?.upcoming_section_eyebrow;
  const upcomingSectionTitle = webinarListingsWindow?.upcoming_section_title;
  const pastSectionEyebrow = webinarListingsWindow?.past_section_eyebrow;
  const pastSectionTitle = webinarListingsWindow?.past_section_title;
  const filterByTopic = webinarListingsWindow?.advanced?.filter_by_topic;
  const searchGroup = webinarListingsWindow?.search;
  const searchColumnId = searchGroup?.hubdb_column_id;
  const topicFilters = webinarListingsWindow?.topic_filters?.filters || [];

  const nonNumericFilters = getFilterColumnIds(topicFilters, 'non-numeric', [searchColumnId]) || [];

  const constructBody = () => {
    const params = new URLSearchParams(window.location.search);
    const rangePmFilters = constructRangePmFilters(topicFilters);

    return {
      sort: '-priority',
      tableId: tableId,
      properties:
        'webinar_title,priority,webinar_subtext,presenter_1_image,presenter_1_name,presenter_1_title,presenter_1_location,presenter_2_image,presenter_2_name,presenter_2_title,presenter_2_location,cta_label,date,start_time,stop_time,registration_page_url,language',
      limit: parseInt(params?.get('limit') || `${defaultItemsLimit}`),
      pagination: parseInt(params?.get('pagination') || `${defaultPagination}`),
      offset:
        parseInt(params?.get('limit') || `${defaultItemsLimit}`) *
          (parseInt(params?.get('pagination') || `${defaultPagination}`) - 1) || 0,
      filters: constructFilterParams(nonNumericFilters, { topic: filterByTopic }),
      numericComparisonFilters: rangePmFilters,
      isActivated: true,
    };
  };

  const fetchData = async () => {
    try {
      isLoading = true;

      const data = await fetchTableRows(constructBody());
      // const data = mockWebinarCollectionRes;

      const { results, total } = data ?? { results: [], total: 0 };
      tableRows = results;
      totalItems = total;
    } catch (error) {
      hasError = true;
    } finally {
      isLoading = false;
    }
  };

  const reloadData = () => {
    hasError = false;
    fetchData();
  };

  const getUpcoming = (allRows: WebinarListingsItem[]) => {
    const upcomingWebinars = allRows?.filter((row) => isUpcoming(row?.values?.date)) || [];
    return upcomingWebinars;
  };

  const getPastEvents = (allRows: WebinarListingsItem[]) => {
    const pastWebinars =
      allRows?.filter((row) => isPast(row?.values?.date) || !row?.values?.date) || [];

    return pastWebinars;
  };

  const setDefaultLanguage = () => {
    if (preselectedLanguage) {
      const params = new URLSearchParams(window.location.search);

      if (!params.has('language') && !params?.has(searchColumnId)) {
        setSearchParams({
          language: preselectedLanguage,
        });
      }
    }
  };

  setDefaultLanguage();

  onMount(() => {
    fetchData();
  });
</script>

{#snippet header(eyebrow: string, title: string, hasFilter: boolean)}
  <div class="gap-md flex w-full flex-col items-center justify-between md:flex-row">
    <div>
      <span class="text-imperial-red text-lg font-thin tracking-widest">{eyebrow}</span>
      <h2 class="mt-sm font-semibold">{title}</h2>
    </div>

    {#if hasFilter}
      <WebinarListingsFilters {formId} />
    {/if}
  </div>
{/snippet}

{#snippet headerSkeleton()}
  <div
    transition:fade={{ duration: 100 }}
    class="gap-md flex w-full flex-col items-center justify-between md:flex-row"
  >
    <div>
      <div class=" h-8 min-w-[8rem] rounded-lg bg-red-50"></div>
      <div class="mt-sm h-14 min-w-[16rem] rounded-lg bg-gray-200"></div>
    </div>

    <WebinarListingsFilters {formId} />
  </div>
{/snippet}

{#snippet grid(rows: WebinarListingsItem[], displayOnLoad: boolean, displayPagination: boolean)}
  {#if (isLoading && displayOnLoad) || !isLoading}
    {#if hasError}
      <div class="p-sm">
        <ErrorCard message="Failed to load webinars" retryCallback={reloadData} />
        <div class="pb-sm"></div>
      </div>
    {:else}
      <ItemsGrid tableRows={rows} {isLoading} {Card} {SkeletonCard} hasLargeElements={true}
      ></ItemsGrid>

      <div class={`${rows?.length > 0 ? 'block' : 'hidden'}`}>
        <PaginationWithLimit {totalItems} {fetchData}></PaginationWithLimit>
      </div>
    {/if}
  {/if}
{/snippet}

<div
  transition:fade={{ duration: 100 }}
  class="md:pl-2xl md:pr-2xl md:pt-lg md:pb-lg p-md h-fit-content max-w-max-page gap-lg m-auto flex w-full flex-col"
>
  {#if isLoading}
    {@render headerSkeleton()}
    {@render grid([], true, false)}
  {/if}

  {#if !isLoading}
    {@const hasUpcomingEvents = getUpcoming(tableRows)?.length > 0}
    {@const upcomingEvents = getUpcoming(tableRows)}

    {@const hasPastEvents = getPastEvents(tableRows)?.length > 0}
    {@const pastEvents = getPastEvents(tableRows)}

    {#if hasUpcomingEvents}
      {@render header(upcomingSectionEyebrow, upcomingSectionTitle, true)}
      {@render grid(upcomingEvents, true, hasPastEvents ? false : true)}
    {/if}

    {#if hasPastEvents}
      {@render header(pastSectionEyebrow, pastSectionTitle, hasUpcomingEvents ? false : true)}
      {@render grid(pastEvents, false, true)}
    {/if}
  {/if}
</div>
