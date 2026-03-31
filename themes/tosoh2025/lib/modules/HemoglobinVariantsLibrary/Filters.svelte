<script lang="ts">
  import { onMount, onDestroy } from 'svelte';
  import { createFilterState } from '../../factories/createFilterState.svelte';
  import SidebarFilters from '../../components/SidebarFilters/SidebarFilters.svelte';
  import { PROD_TOSOH_HEMOGLOBIN_VARIANTS_LIBRARY_TABLE_ID } from '../../utils/constants';
  import { setSearchParams } from '../../utils/urlUtils';
  import { resetPaginationAndFetchDataEvent } from '../../utils/paginationAndLimitUtils';

  let { isParentLoading, formId } = $props();

  const content = window?.Tosoh?.HemoglobinVariantsLibraryContent;

  const filterState = createFilterState({
    formId,
    topicFilters: content?.topic_filters?.filters,
    prodTableId: PROD_TOSOH_HEMOGLOBIN_VARIANTS_LIBRARY_TABLE_ID,
    filtersTableIdOverride: content?.topic_filters?.hubdb_table_id,
    searchFromFields: content?.search,
    isActivated: true,
  });

  const onClickSubmit = () => {
    const numberInput = document.querySelector('input[name="rt_min"]') as HTMLInputElement;
    if (numberInput?.value) {
      setSearchParams({
        [numberInput.name]: numberInput.value,
      });
      filterState.debouncedFilterUpdate();
      resetPaginationAndFetchDataEvent();
    }
  };

  onMount(() => filterState.fetchInitialData());
  onDestroy(() => filterState.destroy());
</script>

<SidebarFilters
  {formId}
  {filterState}
  {isParentLoading}
  searchTableId={PROD_TOSOH_HEMOGLOBIN_VARIANTS_LIBRARY_TABLE_ID}
  searchFromFields={content?.search}
  updateUrl={false}
>
  {#snippet filterExtra({ filter })}
    {#if filter?.type === 'range-pm'}
      <button type="button" onclick={onClickSubmit} class=" mt-sm w-full hover:bg-red-50"
        >Apply</button
      >
    {/if}
  {/snippet}
</SidebarFilters>
