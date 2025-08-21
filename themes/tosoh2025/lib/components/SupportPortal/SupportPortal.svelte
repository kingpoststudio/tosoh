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

  const params = new URLSearchParams(window.location.href);

  const formValues = {
    limit: parseInt(params?.get('limit')) || 12,
    pagination: parseInt(params?.get('pagination')) || 1,
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
  };

  const onFormSubmit = (filterData) => {
    formValues.limit = 12;
    formValues.pagination = 1;
    formValues.product_family = filterData?.get('product_family') || '';
    formValues.product_type = filterData?.get('product_type') || '';
    formValues.document_category = filterData?.get('document_category') || '';
    formValues.document_type = filterData?.get('document_type') || '';
    formValues.search = filterData?.get('search') || '';

    fetchData();
  };

  onMount(() => {
    fetchData();
  });
</script>

<div class="mt-lg p-md flex w-full justify-around">
  <SupportPortalFilter {onFormSubmit} onFormReset={onFormSubmit}></SupportPortalFilter>
  <div class="w-full">
    <SupportPortalControllers></SupportPortalControllers>
  </div>
</div>

<!-- 
Support Portal should handle throufh URL params the following: 
- Items per page 
- Pagination
- FIltering (product family, product type, document category,document type) 
- Search - not yet 


These values should be derived from the URL params. If not provided, use default values.







-->
