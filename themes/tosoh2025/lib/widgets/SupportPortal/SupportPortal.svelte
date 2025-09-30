<svelte:options
  customElement={{
    tag: 'tosoh-support-portal',
    shadow: 'none',
  }}
/>

<script lang="ts">
  import { onMount } from 'svelte';

  import ErrorCard from '../../components/ErrorCard/ErrorCard.svelte';
  import { mockPortalItems } from './mock';
  import {
    defaultItemsLimit,
    defaultPagination,
    PROD_TOSOH_SUPPORT_PORTAL_TABLE_ID,
  } from '../../utils/constants';
  import PaginationWithLimit from '../../components/PaginationWithLimit/PaginationWithLimit.svelte';
  import Card from './Card.svelte';
  import SkeletonCard from './SkeletonCard.svelte';
  import ItemsGrid from '../../components/ItemsGrid/ItemsGrid.svelte';
  import { fetchTableRows } from '../../services/fetchTableRows';
  import Filters from './Filters.refactored.svelte';
  import {
    constructFilterParams,
    constructRangePmFilters,
    getFilterColumnIds,
  } from '../../utils/utils';

  const supportPortalContent = window?.Tosoh?.SupportPortalContent;
  const topicFilters = supportPortalContent?.topic_filters?.filters || [];

  let accessLevel = supportPortalContent?.access_level || 'Customer';

  let searchColumnId = supportPortalContent?.search
    ? supportPortalContent?.search?.hubdb_column_id
    : 'search_terms';

  let nonNumericFilters = getFilterColumnIds(topicFilters, 'non-numeric', [searchColumnId]) || [];
  const rangePmFilters = constructRangePmFilters(topicFilters);

  let title = supportPortalContent?.title;
  let description = supportPortalContent?.description;

  let tableRows: any = $state([]);
  let totalItems = $state(0);
  let hasError = $state(false);
  let isLoading = $state(false);

  const params = new URLSearchParams(window.location.search);
  let viewAs: 'grid' | 'list' = $state((params.get('view') as 'grid' | 'list') || 'grid');

  const constructBody = () => {
    const params = new URLSearchParams(window.location.search);

    return {
      tableId: PROD_TOSOH_SUPPORT_PORTAL_TABLE_ID,
      properties:
        'name,image,hs_path,product_family,product_type,document_type,wistia_video_url,document_url',
      accessLevel: accessLevel,
      limit: parseInt(params?.get('limit') || defaultItemsLimit),
      pagination: parseInt(params?.get('pagination') || defaultPagination),
      offset:
        parseInt(params?.get('limit') || defaultItemsLimit) *
          (parseInt(params?.get('pagination') || defaultPagination) - 1) || 0,
      filters: constructFilterParams(nonNumericFilters),
      numericComparisonFilters: [...rangePmFilters],
    };
  };

  const fetchData = async () => {
    try {
      isLoading = true;
      const data = await fetchTableRows(constructBody());
      // const data = mockPortalItems;
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

  const handleChangeView = () => {
    const url = new URL(window.location.href);
    url.searchParams.set('view', viewAs === 'grid' ? 'list' : 'grid');
    window.history.pushState({}, '', url.toString().replace(/%2C/g, ','));
    viewAs = viewAs === 'grid' ? 'list' : 'grid';
  };

  onMount(() => {
    fetchData();
  });
</script>

{#if title || description}
  <div class="max-w-max-page gap-md p-md md:pl-2xl md:pr-2xl m-auto flex flex-col">
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
  <Filters isParentLoading={isLoading} {viewAs} {handleChangeView}></Filters>
  <div class="flex w-full flex-col justify-between">
    {#if hasError}
      <div class="p-sm">
        <ErrorCard message="Failed to load portal items" retryCallback={reloadData} />
        <div class="pb-sm"></div>
      </div>
    {:else}
      <ItemsGrid {tableRows} {isLoading} {viewAs} {Card} {SkeletonCard}></ItemsGrid>

      {#if tableRows?.length > 0}
        <PaginationWithLimit {totalItems}></PaginationWithLimit>
      {/if}
    {/if}
  </div>
</div>
