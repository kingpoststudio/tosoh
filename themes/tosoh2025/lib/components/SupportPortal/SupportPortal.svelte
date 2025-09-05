<svelte:options
  customElement={{
    tag: 'tosoh-support-portal',
    shadow: 'none',
  }}
/>

<script lang="ts">
  import { onMount } from 'svelte';

  import SupportPortalFilter from './SupportPortalFilter.svelte';
  import ErrorCard from '../ErrorCard/ErrorCard.svelte';
  import { mockPortalItems } from './mock';
  import { defaultItemsLimit, defaultPagination } from '../../utils/constants';
  import PaginationWithLimit from '../PaginationWithLimit/PaginationWithLimit.svelte';
  import Card from './Card.svelte';
  import SkeletonCard from './SkeletonCard.svelte';
  import ItemsGrid from '../ItemsGrid/ItemsGrid.svelte';
  import { fetchTableRows } from '../../services/fetchTableRows';

  let availableFilters = window?.Tosoh?.SupportPortalContent?.filters
    ? window?.Tosoh?.SupportPortalContent?.filters.split(',')
    : [];

  let accessLevel = window?.Tosoh?.SupportPortalContent?.accessLevel || 'Customer';

  let searchColumnId = window?.Tosoh?.SupportPortalContent?.search
    ? window?.Tosoh?.SupportPortalContent?.search?.hubdb_column_id
    : 'search_terms';

  let title = window?.Tosoh?.SupportPortalContent?.title;
  let description = window?.Tosoh?.SupportPortalContent?.description;

  let tableRows: any = $state([]);
  let totalItems = $state(0);
  let hasError = $state(false);
  let isLoading = $state(false);

  const params = new URLSearchParams(window.location.search);
  let viewAs: 'grid' | 'list' = $state((params.get('view') as 'grid' | 'list') || 'grid');

  const constructFilterParams = () => {
    const params = new URLSearchParams(window.location.search);
    let objWithFilters: any = {};
    const allFilters = [...availableFilters, searchColumnId];
    //product_family, product-type, document_category, document_type
    allFilters?.map((filter) => (objWithFilters[filter] = params?.get(filter) || ''));
    return { ...objWithFilters };
  };

  const constructFormValues = () => {
    const params = new URLSearchParams(window.location.search);
    return {
      tableId: 'support_portal',
      properties:
        'name,image,hs_path,product_family,product_type,document_type,wistia_video_url,document_url',
      accessLevel: accessLevel,
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
      const data = await fetchTableRows(constructFormValues());
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
  <div class="max-w-max-page gap-sm p-md m-auto mt-32 flex flex-col">
    {#if title}
      <h1 class="text-6xl font-bold">{title}</h1>
    {/if}

    {#if description}
      <p class="text-nickel text-lg">{description}</p>
    {/if}
  </div>
{/if}

<div
  class={`p-md gap-base max-w-max-page relative m-auto mb-32 flex w-full flex-col justify-around lg:flex-row ${title || description ? '' : 'mt-lg'}`}
>
  <SupportPortalFilter isParentLoading={isLoading} {viewAs} {handleChangeView}
  ></SupportPortalFilter>
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
