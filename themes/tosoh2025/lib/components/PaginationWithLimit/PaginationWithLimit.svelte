<script lang="ts">
  import { onMount } from 'svelte';
  import { defaultItemsLimit, defaultPagination } from '../../utils/constants';
  import { setSearchParams, updateUrl } from '../../utils/urlUtils';

  import Limit from '../Limit/Limit.svelte';
  import FilterForm from '../FiltersForm/FiltersForm.svelte';
  import Pagination from '../Pagination/Pagination.svelte';

  let { totalItems } = $props();

  const params = new URLSearchParams(window.location.search);
  let limit = $state(parseInt(params?.get('limit') || `${defaultItemsLimit}`));
  let pagination = $state(parseInt(params?.get('pagination') || `${defaultPagination}`));

  const onFormChange = (event: Event) => {
    if ((event.target as HTMLSelectElement)?.name === 'limit') {
      setSearchParams({
        pagination: `${defaultPagination}`,
      });
    }

    updateUrl(event);
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

<FilterForm onChange={onFormChange} trigger="change">
  <div
    class="lg:p-sm gap-sm mt-base flex w-full flex-col-reverse justify-center lg:flex-row lg:justify-between"
  >
    <Limit {totalItems} {limit} {pagination} />
    <Pagination {totalItems} {limit} {pagination} />
  </div>
</FilterForm>
