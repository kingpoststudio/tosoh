<script lang="ts">
  import { onMount } from 'svelte';
  import { createFormManager, type FormManagerInstance } from '../../utils/FormManager';

  let options = [6, 12, 18];

  let formElement: HTMLFormElement | null = $state(null);
  let formManager: FormManagerInstance | null = $state(null);

  const params = new URLSearchParams(window.location.search);

  let limit = $state(parseInt(params.get('limit') || '12'));
  let pagination = $state(parseInt(params.get('pagination') || '1'));

  let { filterSubmitted, onControllerSubmit, totalItems } = $props();

  let numberOfPages = $derived(Math.ceil(totalItems / limit));

  let pagesArray = $derived(Array.from({ length: numberOfPages }, (_, i) => i + 1));

  const handleFormSubmit = (event: Event) => {
    event.preventDefault();

    if (formManager) {
      formManager.setFormValuesToParams(false);
    }

    if (!formElement) return;

    onControllerSubmit();
  };

  const initiateFormManager = () => {
    if (formElement && !formManager) {
      formManager = createFormManager(
        formElement,
        {
          onValueChange: (e: Event) => {
            if (formElement) {
              handleFormSubmit(e);
            }
          },
        },
        'valueChange'
      );
    }
  };

  $effect(() => {
    if (filterSubmitted > 0) {
      formManager?.setFormValuesToParams(true);
    }
  });

  onMount(() => {
    initiateFormManager();
  });
</script>

<form bind:this={formElement} class="p-sm flex w-full justify-between">
  <div class="gap-sm flex items-center text-[#4E4F54]">
    <p>Items per page:</p>
    <select
      bind:value={limit}
      name="limit"
      class="bg-ghost-white p-xs rounded border border-slate-200"
    >
      {#each options as option}
        <option selected={option === limit} value={option}>{option}</option>
      {/each}
    </select>
    <p>
      {pagination * limit || 1} - {pagination * limit + limit} of {totalItems}
      items
    </p>
  </div>
  <div class="gap-sm flex items-center text-[#4E4F54]">
    <select
      bind:value={pagination}
      name="pagination"
      class="bg-ghost-white p-xs rounded border border-slate-200"
    >
      {#each pagesArray as page}
        <option selected={page === pagination} value={page}>
          {page}
        </option>
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
- Search - not yet implemented
-->
