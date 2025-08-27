<svelte:options
  customElement={{
    tag: 'tosoh-support-portal',
    shadow: 'none',
  }}
/>

<script lang="ts">
  import SupportPortalFilter from './SupportPortalFilter.svelte';
  import SupportPortalControllers from './SupportPortalControllers.svelte';
  import { onMount } from 'svelte';
  import SupportPortalGrid from './SupportPortalGrid.svelte';
  import { setSearchParams } from '../../utils/UrlUtils';
  import ErrorCard from '../ErrorCard/ErrorCard.svelte';
  import SupportPortalSkeletonGrid from './SupportPortalSkeletonGrid.svelte';

  let availableFilters = window?.Tosoh?.SupportPortalContent?.filters
    ? window?.Tosoh?.SupportPortalContent?.filters.split(',')
    : ['product_family', 'product_type'];

  let searchColumnId = window?.Tosoh?.SupportPortalContent?.search
    ? window?.Tosoh?.SupportPortalContent?.search?.hubdb_column_id
    : 'search_terms';

  let portalItems = $state([]);
  let filterSubmitted = $state(0);
  let totalItems = $state(0);
  let hasError = $state(false);
  let isLoading = $state(false);
  let skeletonItems = $state(
    Array.from(
      { length: new URLSearchParams(window.location.search)?.get('limit') || 12 },
      (_, i) => i + 1
    )
  );
  const constructFilterParams = () => {
    const params = new URLSearchParams(window.location.search);
    let objWithFilters = {};
    const allFilters = [...availableFilters, searchColumnId];
    //product_family, product-type, document_category, document_type
    allFilters?.map((filter) => (objWithFilters[filter] = params?.get(filter) || ''));
    return { ...objWithFilters };
  };

  console.log(constructFilterParams(), '      filters');

  const constructFormValues = () => {
    const params = new URLSearchParams(window.location.search);
    return {
      limit: parseInt(params?.get('limit')) || 12,
      pagination: parseInt(params?.get('pagination')) || 1,
      offset: parseInt(params?.get('limit')) * (parseInt(params?.get('pagination')) - 1) || 0,
      filters: constructFilterParams(),
    };
  };

  const fetchData = async () => {
    try {
      isLoading = true;
      const response = await fetch(
        `https://145184808.hs-sites-eu1.com/hs/serverless/get-support-portal-collection`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(constructFormValues()),
        }
      );
      const data = await response.json();

      if (!data?.error) {
        const { items, total } = data?.data?.HUBDB?.support_portal_collection;
        portalItems = items;
        totalItems = total;
      }

      if (data?.error) {
        hasError = true;
      }
    } catch (error) {
      hasError = true;
    } finally {
      isLoading = false;
    }
  };

  const updateUrl = (e: Event) => {
    if (e) {
      const { name, value } = e?.target as HTMLSelectElement;
      const url = new URL(window.location.href);
      url.searchParams.set(name, value);
      window.location.href = url.toString();
    }
  };

  const onFilterSubmit = (event: Event) => {
    setSearchParams({
      pagination: '1',
      limit: '12',
    });

    updateUrl(event);

    filterSubmitted++;
  };

  const onControllerSubmit = () => {
    fetchData();
  };

  const reloadData = () => {
    hasError = false;
    fetchData();
  };

  $effect(() => {
    if (isLoading) {
      skeletonItems = Array.from(
        { length: new URLSearchParams(window.location.search)?.get('limit') || 6 },
        (_, i) => i + 1
      );
    }
  });

  onMount(() => {
    fetchData();
  });
</script>

<div
  class="mt-lg p-md gap-base relative m-auto flex w-full max-w-[var(--container-8xl)] flex-col justify-around lg:flex-row"
>
  <SupportPortalFilter
    {onFilterSubmit}
    isParentLoading={isLoading}
    hasParentError={hasError}
    onFormReset={onFilterSubmit}
  ></SupportPortalFilter>
  <div class="flex w-full flex-col justify-between">
    {#if hasError}
      <div class="p-sm">
        <ErrorCard message="Failed to load portal items" retryCallback={reloadData} />
        <div class="pb-sm"></div>
      </div>
    {:else}
      {#if isLoading}
        <SupportPortalSkeletonGrid {skeletonItems}></SupportPortalSkeletonGrid>
      {:else}
        <SupportPortalGrid {portalItems}></SupportPortalGrid>
      {/if}

      {#if portalItems?.length > 0}
        {#key filterSubmitted}
          <SupportPortalControllers {totalItems} {onControllerSubmit}></SupportPortalControllers>
        {/key}
      {/if}
    {/if}
  </div>
</div>
