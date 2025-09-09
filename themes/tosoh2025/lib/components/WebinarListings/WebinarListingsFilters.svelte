<script lang="ts">
  import { onMount } from 'svelte';
  import type { ColumnId } from '../../../types/hubdb';
  import type { FilterWithOptions } from '../../../types/hubdb';
  import FilterForm from '../FilterForm/FilterForm.svelte';
  import { parseFilterOptions } from '../../utils/filterUtils';
  import { clearParams, setSearchParams, updateUrl } from '../../utils/urlUtils';
  import {
    defaultItemsLimit,
    defaultPagination,
    PROD_TOSOH_WEBINARS_TABLE_ID,
  } from '../../utils/constants';
  import { getTableFilterOptions } from '../../services/fetchTableFilterOptions';
  import Select from '../Select/Select.svelte';
  import { mockWebinarListingsFilterOptions } from './mock';
  import Search from '../Search/Search.svelte';

  let { isParentLoading } = $props();

  let allAvailableFiltersWithTheirOptions: FilterWithOptions | {} = $state({});
  let isLoading = $state(false);
  let hasError = $state(false);

  const areFiltersEnabled = window?.Tosoh?.WebinarListings?.filters?.areFiltersEnabled;
  const searchGroup = window?.Tosoh?.WebinarListings?.search;
  const searchColumnId = searchGroup?.searchHubdbColumnId;
  const isSearchEnabled = searchGroup?.isSearchEnabled;
  const searchInputPlaceholder = searchGroup?.searchInputPlaceholder;

  const filtersArray = window?.Tosoh?.WebinarListings?.filters
    ? [...window.Tosoh.WebinarListings.filters.dropdownFilters]
    : [];

  const filtersFromFields = [...filtersArray?.map((filter) => filter?.hubdb_column_id)];

  // const tableId = window?.Tosoh?.WebinarListings?.tableId;
  const tableId = PROD_TOSOH_WEBINARS_TABLE_ID;

  const onChange = (event: Event) => {
    onReset();

    updateUrl(event);
  };

  const onReset = () => {
    setSearchParams({
      pagination: `${defaultPagination}`,
      limit: `${defaultItemsLimit}`,
      [searchColumnId]: '',
    });

    if (filtersFromFields?.length > 0) {
      clearParams([...filtersFromFields, 'language'] as string[]);
    } else {
      clearParams(['language']);
    }
  };
  const getFilterOptions = async () => {
    isLoading = true;

    try {
      const data = await getTableFilterOptions({
        filters: filtersFromFields,
        tableId: tableId,
      });
      // const data = mockWebinarListingsFilterOptions?.results;

      if (!data?.error) {
        if (data?.length > 0) {
          filterValuesForSelectsBasedOnUrl(data);
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

  const filterValuesForSelectsBasedOnUrl = (allRows: any) => {
    if (!allRows || allRows.length === 0) {
      return;
    }

    allAvailableFiltersWithTheirOptions = parseFilterOptions(allRows);
  };

  const reloadFilterOptions = () => {
    hasError = false;
    getFilterOptions();
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
</script>

<div class="gap-md align-center flex h-full flex-col md:flex-row">
  {#if isSearchEnabled}
    <Search
      searchTableId={tableId}
      filtersFromFields={[...filtersFromFields, 'pagination', 'limit']}
      {searchColumnId}
      placeholder={searchInputPlaceholder}
    />
  {/if}
  {#if areFiltersEnabled}
    <FilterForm trigger="change" {onChange} {onReset}>
      <div class="gap-md flex w-full">
        {#each filtersFromFields as columnId}
          <div class="min-w-[16rem]">
            <Select
              disableReset={true}
              placeholder={getLabelForSelect(columnId)}
              labelPosition="left"
              options={(allAvailableFiltersWithTheirOptions as FilterWithOptions)[
                columnId as ColumnId
              ]}
              name={columnId}
              displayLabel={false}
              disabled={isParentLoading || isLoading || hasError}
            />
          </div>
        {/each}
        <button type="button" data-type="reset" class="plain text-imperial-red! w-fit">
          Reset Filters
        </button>
      </div>
    </FilterForm>
  {/if}
</div>
