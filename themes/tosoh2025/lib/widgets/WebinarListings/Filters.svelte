<script lang="ts">
  import { onDestroy, onMount } from 'svelte';
  import type { ColumnId } from '../../../types/hubdb';
  import type { FilterWithOptions } from '../../../types/hubdb';
  import FilterForm from '../../components/FiltersForm/FiltersForm.svelte';
  import {
    extractFilterOptions,
    parseUrlFilters,
    extractToleranceConfig,
    type FilterCriteria,
  } from '../../utils/filterUtils/filterUtils.refactored';
  import { clearParams, setSearchParams, updateUrl } from '../../utils/urlUtils';
  import {
    defaultItemsLimit,
    defaultPagination,
    IS_MOCK,
    PROD_TOSOH_WEBINARS_TABLE_ID,
  } from '../../utils/constants';
  import { getTableFilterOptions } from '../../services/fetchTableFilterOptions';
  import { mockWebinarListingsFilterOptions } from './mock';
  import Search from '../../components/Search/Search.svelte';
  import { fade } from 'svelte/transition';
  import TopicFilter from '../../components/TopicFilter/TopicFilter.svelte';
  import { getFilter } from '../../utils/utils';
  import type { TopicFilters } from '../../../types/fields';

  let allAvailableFiltersWithTheirOptions: FilterWithOptions | {} = $state({});
  let isLoading = $state(false);
  let hasError = $state(false);

  const topicFilters = window?.Tosoh?.WebinarListings?.topic_filters?.filters;
  const areFiltersEnabled = topicFilters?.length > 0;
  const searchFromFields = window?.Tosoh?.WebinarListings?.search;
  const searchColumnId = searchFromFields?.hubdb_column_id;

  let rawData: any[] = [];

  let filterDebounceTimeout: ReturnType<typeof setTimeout> | undefined;

  const filtersArray = window?.Tosoh?.WebinarListings?.topic_filters?.filters
    ? [...topicFilters.map((filter: any) => filter.hubdb_column_id)]
    : [];

  const prodWebinarListingsTableId = PROD_TOSOH_WEBINARS_TABLE_ID;

  const debouncedFilterUpdate = () => {
    clearTimeout(filterDebounceTimeout);
    filterDebounceTimeout = setTimeout(() => {
      if (rawData.length > 0) {
        updateFilterOptionsBasedOnCurrentUrl(rawData);
      }
    }, 300);
  };

  const onChange = (event: Event) => {
    onReset();

    updateUrl(event);

    debouncedFilterUpdate();
  };

  const onReset = () => {
    setSearchParams({
      pagination: `${defaultPagination}`,
      limit: `${defaultItemsLimit}`,
      [searchColumnId]: '',
    });

    if (filtersArray?.length > 0) {
      clearParams([...filtersArray, 'language'] as string[]);
    } else {
      clearParams(['language']);
    }

    if (rawData.length > 0) {
      updateFilterOptionsBasedOnCurrentUrl(rawData);
    }
  };
  const getFilterOptions = async () => {
    isLoading = true;

    try {
      let data;

      if (IS_MOCK) {
        data = await getTableFilterOptions({
          filters: filtersArray,
          tableId: prodWebinarListingsTableId,
        });
      } else {
        data = mockWebinarListingsFilterOptions?.results;
      }

      if (!data?.error) {
        if (data?.length > 0) {
          rawData = data;

          updateFilterOptionsBasedOnCurrentUrl(data);
        } else {
          rawData = [];
        }
      }

      if (data?.error) {
        hasError = false;
      }
    } catch (error) {
      hasError = true;
      console.warn('Failed to fetch filter options:', error);
    } finally {
      isLoading = false;
    }
  };

  const updateFilterOptionsBasedOnCurrentUrl = (data: any) => {
    if (!data || data.length === 0) {
      allAvailableFiltersWithTheirOptions = {};
      return;
    }

    try {
      const allUrlParams = parseUrlFilters();

      const currentFilters: FilterCriteria = {};
      Object.entries(allUrlParams).forEach(([key, value]) => {
        if (filtersArray?.includes(key as ColumnId)) {
          currentFilters[key] = value;
        }
      });

      const options = extractFilterOptions(data);

      allAvailableFiltersWithTheirOptions = options;
    } catch (error) {
      console.error('Error updating filter options:', error);
      allAvailableFiltersWithTheirOptions = extractFilterOptions(data);
    }
  };

  const getLabelForSelect = (columnId: any) => {
    return (
      filtersArray?.filter((filterObj) => filterObj?.hubdb_column_id === columnId)?.[0]
        ?.dropdown_filter_placeholder || ''
    );
  };

  onMount(() => {
    getFilterOptions();
  });

  onDestroy(() => {
    // Clean up debounce timeout and cache (like product catalog)
    clearTimeout(filterDebounceTimeout);
  });
</script>

<div
  class="gap-md align-center flex h-full flex-col md:flex-row"
  transition:fade={{ duration: 100 }}
>
  <Search
    manualTableId={prodWebinarListingsTableId}
    filtersToDelete={[...filtersArray, 'pagination', 'limit']}
    {searchFromFields}
  />

  {#if areFiltersEnabled}
    <FilterForm trigger="change" {onChange} {onReset}>
      <div class="gap-md flex w-full">
        {#each filtersArray as columnId}
          {@const filter = getFilter(topicFilters, columnId) as TopicFilters['filters'][number]}

          <TopicFilter
            {filter}
            options={(allAvailableFiltersWithTheirOptions as FilterWithOptions)[
              columnId as ColumnId
            ]}
            name={columnId}
            disabled={isLoading || hasError}
            {isLoading}
            disableReset={true}
            placeholder={getLabelForSelect(columnId)}
            labelPosition="left"
            displayLabel={false}
            customClasses="min-w-[16rem]"
          />
        {/each}
        <button type="button" data-type="reset" class="plain text-imperial-red! w-fit">
          Reset Filters
        </button>
      </div>
    </FilterForm>
  {/if}
</div>
