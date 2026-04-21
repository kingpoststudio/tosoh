<script lang="ts">
  import { onMount, onDestroy } from 'svelte';
  import { createFilterState } from '../../factories/createFilterState.svelte';
  import SidebarFilters from '../../components/SidebarFilters/SidebarFilters.svelte';
  import { PROD_TOSOH_EMOGLOBINE_ITALIA_TABLE_ID } from '../../utils/constants';
  import { setSearchParams } from '../../utils/urlUtils';
  import { resetPaginationAndFetchDataEvent } from '../../utils/paginationAndLimitUtils';

  let { isParentLoading, formId } = $props();

  const content = window?.Tosoh?.HemoglobinPortalContent;
  const topicFiltersMeta = content?.topic_filters;
  const applyButtonLabel = topicFiltersMeta?.apply_button_label ?? 'Apply';

  const filterState = createFilterState({
    formId,
    topicFilters: content?.topic_filters?.filters,
    prodTableId: PROD_TOSOH_EMOGLOBINE_ITALIA_TABLE_ID,
    filtersTableIdOverride: content?.topic_filters?.hubdb_table_id,
    searchFromFields: content?.search,
  });

  const onClickSubmit = () => {
    const numberInput = document.querySelector('input[type="number"]') as HTMLInputElement;
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
  searchTableId={PROD_TOSOH_EMOGLOBINE_ITALIA_TABLE_ID}
  searchFromFields={content?.search}
  isActivatedQuery={false}
  updateUrl={false}
  filtersTitle={topicFiltersMeta?.filters_title}
  resetLabel={topicFiltersMeta?.reset_filters_label}
>
  {#snippet filterExtra({ filter })}
    {#if filter?.type === 'range-pm'}
      <button type="button" onclick={onClickSubmit} class=" mt-sm w-full hover:bg-red-50"
        >{applyButtonLabel}</button
      >
    {/if}
  {/snippet}
</SidebarFilters>
