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
  import ItemsGrid from '../ItemsGrid/ItemsGrid.svelte';
  import PaginationWithLimit from '../PaginationWithLimit/PaginationWithLimit.svelte';
  import Card from './Card.svelte';
  import ErrorCard from '../ErrorCard/ErrorCard.svelte';
  import { mockWebinarCollectionRes } from './mock';
  import WebinarListingsFilters from './WebinarListingsFilters.svelte';
  import type { ColumnId } from '../../../types/hubdb';
  import SkeletonCard from './SkeletonCard.svelte';

  let tableRows: any = $state([]);
  let totalItems = $state(0);
  let hasError = $state(false);
  let isLoading = $state(false);

  const eyebrow = window?.Tosoh?.WebinarListings?.eyebrow;
  const title = window?.Tosoh?.WebinarListings?.title;
  const filterByTopic = window?.Tosoh?.WebinarListings?.filterByTopic;
  const searchGroup = window?.Tosoh?.WebinarListings?.search;
  const searchColumnId = searchGroup?.searchHubdbColumnId;

  // const tableId = window?.Tosoh?.WebinarListings?.tableId;
  const tableId = PROD_TOSOH_WEBINARS_TABLE_ID;

  const availableFilters = window?.Tosoh?.WebinarListings?.filters
    ? ([
        ...window.Tosoh.WebinarListings.filters.dropdownFilters.map(
          (filter) => filter.hubdb_column_id
        ),
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

  onMount(() => {
    fetchData();
  });
</script>

<div class="md:p-lg p-md h-fit-content max-w-max-page gap-md m-auto flex w-full flex-col">
  <div class="gap-md flex w-full flex-col items-center justify-between md:flex-row">
    <div>
      <span class="text-imperial-red text-lg font-thin">{eyebrow || 'Event Highlights'}</span>
      <h3 class="font-semibold">{title || 'Webinars'}</h3>
    </div>
    <WebinarListingsFilters isParentLoading={isLoading} />
  </div>

  {#if hasError}
    <div class="p-sm">
      <ErrorCard message="Failed to load webinars" retryCallback={reloadData} />
      <div class="pb-sm"></div>
    </div>
  {:else}
    <ItemsGrid {tableRows} {isLoading} {Card} {SkeletonCard} hasLargeElements={true}></ItemsGrid>

    {#if tableRows?.length > 0}
      <PaginationWithLimit {totalItems}></PaginationWithLimit>
    {/if}
  {/if}
</div>
