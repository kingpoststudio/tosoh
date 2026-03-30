<script lang="ts">
  import { onMount, onDestroy } from 'svelte';
  import { createFilterState } from '../../factories/createFilterState.svelte';
  import SidebarFilters from '../../components/SidebarFilters/SidebarFilters.svelte';
  import {
    DEFAULT_ACCESS_LEVEL,
    PROD_TOSOH_SUPPORT_PORTAL_SDS_DOCS_TABLE_ID,
  } from '../../utils/constants';

  let { isParentLoading, formId } = $props();

  const content = window?.Tosoh?.SupportPortalDocsContent;
  const isSearchAccessLevelFilterEnabled =
    content?.search?.is_access_level_filter_enabled || false;
  const accessLevel = content?.access_level || DEFAULT_ACCESS_LEVEL;

  const filterState = createFilterState({
    formId,
    topicFilters: content?.topic_filters?.filters,
    prodTableId: PROD_TOSOH_SUPPORT_PORTAL_SDS_DOCS_TABLE_ID,
    filtersTableIdOverride: content?.topic_filters?.hubdb_table_id,
    searchFromFields: content?.search,
    accessLevel,
    isActivated: true,
  });

  onMount(() => filterState.fetchInitialData());
  onDestroy(() => filterState.destroy());
</script>

<SidebarFilters
  {formId}
  {filterState}
  {isParentLoading}
  searchTableId={PROD_TOSOH_SUPPORT_PORTAL_SDS_DOCS_TABLE_ID}
  searchFromFields={content?.search}
  accessLevel={isSearchAccessLevelFilterEnabled ? accessLevel : undefined}
/>
