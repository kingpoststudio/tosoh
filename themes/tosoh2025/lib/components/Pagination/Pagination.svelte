<script lang="ts">
  import { onDestroy, onMount } from 'svelte';
  import { on } from 'svelte/events';

  import {
    defaultItemsLimit,
    defaultPagination,
    RESET_PAGINATION_AND_FETCH_DATA_EVENT,
  } from '../../utils/constants';
  import { setSearchParams } from '../../utils/urlUtils';
  import { scrollToTop } from '../../utils/utils';

  let { totalItems, fetchData, idToScrollToTop, paginationSettings } = $props();

  // svelte-ignore state_referenced_locally
  const paginationConfig = {
    itemsPerPageLabel: paginationSettings?.items_per_page_label || 'Items per page:',
    ofLabel: paginationSettings?.of_label || 'of',
    pagesLabel: paginationSettings?.pages_label || 'pages',
    pageLabel: paginationSettings?.page_label || 'page',
    itemsLabel: paginationSettings?.items_label || 'items',
    itemLabel: paginationSettings?.item_label || 'item',
  };

  const params = new URLSearchParams(window.location.search);
  const LIMIT_OPTIONS = [12, 24, 48] as const;

  let limit = $state(parseInt(params?.get('limit') || `${defaultItemsLimit}`));
  let pagination = $state(parseInt(params?.get('pagination') || `${defaultPagination}`));
  let numberOfPages = $derived(Math.ceil(totalItems / limit));
  let pagesArray = $derived(Array.from({ length: numberOfPages }, (_, i) => i + 1));

  let canGoBackward = $derived(pagination - 1 > 0);
  let canGoForward = $derived(pagination + 1 <= numberOfPages);

  const resetPagination = () => {
    setSearchParams({ pagination: defaultPagination.toString() });
    pagination = defaultPagination as number;
  };

  const onLimitChange = (newLimit: number) => {
    setSearchParams({ limit: newLimit.toString() });
    limit = newLimit;
  };

  const onPaginationChange = (newPagination: number) => {
    setSearchParams({ pagination: newPagination.toString() });
    pagination = newPagination;
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

  const resetPaginationAndFetchData = on(
    window,
    RESET_PAGINATION_AND_FETCH_DATA_EVENT,
    async () => {
      resetPagination();
      scrollToTop('smooth', idToScrollToTop);
      await fetchData();
    }
  );

  const moveBackward = () => {
    if (canGoBackward) {
      const previousPagination = pagination - 1;
      onPaginationChange(previousPagination);
      setSearchParams({
        pagination: previousPagination?.toString(),
      });

      fetchData();
      scrollToTop('smooth', idToScrollToTop);
    }
  };

  const moveForward = () => {
    if (canGoForward) {
      const nextPagination = pagination + 1;
      onPaginationChange(nextPagination);
      setSearchParams({
        pagination: nextPagination?.toString(),
      });
      fetchData();
      scrollToTop('smooth', idToScrollToTop);
    }
  };

  onMount(() => {
    initControllers();
  });

  onDestroy(() => {
    resetPaginationAndFetchData();
  });
</script>

<div>
  <div
    class="lg:p-sm gap-sm mt-base flex w-full flex-col-reverse justify-center lg:flex-row lg:justify-between"
  >
    <div class="gap-sm text-nickel flex items-center justify-center">
      <p>{paginationConfig.itemsPerPageLabel}</p>
      <select
        value={limit}
        onchange={async (event) => {
          const target = event.target as HTMLSelectElement;
          onLimitChange(parseInt(target.value));
          resetPagination();
          fetchData();
          scrollToTop('smooth', idToScrollToTop);
        }}
        name="limit"
        class="bg-ghost-white p-xs rounded border border-slate-200"
      >
        {#each LIMIT_OPTIONS as option}
          <option value={option}>{option}</option>
        {/each}
      </select>
      <p>
        {Math.max((pagination - 1) * limit, 1)} - {Math.min(
          (pagination - 1) * limit + limit,
          totalItems
        )}
        {paginationConfig.ofLabel}
        {totalItems}
        {totalItems > 1 ? paginationConfig.itemsLabel : paginationConfig.itemLabel}
      </p>
    </div>
    <div class="gap-sm flex justify-center">
      <div class="gap-sm text-nickel flex items-center">
        <select
          value={pagination}
          name="pagination"
          class="bg-ghost-white p-xs rounded border border-slate-200"
          onchange={(event) => {
            let target = event.target as HTMLSelectElement;
            onPaginationChange(parseInt(target.value));
            fetchData();
            scrollToTop('smooth', idToScrollToTop);
          }}
        >
          {#each pagesArray as page}
            <option value={page}>
              {page}
            </option>
          {/each}
        </select>
        <p>
          {paginationConfig.ofLabel}
          {numberOfPages}
          {numberOfPages === 1 ? paginationConfig.pageLabel : paginationConfig.pagesLabel}
        </p>
      </div>
      <div class="gap-sm flex">
        <button
          type="button"
          class="p-sm! outlined text-nickel! border-light-silver! flex aspect-square h-[2.75rem] cursor-pointer items-center justify-center rounded-xl border disabled:cursor-not-allowed disabled:opacity-50"
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
                stroke="currentColor"
                stroke-width="2.54939"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
            </svg>
          </div>
        </button>
        <button
          type="button"
          class="p-sm! outlined text-nickel! border-light-silver! flex aspect-square h-[2.75rem] cursor-pointer items-center justify-center rounded-xl border disabled:cursor-not-allowed disabled:opacity-50"
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
                stroke="currentColor"
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
</div>
