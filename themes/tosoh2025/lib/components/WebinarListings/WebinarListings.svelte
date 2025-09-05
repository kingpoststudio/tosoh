<svelte:options
  customElement={{
    tag: 'tosoh-webinar-listings',
    shadow: 'none',
  }}
/>

<script lang="ts">
  import ItemsGrid from '../ItemsGrid/ItemsGrid.svelte';
  import PaginationWithLimit from '../PaginationWithLimit/PaginationWithLimit.svelte';
  import Card from './Card.svelte';

  let tableRows: any = $state([]);
  let totalItems = $state(0);
  let hasError = $state(false);
  let isLoading = $state(false);

  const constructFilterParams = () => {
    const params = new URLSearchParams(window.location.search);
    let objWithFilters: any = {};
    const allFilters = [...availableFilters, searchColumnId];
    //product_family, product-type, document_category, document_type
    allFilters?.map((filter) => (objWithFilters[filter] = params?.get(filter) || ''));
    return { ...objWithFilters };
  };
</script>

<div class="md:p-lg p-md h-fit-content flex w-full flex-col">
  <div>
    <span class="text-imperial-red text-xl font-thin">EVENT HIGHLIGHTS</span>
    <h3 class="font-semibold">Upcoming Webinar</h3>
  </div>

  <!-- Cards -->
  <!-- <ItemsGrid {Card}></ItemsGrid> -->
  <!-- Pagination -->

  <PaginationWithLimit totalItems={5}></PaginationWithLimit>
</div>
