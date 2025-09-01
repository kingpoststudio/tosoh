<script lang="ts">
  import { onMount } from 'svelte';
  import { defaultItemsLimit, defaultPagination } from '../../utils/constants';
  import FilterForm from '../FilterForm/FilterForm.svelte';
  import { setSearchParams, updateUrl } from '../../utils/urlUtils';
  let { totalItems } = $props();

  const params = new URLSearchParams(window.location.search);
  let options = [6, 12, 18];

  let limit = $state(parseInt(params?.get('limit') || `${defaultItemsLimit}`));
  let numberOfPages = $derived(Math.ceil(totalItems / limit));
  let pagesArray = $derived(Array.from({ length: numberOfPages }, (_, i) => i + 1));

  let pagination = $state(parseInt(params?.get('pagination') || `${defaultPagination}`));
  let canGoBackward = $derived(pagination - 1 > 0);
  let canGoForward = $derived(pagination + 1 <= numberOfPages);

  const onControllerChange = (event: Event) => {
    if ((event.target as HTMLSelectElement)?.name === 'limit') {
      setSearchParams({
        pagination: `${defaultPagination}`,
      });
    }

    updateUrl(event);
  };

  const moveBackward = () => {
    const url = new URL(window.location.href);
    let pagination = url.searchParams.get('pagination');

    if (pagination && parseInt?.(pagination) - 1 > 0) {
      pagination = (parseInt?.(pagination) - 1) as any;
      url.searchParams?.set('pagination', (pagination as any)?.toString());
      window.location.href = url?.toString();
    }
  };

  const moveForward = () => {
    const url = new URL(window.location.href);
    let pagination = url.searchParams.get('pagination');

    if (pagination && parseInt?.(pagination) + 1 <= numberOfPages) {
      pagination = (parseInt?.(pagination) + 1) as any;
      url.searchParams?.set('pagination', (pagination as any)?.toString());
      window.location.href = url?.toString();
    }
  };

  const initControllers = () => {
    const url = new URL(window.location.href);

    if (!url.searchParams.get('pagination')) {
      url.searchParams.set('pagination', `${defaultPagination}`);
    }
    if (!url.searchParams.get('limit')) {
      url.searchParams.set('limit', `${defaultItemsLimit}`);
    }

    window.history.pushState({}, '', url.toString().replace(/%2C/g, ','));
  };

  onMount(() => {
    initControllers();
  });
</script>

<FilterForm onChange={onControllerChange} trigger="change">
  <div
    class="lg:p-sm gap-sm mt-base flex w-full flex-col-reverse justify-center lg:flex-row lg:justify-between"
  >
    <div class="gap-sm flex items-center justify-center text-[#4E4F54]">
      <p>Items per page:</p>
      <select
        bind:value={limit}
        name="limit"
        class="bg-ghost-white p-xs rounded border border-slate-200"
      >
        {#each options as option}
          <option value={option}>{option}</option>
        {/each}
      </select>
      <p>
        {(pagination - 1) * limit || 1} - {Math.min((pagination - 1) * limit + limit, totalItems)} of
        {totalItems}
        items
      </p>
    </div>
    <div class="gap-sm flex justify-center">
      <div class="gap-sm flex items-center text-[#4E4F54]">
        <select
          bind:value={pagination}
          name="pagination"
          class="bg-ghost-white p-xs rounded border border-slate-200"
        >
          {#each pagesArray as page}
            <option value={page}>
              {page}
            </option>
          {/each}
        </select>
        <p>
          of {numberOfPages}
          {numberOfPages === 1 ? 'page' : 'pages'}
        </p>
      </div>
      <div class="gap-sm flex">
        <button
          type="button"
          class="p-sm! outlined border-[#E1E2E3]! text-default! flex aspect-square h-[2.75rem] cursor-pointer items-center justify-center rounded-xl border disabled:cursor-not-allowed disabled:opacity-50"
          aria-label="go one page back"
          onclick={moveBackward}
          disabled={!canGoBackward}
        >
          <div class="h-[0.95rem]">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="100%"
              height="100%"
              viewBox="0 0 10 18"
              fill="none"
            >
              <path
                d="M8.39266 16.0549L1.38184 9.04403L8.39266 2.0332"
                stroke="#4E4F54"
                stroke-width="2.54939"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
            </svg>
          </div>
        </button>
        <button
          type="button"
          class="p-sm! outlined border-[#E1E2E3]! text-default! flex aspect-square h-[2.75rem] cursor-pointer items-center justify-center rounded-xl border disabled:cursor-not-allowed disabled:opacity-50"
          aria-label="go one page after"
          onclick={moveForward}
          disabled={!canGoForward}
        >
          <div class="h-[0.95rem]">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="100%"
              height="100%"
              viewBox="0 0 10 18"
              fill="none"
            >
              <path
                d="M1.64258 16.0549L8.6534 9.04403L1.64258 2.0332"
                stroke="#4E4F54"
                stroke-width="2.54939"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
            </svg>
          </div>
        </button>
      </div>
    </div>
  </div>
</FilterForm>
