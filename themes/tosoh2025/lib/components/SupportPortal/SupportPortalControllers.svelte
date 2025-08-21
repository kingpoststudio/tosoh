<script lang="ts">
  import { onMount } from 'svelte';
  import { createFormManager, type FormManagerInstance } from '../../utils/FormManager';
  import { cacheResponse, useCachedData } from '../../utils/CacheManager';
  const CACHE_KEY = 'support_portal_total_items';

  let options = [6, 12, 18];
  let pagination = $state(1);
  let cardsPerPage = $state(12);
  let totalItems = $state(0);
  let formElement: HTMLFormElement | null = $state(null);
  let formManager: FormManagerInstance | null = $state(null);
  let { onFormSubmit } = $props();

  const useTotalItemsFromCache = (checkTime: boolean) => {
    try {
      const data = useCachedData(CACHE_KEY, checkTime) as any;

      if (data) {
        console.log('used cache');
        const totalItemsFromCache = data?.data?.HUBDB?.support_portal_collection?.total;
        totalItems = totalItemsFromCache;
        return data;
      }
    } catch (e) {
      console.log('Error while trying to parse cache for portal controllers');
    }
  };

  const getTotalItems = async () => {
    const wasCacheValid = useTotalItemsFromCache(true);

    if (wasCacheValid) return;

    try {
      const response = await fetch(
        'https://145184808.hs-sites-eu1.com/hs/serverless/get-support-portal-metadata'
      );
      const data = await response.json();
      if (!data?.error) {
        cacheResponse(CACHE_KEY, data);
        totalItems = data?.data?.HUBDB?.support_portal_collection?.total;
      }

      if (data?.error) {
        useTotalItemsFromCache(false);
      }
    } catch (error) {
      useTotalItemsFromCache(false);
    }
  };

  let numberOfPages = $derived(Math.ceil(totalItems / cardsPerPage));

  let pagesArray = $derived(Array.from({ length: numberOfPages }, (_, i) => i + 1));

  const handleFormSubmit = (event: Event) => {
    event.preventDefault();

    if (formManager) {
      formManager.setFormValuesToParams(false);
    }

    if (!formElement) return;

    const formData = new FormData(formElement);
    onFormSubmit(formData);
  };

  const initiateFormManager = () => {
    if (formElement && !formManager) {
      formManager = createFormManager(
        formElement,
        {
          onSubmit: (e) => {
            if (formElement) {
              handleFormSubmit(e);
            }
          },
          onReset: () => {},
        },
        'valueChange'
      );
    }
  };

  onMount(() => {
    getTotalItems();
    initiateFormManager();
  });

  $effect(() => {
    console.log(cardsPerPage);
  });
</script>

<form onsubmit={onFormSubmit} bind:this={formElement} class="p-sm flex w-full justify-between">
  <div class="gap-sm flex items-center text-[#4E4F54]">
    <p>Items per page:</p>
    <select
      bind:value={cardsPerPage}
      name="items_per_page"
      class="bg-ghost-white p-xs rounded border border-slate-200"
    >
      {#each options as option}
        <option selected={option === cardsPerPage} value={option}>{option}</option>
      {/each}
    </select>
    <p>
      {pagination * cardsPerPage || 1} - {pagination * cardsPerPage + cardsPerPage} of {totalItems} items
    </p>
  </div>
  <div class="gap-sm flex items-center text-[#4E4F54]">
    <select
      bind:value={pagination}
      name="pagination"
      class="bg-ghost-white p-xs rounded border border-slate-200"
    >
      {#each pagesArray as page}
        <option value={page}>{page}</option>
      {/each}
    </select>
    <p>
      of {numberOfPages}
      {numberOfPages === 1 ? 'page' : 'pages'}
    </p>
  </div>
</form>

<!-- 
Support Portal should handle throufh URL params the following: 
- Items per page 
- Pagination
- FIltering (product family, product type, document category,document type) 
- Search - not yet 


These values should be derived from the URL params. If not provided, use default values.







-->
