<svelte:options
  customElement={{
    tag: 'tosoh-support-portal',
    shadow: 'none',
  }}
/>

<script>
  import SupportPortalFilter from './SupportPortalFilter.svelte';
  import { onMount } from 'svelte';

  const params = new URLSearchParams(window.location.href);

  const formValues = {
    items_per_page: parseInt(params?.get('items_per_page')) || 10,
    pagination: parseInt(params?.get('pagination')) || 1,
    product_family: params?.get('product_family') || '',
    product_type: params?.get('product_type') || '',
    document_category: params?.get('document_category') || '',
    document_type: params?.get('document_type') || '',
    search: params?.get('search') || '',
  };

  const createQueryString = (formValues) => {
    return new URLSearchParams(formValues).toString();
  };

  const fetchData = async () => {
    const response = await fetch(
      `https://145184808.hs-sites-eu1.com/hs/serverless/get-support-portal-collection`,
      {
        headers: {
          'Content-Type': 'application/json',
          method: 'POST',
        },
        body: JSON.stringify(formValues),
      }
    );
    const data = await response.json();
    console.log(data, 'data');
  };

  onMount(() => {
    fetchData();
  });
</script>

<div class="wrapper mt-lg flex">
  <SupportPortalFilter></SupportPortalFilter>
</div>

<!-- 
Support Portal should handle throufh URL params the following: 
- Items per page 
- Pagination
- FIltering (product family, product type, document category,document type) 
- Search - not yet 


These values should be derived from the URL params. If not provided, use default values.







-->
