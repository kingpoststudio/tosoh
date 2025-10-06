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

  import Limit from '../Limit/Limit.svelte';
  import Pagination from '../Pagination/Pagination.svelte';
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
      scrollToTop();
      await fetchData();
    }
  );

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
    <Limit {totalItems} {limit} {pagination} {onLimitChange} {resetPagination} {fetchData} />
    <Pagination {totalItems} {limit} {pagination} {onPaginationChange} {fetchData} />
  </div>
</div>
