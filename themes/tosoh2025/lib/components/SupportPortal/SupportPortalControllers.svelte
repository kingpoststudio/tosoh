<script lang="ts">
  const options = [6, 12, 18];
  let pagination = $state(1);
  let cardsPerPage = $state(6);
  let { totalItems = 100, onFormSubmit } = $props();

  let numberOfPages = $derived(Math.ceil(totalItems / cardsPerPage));

  let pagesArray = $derived(Array.from({ length: numberOfPages }, (_, i) => i + 1));

  //2. create utility to set form fields based on name when parsed frmo url
  //3. set url when values change

  const handleFormSubmit = (event: Event) => {
    event.preventDefault();

    // setFormVa;
  };
</script>

{#snippet itemsPerPage()}
  <div class="gap-sm flex items-center text-[#4E4F54]">
    <p>Items per page:</p>
    <select name="items_per_page" class="bg-ghost-white p-xs rounded border border-slate-200">
      {#each options as option}
        <option value={option}>{option}</option>
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

<div class="p-sm flex w-full justify-between">
  <form onsubmit={onFormSubmit}>
    {@render itemsPerPage()}
    {@render paginationSelectors()}
  </form>
</div>

<!-- 
Support Portal should handle throufh URL params the following: 
- Items per page 
- Pagination
- FIltering (product family, product type, document category,document type) 
- Search - not yet 


These values should be derived from the URL params. If not provided, use default values.







-->
