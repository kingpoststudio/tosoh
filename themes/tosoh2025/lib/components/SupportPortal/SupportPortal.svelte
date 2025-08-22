<svelte:options
  customElement={{
    tag: 'tosoh-support-portal',
    shadow: 'none',
  }}
/>

<script>
  import SupportPortalFilter from './SupportPortalFilter.svelte';
  import SupportPortalControllers from './SupportPortalControllers.svelte';
  import { onMount } from 'svelte';
  import SupportPortalGrid from './SupportPortalGrid.svelte';
  import { setSearchParams } from '../../utils/UrlUtils';

  let portalItems = $state([]);
  let filterSubmitted = $state(0);
  let totalItems = $state(0);

  const constructFormValues = () => {
    const params = new URLSearchParams(window.location.search);
    return {
      limit: parseInt(params?.get('limit')) || 12,
      pagination: parseInt(params?.get('pagination')) || 1,
      offset: parseInt(params?.get('limit')) * (parseInt(params?.get('pagination')) - 1) || 0,
      product_family: params?.get('product_family') || '',
      product_type: params?.get('product_type') || '',
      document_category: params?.get('document_category') || '',
      document_type: params?.get('document_type') || '',
      search: params?.get('search') || '',
    };
  };

  const fetchData = async () => {
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
    console.log(data, 'data');

    if (!data?.error) {
      const { items, total } = data?.data?.HUBDB?.support_portal_collection;
      portalItems = items;
      totalItems = total;
    }
  };

  const onFilterSubmit = () => {
    setSearchParams({
      pagination: 1,
      limit: 12,
    });
    filterSubmitted++;
    fetchData();
  };

  const onControllerSubmit = () => {
    fetchData();
  };

  onMount(() => {
    fetchData();
  });
</script>

<div class="mt-lg p-md m-auto flex w-full max-w-[var(--container-8xl)] justify-around">
  <SupportPortalFilter {onFilterSubmit} onFormReset={onFilterSubmit}></SupportPortalFilter>
  <div class="flex w-full flex-col">
    <SupportPortalGrid {portalItems}></SupportPortalGrid>
    {#key filterSubmitted}
      <SupportPortalControllers {totalItems} {onControllerSubmit}></SupportPortalControllers>
    {/key}
  </div>
</div>
