<script lang="ts">
  import { onDestroy, onMount } from 'svelte';
  import type { ColumnId } from '../../../types/hubdb';
  import type { FilterWithOptions } from '../../../types/hubdb';
  import FilterForm from '../../components/FiltersForm/FiltersForm.svelte';
  import {
    clearFilterCache,
    createFilterCache,
    getMemoizedFilterOptionsForColumnWithTolerance,
    extractFilterOptions,
    extractToleranceConfig,
    parseUrlFilters,
    type FilterCache,
    type FilterCriteria,
  } from '../../utils/filterUtils/filterUtils';
  import { setClearParams, setSearchParams, updateUrlFromCheckbox } from '../../utils/urlUtils';
  import { IS_MOCK, PROD_TOSOH_WEBINARS_TABLE_ID } from '../../utils/constants';
  import { getTableFilterOptions } from '../../services/fetchTableFilterOptions';
  import { mockWebinarListingsFilterOptions } from './mock';
  import Search from '../../components/Search/Search.svelte';
  import { fade } from 'svelte/transition';
  import TopicFilter from '../../components/TopicFilter/TopicFilter.svelte';
  import {
    getFilter,
    getFilterColumnIds,
    getFiltersTableId,
    parseSearchColumnId,
  } from '../../utils/utils';
  import type { TopicFilters } from '../../../types/fields';
  import { resetPaginationAndFetchDataEvent } from '../../utils/paginationAndLimitUtils';
  import { resetFormEvent, updateFormEvent } from '../../utils/formManager';

  let { formId, isSkeleton = false }: { formId: string; isSkeleton?: boolean } = $props();

  const prodWebinarListingsTableId = PROD_TOSOH_WEBINARS_TABLE_ID;
  const webinarListingsWindow = window.Tosoh?.WebinarListings;
  const topicFilters = webinarListingsWindow?.topic_filters?.filters;
  const filtersTableId = getFiltersTableId(
    PROD_TOSOH_WEBINARS_TABLE_ID,
    webinarListingsWindow?.topic_filters?.hubdb_table_id
  );

  const areFiltersEnabled = topicFilters?.length > 0;
  const searchFromFields = webinarListingsWindow?.search;
  const searchColumnId = parseSearchColumnId(searchFromFields);
  const filtersArray = getFilterColumnIds(topicFilters, 'all', [searchColumnId]) || [];

  const toleranceConfig = extractToleranceConfig(topicFilters || []);

  let allAvailableFiltersWithTheirOptions: FilterWithOptions | {} = $state({});
  let isLoading = $state(false);
  let hasError = $state(false);

  let filterOptionsCache: FilterCache = createFilterCache();

  let rawData: any[] = [];

  let filterDebounceTimeout: ReturnType<typeof setTimeout> | undefined;

  const resetPaginationAndFetchData = () => {
    resetPaginationAndFetchDataEvent();
  };

  const debouncedFilterUpdate = () => {
    clearTimeout(filterDebounceTimeout);
    filterDebounceTimeout = setTimeout(() => {
      if (rawData.length > 0) {
        updateFilterOptionsBasedOnCurrentUrl(rawData);
      }
    }, 300);
  };

  const onChange = (event: Event) => {
    const target = event.target as HTMLInputElement;
    if (!target) return;
    if (target.type === 'checkbox') {
      updateUrlFromCheckbox(event);
    } else if (target.type === 'number') {
      return;
    } else {
      setSearchParams({
        [target.name]: target.value,
      });
    }
    debouncedFilterUpdate();

    updateFormEvent(formId);
    resetPaginationAndFetchData();
  };

  const clearParams = () => {
    if (filtersArray?.length > 0) {
      setClearParams(filtersArray);
    }
  };

  const onResetForSearch = (searchCb: () => void) => {
    clearParams();
    resetFormEvent(formId);
    searchCb();

    if (rawData.length > 0) {
      updateFilterOptionsBasedOnCurrentUrl(rawData);
    }

    resetPaginationAndFetchData();
  };

  const onReset = () => {
    clearParams();
    clearFilterCache(filterOptionsCache);

    if (rawData.length > 0) {
      updateFilterOptionsBasedOnCurrentUrl(rawData);
    }

    resetFormEvent(formId);

    resetPaginationAndFetchData();
  };

  const fetchInitialData = async () => {
    if (isSkeleton) return;
    isLoading = true;

    try {
      let data;

      if (!IS_MOCK) {
        data = await getTableFilterOptions({
          filters: filtersArray,
          tableId: filtersTableId,
          isActivated: true,
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

      const options: any = {};

      filtersArray.forEach((columnId: ColumnId) => {
        if (columnId === searchColumnId) return;

        const columnOptions = getMemoizedFilterOptionsForColumnWithTolerance(
          data,
          columnId,
          currentFilters,
          toleranceConfig,
          filterOptionsCache
        );

        options[columnId] = columnOptions;
      });

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
    fetchInitialData();
  });

  onDestroy(() => {
    clearTimeout(filterDebounceTimeout);
    clearFilterCache(filterOptionsCache);
  });
</script>

<div
  class="gap-md align-center flex h-full flex-col md:flex-row"
  transition:fade={{ duration: 100 }}
>
  <Search
    manualTableId={prodWebinarListingsTableId}
    {searchFromFields}
    {formId}
    onReset={onResetForSearch}
  />

  {#if areFiltersEnabled}
    <FilterForm trigger="change" {onChange} {onReset} {formId}>
      <div class="gap-md flex h-full w-full">
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
            placeholder={getLabelForSelect(columnId)}
            labelPosition="left"
            displayLabel={false}
            customClasses="min-w-[16rem] h-full"
          />
        {/each}
        <button type="button" data-type="reset" class="plain text-imperial-red! w-fit">
          Reset Filters
        </button>
      </div>
    </FilterForm>
  {/if}
</div>
