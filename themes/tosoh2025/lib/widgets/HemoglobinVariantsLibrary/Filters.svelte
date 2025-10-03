<script lang="ts">
  import { onMount, onDestroy } from 'svelte';
  import { IS_MOCK, PROD_TOSOH_HEMOGLOBIN_VARIANTS_LIBRARY_TABLE_ID } from '../../utils/constants';
  import { setClearParams, setSearchParams, updateUrlFromCheckbox } from '../../utils/urlUtils';

  import ErrorCard from '../../components/ErrorCard/ErrorCard.svelte';
  import SearchInput from '../../components/Search/Search.svelte';
  import FilterForm from '../../components/FiltersForm/FiltersForm.svelte';

  import {
    extractFilterOptions,
    createFilterCache,
    clearFilterCache,
    parseUrlFilters,
    extractToleranceConfig,
    getMemoizedFilterOptionsForColumnWithTolerance,
    type FilterCriteria,
    type FilterOptionsWithQuantity,
    type FilterCache,
  } from '../../utils/filterUtils/filterUtils';

  import type { ColumnId } from '../../../types/hubdb';
  import { getTableFilterOptions } from '../../services/fetchTableFilterOptions';
  import { mockHemoglobinVariantsLibraryFiltersResponse } from './mock';
  import { getFilter } from '../../utils/utils';
  import TopicFilter from '../../components/TopicFilter/TopicFilter.svelte';
  import type { TopicFilters } from '../../../types/fields';
  import { resetFormEvent, updateFormEvent } from '../../utils/formManager';
  import { resetPaginationAndFetchDataEvent } from '../../utils/paginationAndLimitUtils';
  let { isParentLoading, fetchData, formId } = $props();
  // Configuration from HubSpot fields
  const searchFromFields = window?.Tosoh?.HemoglobinVariantsLibraryContent?.search;
  const searchColumnId = searchFromFields?.hubdb_column_id;
  const searchTableId = PROD_TOSOH_HEMOGLOBIN_VARIANTS_LIBRARY_TABLE_ID;

  const topic_filters = window?.Tosoh?.HemoglobinVariantsLibraryContent?.topic_filters?.filters;
  let filtersFromFields = topic_filters?.map((filter: any) => filter.hubdb_column_id) || [];
  filtersFromFields.push(searchColumnId);

  // Extract tolerance configuration from filter definitions
  const toleranceConfig = extractToleranceConfig(topic_filters || []);

  let allAvailableFiltersWithTheirOptions: FilterOptionsWithQuantity | {} = $state({});
  let isLoading = $state(false);
  let hasError = $state(false);

  // Cache for memoized filter options (like product catalog)
  let filterOptionsCache: FilterCache = createFilterCache();

  // Store raw data for advanced filtering
  let rawData: any[] = [];

  // Debounce timeout for filter updates (like product catalog)
  let filterDebounceTimeout: ReturnType<typeof setTimeout> | undefined;

  const resetPaginationAndFetchData = () => {
    resetPaginationAndFetchDataEvent();
  };

  // Debounced filter update (mimics product catalog's debouncedFilterProducts)
  const debouncedFilterUpdate = () => {
    clearTimeout(filterDebounceTimeout);
    filterDebounceTimeout = setTimeout(() => {
      if (rawData.length > 0) {
        updateFilterOptionsBasedOnCurrentUrl(rawData);
      }
    }, 300); // Same debounce timing as product catalog
  };

  const onChange = (event: Event) => {
    const target = event.target as HTMLInputElement;
    if (!target) return;
    if (target.type === 'checkbox') {
      updateUrlFromCheckbox(event);
    } else if (target.name === 'rt_min') {
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

  const onClickSubmit = () => {
    const numberInput = document.querySelector('input[name="rt_min"]') as HTMLInputElement;
    if (numberInput?.value) {
      setSearchParams({
        [numberInput.name]: numberInput.value,
      });
      debouncedFilterUpdate();
      resetPaginationAndFetchData();
    }
  };

  const clearParams = () => {
    if (filtersFromFields?.length > 0) {
      setClearParams(filtersFromFields);
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
    isLoading = true;
    hasError = false;

    try {
      let data;

      if (!IS_MOCK) {
        data = await getTableFilterOptions({
          filters: filtersFromFields,
          tableId: PROD_TOSOH_HEMOGLOBIN_VARIANTS_LIBRARY_TABLE_ID,
        });
      } else {
        data = mockHemoglobinVariantsLibraryFiltersResponse.results as any;
      }

      if (data?.error) {
        hasError = true;
        return;
      }

      if (data?.length > 0) {
        // Store raw data for advanced filtering
        rawData = data;

        updateFilterOptionsBasedOnCurrentUrl(data);
      } else {
        rawData = [];
      }
    } catch (error) {
      hasError = true;
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
        if (filtersFromFields?.includes(key as ColumnId)) {
          currentFilters[key] = value;
        }
      });

      // Calculate filter options for each column individually with proper exclusion
      const options: FilterOptionsWithQuantity = {};

      filtersFromFields.forEach((columnId: ColumnId) => {
        // Skip search column as it's handled separately
        if (columnId === searchColumnId) return;

        // Get filter options for this specific column, with tolerance-aware matching
        const columnOptions = getMemoizedFilterOptionsForColumnWithTolerance(
          data,
          columnId,
          currentFilters,
          toleranceConfig,
          filterOptionsCache
        );

        // Add the options for this column
        options[columnId] = columnOptions;
      });

      allAvailableFiltersWithTheirOptions = options;
    } catch (error) {
      console.error('Error updating filter options:', error);
      // Fallback to basic filter options without quantities
      allAvailableFiltersWithTheirOptions = extractFilterOptions(data);
    }
  };

  const reloadFilterOptions = () => {
    hasError = false;
    fetchInitialData();
  };

  onMount(() => {
    fetchInitialData();
  });

  onDestroy(() => {
    // Clean up debounce timeout and cache (like product catalog)
    clearTimeout(filterDebounceTimeout);
    clearFilterCache(filterOptionsCache);
  });
</script>

{#snippet filterIcon()}
  <div class="h-[1.375rem] w-[1rem]">
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="100%"
      height="100%"
      viewBox="0 0 22 16"
      fill="none"
    >
      <path
        d="M0.295898 1.60442C0.295898 1.34881 0.397441 1.10366 0.578189 0.922915C0.758936 0.742168 1.00408 0.640625 1.2597 0.640625H20.5357C20.7913 0.640625 21.0364 0.742168 21.2172 0.922915C21.3979 1.10366 21.4995 1.34881 21.4995 1.60442C21.4995 1.86004 21.3979 2.10519 21.2172 2.28593C21.0364 2.46668 20.7913 2.56822 20.5357 2.56822H1.2597C1.00408 2.56822 0.758936 2.46668 0.578189 2.28593C0.397441 2.10519 0.295898 1.86004 0.295898 1.60442ZM3.50856 8.02975C3.50856 7.77414 3.61011 7.52899 3.79085 7.34825C3.9716 7.1675 4.21675 7.06596 4.47236 7.06596H17.323C17.5786 7.06596 17.8238 7.1675 18.0045 7.34825C18.1853 7.52899 18.2868 7.77414 18.2868 8.02975C18.2868 8.28537 18.1853 8.53052 18.0045 8.71126C17.8238 8.89201 17.5786 8.99355 17.323 8.99355H4.47236C4.21675 8.99355 3.9716 8.89201 3.79085 8.71126C3.61011 8.53052 3.50856 8.28537 3.50856 8.02975ZM7.36376 14.4551C7.36376 14.1995 7.46531 13.9543 7.64605 13.7736C7.8268 13.5928 8.07195 13.4913 8.32756 13.4913H13.4678C13.7234 13.4913 13.9686 13.5928 14.1493 13.7736C14.3301 13.9543 14.4316 14.1995 14.4316 14.4551C14.4316 14.7107 14.3301 14.9558 14.1493 15.1366C13.9686 15.3173 13.7234 15.4189 13.4678 15.4189H8.32756C8.07195 15.4189 7.8268 15.3173 7.64605 15.1366C7.46531 14.9558 7.36376 14.7107 7.36376 14.4551Z"
        fill="#E4032D"
      />
    </svg>
  </div>
{/snippet}

<div
  class={`bg-ghost-white p-md h-fit rounded-lg transition-all duration-100 lg:sticky lg:top-[6rem] lg:z-10 lg:min-w-[16rem] xl:min-w-[20rem] ${isLoading ? 'animate-pulse' : ''}`}
>
  {#if hasError}
    <ErrorCard message="Failed to load filter options" retryCallback={reloadFilterOptions} />
    <div class="pb-sm"></div>
  {/if}
  <div class="flex w-full items-center justify-between">
    <p class="font-sans-narrow text-2xl font-semibold">Filter</p>
    {@render filterIcon()}
  </div>

  <SearchInput
    {formId}
    customClasses="mt-base"
    manualTableId={searchTableId}
    {searchFromFields}
    disabled={isParentLoading || isLoading || hasError}
    onReset={onResetForSearch}
  />

  <FilterForm updateUrl={false} trigger="change" {onChange} {onReset} {formId}>
    {#each filtersFromFields as columnId}
      {@const filter = getFilter(topic_filters, columnId) as TopicFilters['filters'][number]}
      {#if searchColumnId !== columnId}
        <TopicFilter
          {filter}
          options={(allAvailableFiltersWithTheirOptions as FilterOptionsWithQuantity)[
            columnId as ColumnId
          ] || []}
          name={columnId}
          disabled={isParentLoading || isLoading || hasError}
          {isLoading}
        />

        {#if filter?.type === 'range-pm'}
          <button type="button" onclick={onClickSubmit} class=" mt-sm w-full hover:bg-red-50"
            >Apply</button
          >
        {/if}
      {/if}
    {/each}

    <div class="gap-sm mt-md flex w-full flex-row lg:flex-col">
      <button type="button" data-type="reset" class="outlined w-full hover:bg-red-50">
        Reset
      </button>
    </div>
  </FilterForm>
</div>
