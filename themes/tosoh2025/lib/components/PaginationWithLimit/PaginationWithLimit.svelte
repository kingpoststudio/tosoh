<script lang="ts">
  import { onDestroy, onMount } from 'svelte';
  import { defaultItemsLimit, defaultPagination } from '../../utils/constants';
  import { setSearchParams } from '../../utils/urlUtils';

  import Limit from '../Limit/Limit.svelte';
  import Pagination from '../Pagination/Pagination.svelte';
  import { on } from 'svelte/events';

  let { totalItems, fetchData } = $props();

  const params = new URLSearchParams(window.location.search);
  let limit = $state(parseInt(params?.get('limit') || `${defaultItemsLimit}`));
  let pagination = $state(parseInt(params?.get('pagination') || `${defaultPagination}`));

  const resetPagination = () => {
    setSearchParams({ pagination: defaultPagination.toString() });
    pagination = defaultPagination as any;
  };

  const onLimitChange = (newLimit: number) => {
    setSearchParams({ limit: newLimit.toString() });
    limit = newLimit;
  };
  const onPaginationChange = (newPagination: number) => {
    setSearchParams({ pagination: newPagination.toString() });
    pagination = newPagination;
  };

  const resetLimit = () => {
    setSearchParams({ limit: defaultItemsLimit.toString() });
    limit = defaultItemsLimit as any;
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

  const reset = on(window, 'TosohPaginationWithLimitResetAndFetchData', async () => {
    resetPagination();
    resetLimit();

    await fetchData();
  });

  onMount(() => {
    initControllers();
  });

  onDestroy(() => {
    reset();
  });
</script>

<div>
  <div
    class="lg:p-sm gap-sm mt-base flex w-full flex-col-reverse justify-center lg:flex-row lg:justify-between"
  >
    <Limit {totalItems} {limit} {pagination} {onLimitChange} {resetPagination} {fetchData} />
    <Pagination {totalItems} {limit} {pagination} {onPaginationChange} {fetchData} />
  </div>
</div>
