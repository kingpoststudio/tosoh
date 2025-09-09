<svelte:options
  customElement={{
    tag: 'tosoh-webinar-listings',
    shadow: 'none',
  }}
/>

<script lang="ts">
  import { onMount, Component } from 'svelte';
  import { fetchTableRows } from '../../services/fetchTableRows';
  import {
    defaultItemsLimit,
    defaultPagination,
    PROD_TOSOH_WEBINARS_TABLE_ID,
  } from '../../utils/constants';
  import ItemsGrid from '../ItemsGrid/ItemsGrid.svelte';
  import PaginationWithLimit from '../PaginationWithLimit/PaginationWithLimit.svelte';
  import Card from './Card.svelte';
  import ErrorCard from '../ErrorCard/ErrorCard.svelte';
  import { mockWebinarCollectionRes } from './mock';
  import WebinarListingsFilters from './WebinarListingsFilters.svelte';
  import type { ColumnId, WebinarListingsItem } from '../../../types/hubdb';
  import SkeletonCard from './SkeletonCard.svelte';
  import { setSearchParams } from '../../utils/urlUtils';
  import { isPast, isUpcoming } from '../../utils/utils';
  import { fade } from 'svelte/transition';

  let tableRows: any = $state([]);
  let totalItems = $state(0);
  let hasError = $state(false);
  let isLoading = $state(false);

  const webinarListingsWindow = window.Tosoh?.WebinarListings;
  // const tableId = window?.Tosoh?.WebinarListings?.tableId;
  const tableId = PROD_TOSOH_WEBINARS_TABLE_ID;
  const preselectedLanguage = webinarListingsWindow?.preselectedLanguage;
  const upcomingSectionEyebrow = webinarListingsWindow?.upcomingSectionEyebrow;
  const upcomingSectionTitle = webinarListingsWindow?.upcomingSectionTitle;
  const pastSectionEyebrow = webinarListingsWindow?.pastSectionEyebrow;
  const pastSectionTitle = webinarListingsWindow?.pastSectionTitle;
  const filterByTopic = webinarListingsWindow?.filterByTopic;
  const searchGroup = webinarListingsWindow?.search;
  const searchColumnId = searchGroup?.searchHubdbColumnId;

  const availableFilters = webinarListingsWindow?.filters
    ? ([
        ...webinarListingsWindow.filters.dropdownFilters.map((filter) => filter.hubdb_column_id),
        searchColumnId,
      ] as ColumnId[])
    : [];

  const constructFilterParams = () => {
    const params = new URLSearchParams(window.location.search);
    let objWithFilters: any = {};
    const allFilters = [...availableFilters];
    allFilters?.map((filter) => (objWithFilters[filter] = params?.get(filter) || ''));
    return filterByTopic ? { ...objWithFilters, topic: filterByTopic } : { ...objWithFilters };
  };

  const constructBody = () => {
    const params = new URLSearchParams(window.location.search);
    return {
      sort: '-priority',
      tableId: tableId,
      properties:
        'webinar_title,priority,webinar_subtext,presenter_1_image,presenter_1_name,presenter_1_title,presenter_1_location,presenter_2_image,presenter_2_name,presenter_2_title,presenter_2_location,cta_label,date,start_time,stop_time,registration_page_url',
      limit: parseInt(params?.get('limit') || defaultItemsLimit),
      pagination: parseInt(params?.get('pagination') || defaultPagination),
      offset:
        parseInt(params?.get('limit') || defaultItemsLimit) *
          (parseInt(params?.get('pagination') || defaultPagination) - 1) || 0,
      filters: constructFilterParams(),
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

      if (!params.has('language')) {
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
      <span class="text-imperial-red text-lg font-thin">{eyebrow}</span>
      <h1 class="mt-md font-semibold">{title}</h1>
    </div>

    {#if hasFilter}
      <WebinarListingsFilters isParentLoading={isLoading} />
    {/if}
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

      {#if tableRows?.length > 0 && displayPagination}
        <PaginationWithLimit {totalItems}></PaginationWithLimit>
      {/if}
    {/if}
  {/if}
{/snippet}

<div
  transition:fade={{ duration: 100 }}
  class="md:pl-2xl md:pr-2xl md:pt-lg md:pb-lg p-md h-fit-content max-w-max-page gap-lg m-auto flex w-full flex-col"
>
  {#if isLoading}
    {@render header(upcomingSectionEyebrow, upcomingSectionTitle, true)}
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
