<script lang="ts">
  import { onMount } from 'svelte';
  import {
    defaultItemsLimit,
    defaultPagination,
    PROD_TOSOH_HEMOGLOBIN_VARIANTS_LIBRARY_TABLE_ID,
  } from '../../utils/constants';
  import {
    clearParams,
    setSearchParams,
    updateUrl,
    updateUrlFromCheckbox,
  } from '../../utils/urlUtils';

  import ErrorCard from '../ErrorCard/ErrorCard.svelte';
  import SearchInput from '../Search/Search.svelte';
  import FilterForm from '../FiltersForm/FiltersForm.svelte';
  import { parseFilterOptions } from '../../utils/filterUtils';
  import type { FilterWithOptions, ColumnId } from '../../../types/hubdb';
  import { getTableFilterOptions } from '../../services/fetchTableFilterOptions';
  import { mockHemoglobinVariantsLibraryFiltersResponse } from './mock';
  import { getFilter } from '../../utils/utils';
  import TopicFilter from '../TopicFilter/TopicFilter.svelte';
  import type { TopicFilters } from '../../../types/fields';
  let { isParentLoading } = $props();

  const hemoglobinVariantsLibraryContent = window?.Tosoh?.HemoglobinVariantsLibraryContent;

  const searchFromFields = hemoglobinVariantsLibraryContent?.search;
  const searchColumnId = searchFromFields?.hubdb_column_id;

  const searchTableId = PROD_TOSOH_HEMOGLOBIN_VARIANTS_LIBRARY_TABLE_ID;
  const topic_filters = hemoglobinVariantsLibraryContent?.topic_filters?.filters;
  let filtersFromFields = topic_filters?.map((filter: any) => filter.hubdb_column_id) || [];
  filtersFromFields.push(searchColumnId);

  let allAvailableFiltersWithTheirOptions: FilterWithOptions | {} = $state({});

  let isLoading = $state(false);
  let hasError = $state(false);

  const resetPaginationAndLimit = () => {
    setSearchParams({
      pagination: `${defaultPagination}`,
      limit: `${defaultItemsLimit}`,
    });
  };

  const onChange = (event: Event) => {
    resetPaginationAndLimit();

    if ((event.target as HTMLInputElement).type === 'checkbox') {
      updateUrlFromCheckbox(event);
    } else if ((event.target as HTMLInputElement).type === 'number') {
      return console.log('number');
    } else {
      updateUrl(event);
    }
  };

  const onClickSubmit = () => {
    const numberInput = document.querySelector('input[type="number"]');
    if (numberInput) {
      updateUrl({ target: numberInput } as unknown as Event);
    }
  };

  const onReset = () => {
    resetPaginationAndLimit();

    if (filtersFromFields?.length > 0) {
      clearParams(filtersFromFields as string[]);
    }
  };

  const getFilterOptions = async () => {
    isLoading = true;

    try {
      // const data = await getTableFilterOptions({
      //   filters: filtersFromFields,
      //   tableId: searchTableId,
      // });

      const data = mockHemoglobinVariantsLibraryFiltersResponse.results as any;

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
    customClasses="mt-base"
    manualTableId={searchTableId}
    filtersToDelete={[...filtersFromFields, 'pagination', 'limit']}
    {searchFromFields}
  />

  <FilterForm updateUrl={false} trigger="change" {onChange} {onReset}>
    {#each filtersFromFields as columnId}
      {@const filter = getFilter(topic_filters, columnId) as TopicFilters['filters'][number]}
      {#if searchColumnId !== columnId}
        <TopicFilter
          {filter}
          options={(allAvailableFiltersWithTheirOptions as FilterWithOptions)[columnId as ColumnId]}
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
