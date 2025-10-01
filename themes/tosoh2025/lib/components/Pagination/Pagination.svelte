<script lang="ts">
  import { setSearchParams } from '../../utils/urlUtils';

  let { totalItems, limit, pagination, onPaginationChange, fetchData } = $props();

  let numberOfPages = $derived(Math.ceil(totalItems / limit));
  let pagesArray = $derived(Array.from({ length: numberOfPages }, (_, i) => i + 1));

  let canGoBackward = $derived(pagination - 1 > 0);
  let canGoForward = $derived(pagination + 1 <= numberOfPages);

  const moveBackward = () => {
    if (pagination && parseInt?.(pagination) - 1 > 0) {
      const newPagination = (parseInt?.(pagination) - 1) as any;
      onPaginationChange(newPagination);
      setSearchParams({
        pagination: newPagination?.toString(),
      });
      fetchData();
    }
  };

  const moveForward = () => {
    if (pagination && parseInt?.(pagination) + 1 <= numberOfPages) {
      const newPagination = (parseInt?.(pagination) + 1) as any;
      onPaginationChange(newPagination);
      setSearchParams({
        pagination: newPagination?.toString(),
      });
      fetchData();
    }
  };
</script>

<div class="gap-sm flex justify-center">
  <div class="gap-sm flex items-center text-[#4E4F54]">
    <select
      value={pagination}
      name="pagination"
      class="bg-ghost-white p-xs rounded border border-slate-200"
      onchange={(event) => {
        let target = event.target as HTMLSelectElement;
        onPaginationChange(parseInt(target.value));
        fetchData();
      }}
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
