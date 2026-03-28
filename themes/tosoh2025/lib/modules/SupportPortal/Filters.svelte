<script lang="ts">
  import { onMount, onDestroy } from 'svelte';
  import { createFilterState } from '../../factories/createFilterState.svelte';
  import SidebarFilters from '../../components/SidebarFilters/SidebarFilters.svelte';
  import { PROD_TOSOH_SUPPORT_PORTAL_TABLE_ID } from '../../utils/constants';

  let { isParentLoading, viewAs, handleChangeView, formId } = $props();

  const content = window?.Tosoh?.SupportPortalContent;
  const isSearchAccessLevelFilterEnabled =
    content?.search?.is_access_level_filter_enabled || false;
  const accessLevel = content?.access_level || 'Customer';
  const forceListView = content?.force_list_view || false;

  const filterState = createFilterState({
    formId,
    topicFilters: content?.topic_filters?.filters,
    prodTableId: PROD_TOSOH_SUPPORT_PORTAL_TABLE_ID,
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
  searchTableId={PROD_TOSOH_SUPPORT_PORTAL_TABLE_ID}
  searchFromFields={content?.search}
  accessLevel={isSearchAccessLevelFilterEnabled ? accessLevel : undefined}
>
  {#snippet extraButtons()}
    {#if !forceListView}
      <button
        type="button"
        class="border-imperial-red p-sm w-full cursor-pointer rounded-lg border hover:bg-red-50"
        onclick={handleChangeView}
      >
        {viewAs === 'grid' ? 'View As List' : 'View As Grid'}
      </button>
    {/if}
  {/snippet}
</SidebarFilters>
