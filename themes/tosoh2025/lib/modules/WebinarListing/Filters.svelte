<script lang="ts">
  import { onMount, onDestroy } from 'svelte';
  import { createFilterState } from '../../factories/createFilterState.svelte';
  import type { ColumnId, FilterWithOptions } from '../../../types/hubdb';
  import type { TopicFilters } from '../../../types/fields';
  import FilterForm from '../../components/FiltersForm/FiltersForm.svelte';
  import Search from '../../components/Search/Search.svelte';
  import TopicFilter from '../../components/TopicFilter/TopicFilter.svelte';
  import { PROD_TOSOH_WEBINARS_TABLE_ID } from '../../utils/constants';
  import { getFilter } from '../../utils/utils';
  import { fade } from 'svelte/transition';

  let { formId, isSkeleton = false }: { formId: string; isSkeleton?: boolean } = $props();

  const webinarListingsWindow = window.Tosoh?.WebinarListings;
  const areFiltersEnabled = webinarListingsWindow?.topic_filters?.filters?.length > 0;
  const resetFiltersLabel = webinarListingsWindow?.topic_filters?.reset_filters_label ?? 'Reset Filters';

  const filterState = createFilterState({
    formId,
    topicFilters: webinarListingsWindow?.topic_filters?.filters,
    prodTableId: PROD_TOSOH_WEBINARS_TABLE_ID,
    filtersTableIdOverride: webinarListingsWindow?.topic_filters?.hubdb_table_id,
    searchFromFields: webinarListingsWindow?.search,
    isActivated: true,
    skipOnSkeleton: isSkeleton,
  });

  const getLabelForSelect = (columnId: any) => {
    return (
      filterState.filtersArray?.filter((filterObj) => filterObj?.hubdb_column_id === columnId)?.[0]
        ?.dropdown_filter_placeholder || ''
    );
  };

  onMount(() => filterState.fetchInitialData());
  onDestroy(() => filterState.destroy());
</script>

<div
  class="gap-md align-center flex h-full flex-col md:flex-row"
  transition:fade={{ duration: 100 }}
>
  <Search
    manualTableId={PROD_TOSOH_WEBINARS_TABLE_ID}
    searchFromFields={webinarListingsWindow?.search}
    {formId}
    onReset={filterState.onResetForSearch}
  />

  {#if areFiltersEnabled}
    <FilterForm trigger="change" onChange={filterState.onChange} onReset={filterState.onReset} {formId}>
      <div class="gap-md flex h-full w-full">
        {#each filterState.filtersArray as columnId}
          {@const filter = getFilter(filterState.topicFilters, columnId) as TopicFilters['filters'][number]}
          <TopicFilter
            {filter}
            options={(filterState.allOptions as FilterWithOptions)[
              columnId as ColumnId
            ]}
            name={columnId}
            disabled={filterState.isLoading || filterState.hasError}
            isLoading={filterState.isLoading}
            placeholder={getLabelForSelect(columnId)}
            labelPosition="left"
            displayLabel={false}
            customClasses="min-w-[16rem] h-full"
          />
        {/each}
        <button type="button" data-type="reset" class="plain text-imperial-red! w-fit">
          {resetFiltersLabel}
        </button>
      </div>
    </FilterForm>
  {/if}
</div>
