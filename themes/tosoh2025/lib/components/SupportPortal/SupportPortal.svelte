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

  const params = new URLSearchParams(window.location.search);

  let portalItems = $state([]);

  const formValues = {
    limit: parseInt(params?.get('limit')) || 12,
    pagination: parseInt(params?.get('pagination')) || 1,
    offset: parseInt(params?.get('limit')) * (parseInt(params?.get('pagination')) - 1 || 1) || 0,
    product_family: params?.get('product_family') || '',
    product_type: params?.get('product_type') || '',
    document_category: params?.get('document_category') || '',
    document_type: params?.get('document_type') || '',
    search: params?.get('search') || '',
  };

  const fetchData = async () => {
    const response = await fetch(
      `https://145184808.hs-sites-eu1.com/hs/serverless/get-support-portal-collection`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formValues),
      }
    );
    const data = await response.json();
    console.log(data, 'data');

    if (!data?.error) {
      const { offset, items } = data?.data?.HUBDB?.support_portal_collection;
      portalItems = items;
      formValues.offset = offset;
    }
  };

  const onFormSubmit = () => {
    fetchData();
  };

  onMount(() => {
    fetchData();
  });

  $effect(() => {
    console.log(portalItems, 'portalItems');
  });
</script>

<div class="mt-lg p-md flex w-full justify-around">
  <SupportPortalFilter {onFormSubmit} onFormReset={onFormSubmit}></SupportPortalFilter>
  <div class="flex w-full flex-col">
    <SupportPortalGrid {portalItems}></SupportPortalGrid>
    <SupportPortalControllers {onFormSubmit}></SupportPortalControllers>
  </div>
</div>
