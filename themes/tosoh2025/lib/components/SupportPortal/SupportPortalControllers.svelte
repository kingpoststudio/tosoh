<script lang="ts">
  import { onMount } from 'svelte';
  import { createFormManager, type FormManagerInstance } from '../../utils/FormManager';

  const options = [6, 12, 18];
  let pagination = $state(0);
  let cardsPerPage = $state(12);
  let totalItems = $state(0);
  let formElement: HTMLFormElement | null = $state(null);
  let formManager: FormManagerInstance | null = $state(null);

  let { onFormSubmit } = $props();

  const getTotalItems = async () => {
    try {
    } catch (error) {}

    try {
      const response = await fetch(
        'https://145184808.hs-sites-eu1.com/hs/serverless/get-support-portal-metadata'
      );
      const data = await response.json();
      totalItems = data?.data?.HUBDB?.support_portal_collection?.total;
      if (!data?.error) {
      }

      if (data?.error) {
      }
    } catch (error) {}
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
</script>

{#snippet itemsPerPage()}
  <div class="gap-sm flex items-center text-[#4E4F54]">
    <p>Items per page:</p>
    <select name="items_per_page" class="bg-ghost-white p-xs rounded border border-slate-200">
      {#each options as option}
        <option selected={option === cardsPerPage} value={option}>{option}</option>
      {/each}
    </select>
    <p>
      {pagination * cardsPerPage || 1} - {pagination * cardsPerPage + cardsPerPage} of {totalItems} items
    </p>
  </div>
{/snippet}

{#snippet paginationSelectors()}
  <div class="gap-sm flex items-center text-[#4E4F54]">
    <select name="pagination" class="bg-ghost-white p-xs rounded border border-slate-200">
      {#each pagesArray as page}
        <option value={page}>{page}</option>
      {/each}
    </select>
    <p>
      of {numberOfPages}
      {numberOfPages === 1 ? 'page' : 'pages'}
    </p>
  </div>
{/snippet}

<form onsubmit={onFormSubmit} bind:this={formElement} class="p-sm flex w-full justify-between">
  {@render itemsPerPage()}
  {@render paginationSelectors()}
</form>

<!-- 
Support Portal should handle throufh URL params the following: 
- Items per page 
- Pagination
- FIltering (product family, product type, document category,document type) 
- Search - not yet 


These values should be derived from the URL params. If not provided, use default values.







-->
