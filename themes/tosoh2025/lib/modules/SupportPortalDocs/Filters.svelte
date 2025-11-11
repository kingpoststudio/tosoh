<script lang="ts">
  import { onDestroy, onMount } from 'svelte';
  import {
    IS_MOCK,
    PROD_TOSOH_SUPPORT_PORTAL_SDS_DOCS_TABLE_ID,
    PROD_TOSOH_SUPPORT_PORTAL_TABLE_ID,
  } from '../../utils/constants';
  import { mockPortalDocsFilters } from './mock';
  import { setClearParams, setSearchParams, updateUrlFromCheckbox } from '../../utils/urlUtils';

  import ErrorCard from '../../components/ErrorCard/ErrorCard.svelte';
  import SearchInput from '../../components/Search/Search.svelte';
  import FilterForm from '../../components/FiltersForm/FiltersForm.svelte';
  import type { FilterWithOptions, ColumnId } from '../../../types/hubdb';
  import { getTableFilterOptions } from '../../services/fetchTableFilterOptions';
  import TopicFilter from '../../components/TopicFilter/TopicFilter.svelte';
  import {
    getFilter,
    getFilterColumnIds,
    getFiltersTableId,
    parseSearchColumnId,
  } from '../../utils/utils';
  import type { TopicFilters } from '../../../types/fields';
  import {
    extractFilterOptions,
    parseUrlFilters,
    extractToleranceConfig,
    type FilterCriteria,
    createFilterCache,
    type FilterCache,
    clearFilterCache,
    getMemoizedFilterOptionsForColumnWithTolerance,
  } from '../../utils/filterUtils/filterUtils';
  import { resetPaginationAndFetchDataEvent } from '../../utils/paginationAndLimitUtils';
  import { resetFormEvent, updateFormEvent } from '../../utils/formManager';
  let { isParentLoading, formId } = $props();

  const supportPortalDocsContent = window?.Tosoh?.SupportPortalDocsContent;
  const searchFromFields = supportPortalDocsContent?.search;
  const searchColumnId = parseSearchColumnId(searchFromFields);
  const prodSupportPortalDocsTableId = PROD_TOSOH_SUPPORT_PORTAL_SDS_DOCS_TABLE_ID;

  const isSearchAccessLevelFilterEnabled =
    supportPortalDocsContent?.search?.is_access_level_filter_enabled || false;

  let accessLevel = supportPortalDocsContent?.access_level || 'Customer';

  const topic_filters = supportPortalDocsContent?.topic_filters?.filters;
  let filtersFromFields = getFilterColumnIds(topic_filters, 'all', [searchColumnId]) || [];
  const filtersTableId = getFiltersTableId(
    prodSupportPortalDocsTableId,
    supportPortalDocsContent?.topic_filters?.hubdb_table_id
  );

  const toleranceConfig = extractToleranceConfig(topic_filters || []);

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
    if (filtersFromFields?.length > 0) {
      setClearParams(filtersFromFields as string[]);
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

    try {
      let data;

      if (!IS_MOCK) {
        data = await getTableFilterOptions({
          filters: filtersFromFields,
          accessLevel: accessLevel,
          tableId: filtersTableId,
          isActivated: true,
        });
      } else {
        data = mockPortalDocsFilters?.results;
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
        if (filtersFromFields?.includes(key as ColumnId)) {
          currentFilters[key] = value;
        }
      });

      const options: any = {};

      filtersFromFields.forEach((columnId: ColumnId) => {
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

  const reloadFilterOptions = () => {
    hasError = false;
    fetchInitialData();
  };

  onMount(() => {
    fetchInitialData();
  });

  onDestroy(() => {
    clearTimeout(filterDebounceTimeout);
    clearFilterCache(filterOptionsCache);
  });
</script>

{#snippet filterIcon()}
  <div class="w-base h-[1.375rem]">
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
    accessLevel={isSearchAccessLevelFilterEnabled ? accessLevel : undefined}
    manualTableId={prodSupportPortalDocsTableId}
    {searchFromFields}
    onReset={onResetForSearch}
  />
  <FilterForm trigger="change" {onChange} {onReset} {formId}>
    {#each filtersFromFields as columnId}
      {@const filter = getFilter(
        topic_filters,
        columnId as string
      ) as TopicFilters['filters'][number]}

      {#if searchColumnId !== columnId}
        <TopicFilter
          {filter}
          options={(allAvailableFiltersWithTheirOptions as FilterWithOptions)[columnId as ColumnId]}
          name={columnId}
          disabled={isParentLoading || isLoading || hasError}
          {isLoading}
        />
      {/if}
    {/each}

    <div class="gap-sm mt-md flex w-full flex-row lg:flex-col">
      <button type="button" data-type="reset" class="outlined w-full hover:bg-red-50">
        Reset
      </button>
    </div>
  </FilterForm>
</div>
