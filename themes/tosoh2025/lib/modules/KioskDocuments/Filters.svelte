<script lang="ts">
  import { onMount, onDestroy } from 'svelte';
  import { createFilterState } from '../../factories/createFilterState.svelte';
  import SidebarFilters from '../../components/SidebarFilters/SidebarFilters.svelte';
  import { PROD_TOSOH_KIOSK_DOCUMENTS_TABLE_ID } from '../../utils/constants';

  let { isParentLoading, formId } = $props();

  const content = window?.Tosoh?.KioskDocumentsContent;

  const filterState = createFilterState({
    formId,
    topicFilters: content?.topic_filters?.filters,
    prodTableId: PROD_TOSOH_KIOSK_DOCUMENTS_TABLE_ID,
    filtersTableIdOverride: content?.topic_filters?.hubdb_table_id,
    searchFromFields: content?.search,
    isActivated: true,
  });

  onMount(() => filterState.fetchInitialData());
  onDestroy(() => filterState.destroy());
</script>

<SidebarFilters
  {formId}
  {filterState}
  {isParentLoading}
  searchTableId={PROD_TOSOH_KIOSK_DOCUMENTS_TABLE_ID}
  searchFromFields={content?.search}
/>
