<script lang="ts">
  import { onMount } from 'svelte';
  import type { ColumnId } from '../../../types/hubdb';
  import type { FilterWithOptions } from '../../../types/hubdb';
  import FilterForm from '../FilterForm/FilterForm.svelte';
  import { parseFilterOptions } from '../../utils/filterUtils';
  import { clearParams, setSearchParams, updateUrl } from '../../utils/urlUtils';
  import { defaultItemsLimit, defaultPagination } from '../../utils/constants';
  import { getTableFilterOptions } from '../../services/fetchTableFilterOptions';
  import Select from '../Select/Select.svelte';
  import { mockWebinarListingsFilterOptions } from './mock';

  let { isParentLoading } = $props();

  let allAvailableFiltersWithTheirOptions: FilterWithOptions | {} = $state({});
  let isLoading = $state(false);
  let hasError = $state(false);

  const filtersFromFields = window?.Tosoh?.WebinarListings?.filters
    ? ([...window.Tosoh.WebinarListings.filters.split(',')] as ColumnId[])
    : //remove hardcoded
      ['language'];

  const tableId = window?.Tosoh?.WebinarListings?.tableId;

  const onChange = (event: Event) => {
    onReset();

    updateUrl(event);
  };

  const onReset = () => {
    setSearchParams({
      pagination: `${defaultPagination}`,
      limit: `${defaultItemsLimit}`,
    });

    if (filtersFromFields?.length > 0) {
      clearParams(filtersFromFields as string[]);
    }
  };

  const getFilterOptions = async () => {
    isLoading = true;

    try {
      //   const data = await getTableFilterOptions({
      //     filters: filtersFromFields,
      //     tableId: tableId,
      //   });
      const data = mockWebinarListingsFilterOptions?.results;

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

  onMount(() => {
    getFilterOptions();
  });
</script>

<FilterForm trigger="change" {onChange} {onReset}>
  <div class="gap-md flex w-full">
    {#each filtersFromFields as columnId}
      <div class="min-w-[16rem]">
        <Select
          placeholder={'Select Language'}
          labelPosition="left"
          options={(allAvailableFiltersWithTheirOptions as FilterWithOptions)[columnId as ColumnId]}
          name={columnId}
          displayLabel={false}
          disabled={isParentLoading || isLoading || hasError}
        />
      </div>
    {/each}
  </div>
</FilterForm>
