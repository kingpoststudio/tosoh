<svelte:options
  customElement={{
    tag: 'tosoh-support-portal',
    shadow: 'none',
  }}
/>

<script lang="ts">
  import { onMount } from 'svelte';

  import SupportPortalFilter from './SupportPortalFilter.svelte';
  import SupportPortalControllers from './SupportPortalControllers.svelte';
  import SupportPortalGrid from './SupportPortalGrid.svelte';
  import { setSearchParams } from '../../utils/UrlUtils';
  import ErrorCard from '../ErrorCard/ErrorCard.svelte';
  import { mockPortalItems } from './mock';

  let availableFilters = window?.Tosoh?.SupportPortalContent?.filters
    ? window?.Tosoh?.SupportPortalContent?.filters.split(',')
    : ['product_family', 'product_type'];

  let searchColumnId = window?.Tosoh?.SupportPortalContent?.search
    ? window?.Tosoh?.SupportPortalContent?.search?.hubdb_column_id
    : 'search_terms';

  let title = window?.Tosoh?.SupportPortalContent?.title;
  let description = window?.Tosoh?.SupportPortalContent?.description;

  let portalItems: any = $state([]);
  let totalItems = $state(0);
  let hasError = $state(false);
  let isLoading = $state(false);

  const params = new URLSearchParams(window.location.search);
  let viewAs: 'grid' | 'list' = $state((params.get('view') as 'grid' | 'list') || 'grid');

  const constructFilterParams = () => {
    const params = new URLSearchParams(window.location.search);
    let objWithFilters = {};
    const allFilters = [...availableFilters, searchColumnId];
    //product_family, product-type, document_category, document_type
    allFilters?.map((filter) => (objWithFilters[filter] = params?.get(filter) || ''));
    return { ...objWithFilters };
  };

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
        `https://${window.location.hostname}/hs/serverless/get-support-portal-collection`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(constructFormValues()),
        }
      );
      const data = await response.json();

      // const data = mockPortalItems;

      if (!data?.error) {
        const { results, total } = data;
        portalItems = results;
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
  };

  const onControllerSubmit = (event: Event) => {
    if ((event.target as HTMLSelectElement)?.name === 'limit') {
      setSearchParams({
        pagination: '1',
      });
    }

    updateUrl(event);
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
  <div class="max-w-8xl gap-sm p-md m-auto mt-32 flex flex-col">
    {#if title}
      <h1 class="text-6xl font-bold">{title}</h1>
    {/if}

    {#if description}
      <p class="text-nickel text-lg">{description}</p>
    {/if}
  </div>
{/if}

<div
  class={`p-md gap-base max-w-8xl relative m-auto mb-32 flex w-full flex-col justify-around lg:flex-row ${title || description ? '' : 'mt-lg'}`}
>
  <SupportPortalFilter
    {onFilterSubmit}
    isParentLoading={isLoading}
    hasParentError={hasError}
    onFormReset={onFilterSubmit}
    {viewAs}
    {handleChangeView}
  ></SupportPortalFilter>
  <div class="flex w-full flex-col justify-between">
    {#if hasError}
      <div class="p-sm">
        <ErrorCard message="Failed to load portal items" retryCallback={reloadData} />
        <div class="pb-sm"></div>
      </div>
    {:else}
      <SupportPortalGrid {portalItems} {isLoading} {viewAs}></SupportPortalGrid>

      {#if portalItems?.length > 0}
        <SupportPortalControllers {totalItems} {onControllerSubmit}></SupportPortalControllers>
      {/if}
    {/if}
  </div>
</div>
