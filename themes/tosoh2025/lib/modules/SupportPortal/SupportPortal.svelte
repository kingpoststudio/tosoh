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
    IS_MOCK,
    PROD_TOSOH_SUPPORT_PORTAL_TABLE_ID,
  } from '../../utils/constants';
  import PaginationWithLimit from '../../components/Pagination/Pagination.svelte';
  import Card from './Card.svelte';
  import SkeletonCard from './SkeletonCard.svelte';
  import ItemsGrid from '../../components/ItemsGrid/ItemsGrid.svelte';
  import { fetchTableRows } from '../../services/fetchTableRows';
  import Filters from './Filters.svelte';
  import {
    constructFilterParams,
    constructRangePmFilters,
    getFilterColumnIds,
    parseSearchColumnId,
    getFiltersTableId,
  } from '../../utils/utils';

  const supportPortalContent = window?.Tosoh?.SupportPortalContent;

  const topicFilters = supportPortalContent?.topic_filters?.filters || [];
  const formId = 'support-portal';
  let accessLevel = supportPortalContent?.access_level || 'Customer';

  let searchColumnId = parseSearchColumnId(supportPortalContent?.search);
  const tableId = getFiltersTableId(
    PROD_TOSOH_SUPPORT_PORTAL_TABLE_ID,
    supportPortalContent?.topic_filters?.hubdb_table_id
  );

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
      tableId: tableId,
      properties:
        'name,image,hs_path,product_family,product_type,document_type,wistia_video_url,document_url',
      accessLevel: accessLevel,
      limit: parseInt(params?.get('limit') || `${defaultItemsLimit}`),
      pagination: parseInt(params?.get('pagination') || `${defaultPagination}`),
      offset:
        parseInt(params?.get('limit') || `${defaultItemsLimit}`) *
          (parseInt(params?.get('pagination') || `${defaultPagination}`) - 1) || 0,
      filters: constructFilterParams(nonNumericFilters),
      numericComparisonFilters: [...rangePmFilters],
      isActivated: true,
    };
  };

  const fetchData = async () => {
    try {
      isLoading = true;
      let data;
      if (!IS_MOCK) {
        data = await fetchTableRows(constructBody());
      } else {
        data = mockPortalItems;
      }
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
  <Filters isParentLoading={isLoading} {viewAs} {handleChangeView} {formId}></Filters>
  <div class="flex w-full flex-col justify-between">
    {#if hasError}
      <div class="p-sm">
        <ErrorCard message="Failed to load portal items" retryCallback={reloadData} />
        <div class="pb-sm"></div>
      </div>
    {:else}
      <ItemsGrid {tableRows} {isLoading} {viewAs} {Card} {SkeletonCard}></ItemsGrid>

      <div class={`${tableRows?.length > 0 ? 'block' : 'hidden'}`}>
        <PaginationWithLimit {totalItems} {fetchData}></PaginationWithLimit>
      </div>
    {/if}
  </div>
</div>
