<svelte:options
  customElement={{
    tag: 'tosoh-webinar-listings',
    shadow: 'none',
  }}
/>

<script lang="ts">
  import { onMount } from 'svelte';
  import { createPortalState } from '../../factories/createPortalState.svelte';
  import { PROD_TOSOH_WEBINARS_TABLE_ID } from '../../utils/constants';
  import { setSearchParams } from '../../utils/urlUtils';
  import { isPastEvent, isUpcomingEvent } from '../../utils/utils';
  import ItemsGrid from '../../components/ItemsGrid/ItemsGrid.svelte';
  import PaginationWithLimit from '../../components/Pagination/Pagination.svelte';
  import Card from './Card.svelte';
  import ErrorCard from '../../components/ErrorCard/ErrorCard.svelte';
  import WebinarListingsFilters from './Filters.svelte';
  import type { WebinarListingsItem } from '../../../types/webinarListings';
  import SkeletonCard from './SkeletonCard.svelte';
  import { fade } from 'svelte/transition';

  const webinarListingsWindow = window.Tosoh?.WebinarListings;

  const portal = createPortalState({
    formId: 'webinarListingsForm',
    content: webinarListingsWindow,
    prodTableId: PROD_TOSOH_WEBINARS_TABLE_ID,
    properties:
      'webinar_title,priority,webinar_subtext,presenter_1_image,presenter_1_name,presenter_1_title,presenter_1_location,presenter_2_image,presenter_2_name,presenter_2_title,presenter_2_location,cta_label,date,start_time,stop_time,registration_page_url,language',
    sort: '-priority',
    isActivated: true,
    filterParamOptions: { topic: webinarListingsWindow?.advanced?.filter_by_topic },
  });

  const { searchColumnIds, formId, fetchData, reloadData } = portal;

  const preselectedLanguage = webinarListingsWindow?.preselected_language;
  const upcomingSectionEyebrow = webinarListingsWindow?.upcoming_section_eyebrow;
  const upcomingSectionTitle = webinarListingsWindow?.upcoming_section_title;
  const pastSectionEyebrow = webinarListingsWindow?.past_section_eyebrow;
  const pastSectionTitle = webinarListingsWindow?.past_section_title;

  const getUpcoming = (allRows: WebinarListingsItem[]) => {
    const upcomingWebinars = allRows?.filter((row) => isUpcomingEvent(row?.values?.date)) || [];
    return upcomingWebinars;
  };

  const getPastEvents = (allRows: WebinarListingsItem[]) => {
    const pastWebinars =
      allRows?.filter((row) => isPastEvent(row?.values?.date) || !row?.values?.date) || [];

    return pastWebinars;
  };

  const setDefaultLanguage = () => {
    if (preselectedLanguage) {
      const params = new URLSearchParams(window.location.search);

      if (
        !params.has('language') &&
        !params?.has(searchColumnIds?.find((columnId) => columnId === 'language') as string)
      ) {
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
      <div class=" h-md min-w-3xl rounded-lg bg-red-50"></div>
      <div class="mt-sm h-14 min-w-5xl rounded-lg bg-gray-200"></div>
    </div>

    <WebinarListingsFilters {formId} isSkeleton={true} />
  </div>
{/snippet}

{#snippet grid(rows: WebinarListingsItem[], displayOnLoad: boolean, displayPagination: boolean)}
  {#if (portal.isLoading && displayOnLoad) || !portal.isLoading}
    <ItemsGrid
      tableRows={rows}
      isLoading={portal.isLoading}
      {Card}
      {SkeletonCard}
      hasLargeElements={true}
      additionalConfSettings={webinarListingsWindow?.additional_conf_settings}
    ></ItemsGrid>
    <div class={`${rows?.length > 0 && displayPagination ? 'block' : 'hidden'}`}>
      <PaginationWithLimit
        totalItems={portal.totalItems}
        {fetchData}
        idToScrollToTop={formId}
        additionalConfSettings={webinarListingsWindow?.additional_conf_settings}
      ></PaginationWithLimit>
    </div>
  {/if}
{/snippet}

<div
  transition:fade={{ duration: 100 }}
  id={formId}
  class="md:pl-2xl md:pr-2xl md:pt-lg md:pb-lg p-md h-fit-content max-w-max-page gap-lg m-auto flex w-full flex-col"
>
  {#if portal.isLoading}
    {@render headerSkeleton()}
    {@render grid([], true, false)}
  {/if}

  {#if portal.hasError && !portal.isLoading}
    <div class="p-sm">
      <ErrorCard errorCard={webinarListingsWindow?.error_card} retryCallback={reloadData} />
      <div class="pb-sm"></div>
    </div>
  {/if}

  {#if !portal.isLoading && portal.tableRows?.length > 0}
    {@const upcomingEvents = getUpcoming(portal.tableRows)}
    {@const hasUpcomingEvents = upcomingEvents?.length > 0}

    {@const pastEvents = getPastEvents(portal.tableRows)}
    {@const hasPastEvents = pastEvents?.length > 0}

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
