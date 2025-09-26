<svelte:options
  customElement={{
    tag: 'tosoh-kiosk-documents',
    shadow: 'none',
  }}
/>

<script lang="ts">
  import { onMount } from 'svelte';

  import Filters from './Filters.svelte';
  import ErrorCard from '../ErrorCard/ErrorCard.svelte';

  import {
    defaultItemsLimit,
    defaultPagination,
    PROD_TOSOH_KIOSK_DOCUMENTS_TABLE_ID,
  } from '../../utils/constants';
  import PaginationWithLimit from '../PaginationWithLimit/PaginationWithLimit.svelte';
  import Card from './Card.svelte';
  import SkeletonCard from './SkeletonCard.svelte';
  import ItemsGrid from '../ItemsGrid/ItemsGrid.svelte';
  import { fetchTableRows } from '../../services/fetchTableRows';
  import { mockKioskDocumentsTableRowsResponse } from './mock';
  import {
    constructFilterParams,
    constructRangePmFilters,
    getFilterColumnIds,
  } from '../../utils/utils';
  const kioskDocumentsContent = window?.Tosoh?.KioskDocumentsContent;
  const topicFilters = kioskDocumentsContent?.topic_filters?.filters || [];

  let searchColumnId = kioskDocumentsContent?.search
    ? kioskDocumentsContent?.search?.hubdb_column_id
    : '';

  const nonNumericFilters = getFilterColumnIds(topicFilters, 'non-numeric', [searchColumnId]) || [];

  let title = kioskDocumentsContent?.title;
  let description = kioskDocumentsContent?.description;

  let tableRows: any = $state([]);
  let totalItems = $state(0);
  let hasError = $state(false);
  let isLoading = $state(false);

  const constructDateComparisonFilters = () => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const todayInMilliSeconds = Math.floor(today.getTime());

    return [
      {
        columnId: 'start_date',
        comparison: 'lte',
        value: todayInMilliSeconds,
      },
      {
        columnId: 'end_date',
        comparison: 'gte',
        value: todayInMilliSeconds,
      },
    ];
  };

  const constructBody = () => {
    const params = new URLSearchParams(window.location.search);
    const baseNumericFilters = constructDateComparisonFilters();
    const rangePmFilters = constructRangePmFilters(topicFilters);

    return {
      sort: '-start_date',
      tableId: PROD_TOSOH_KIOSK_DOCUMENTS_TABLE_ID,
      properties: 'title,document_type,image,page_path,start_date,end_date',
      limit: parseInt(params?.get('limit') || defaultItemsLimit),
      pagination: parseInt(params?.get('pagination') || defaultPagination),
      offset:
        parseInt(params?.get('limit') || defaultItemsLimit) *
          (parseInt(params?.get('pagination') || defaultPagination) - 1) || 0,
      filters: constructFilterParams(nonNumericFilters),
      numericComparisonFilters: [...baseNumericFilters, ...rangePmFilters],
    };
  };

  const fetchData = async () => {
    try {
      isLoading = true;
      // const data = await fetchTableRows(constructBody());
      const data = mockKioskDocumentsTableRowsResponse;
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

{#if title || description}
  <div class="max-w-max-page gap-md p-md md:pl-2xl md:pr-2xl m-auto flex flex-col pt-0">
    {#if title}
      <h2 class="font-bold">{title}</h2>
    {/if}

    {#if description}
      <h6 class="text-nickel">{description}</h6>
    {/if}
  </div>
{/if}

<div
  class={`p-md  md:pl-2xl md:pr-2xl gap-base max-w-max-page relative m-auto mb-32 flex w-full flex-col justify-around lg:flex-row ${title || description ? '' : 'mt-lg'}`}
>
  <Filters isParentLoading={isLoading}></Filters>
  <div class="flex w-full flex-col justify-between">
    {#if hasError}
      <div class="p-sm">
        <ErrorCard message="Failed to load portal items" retryCallback={reloadData} />
        <div class="pb-sm"></div>
      </div>
    {:else}
      <ItemsGrid {tableRows} {isLoading} {Card} {SkeletonCard}></ItemsGrid>

      {#if tableRows?.length > 0}
        <PaginationWithLimit {totalItems}></PaginationWithLimit>
      {/if}
    {/if}
  </div>
</div>
