<script lang="ts">
  import { onMount, onDestroy } from 'svelte';
  let { isParentLoading, hasParentError, viewAs, handleChangeView } = $props();

  import type { LabelValue, SupportPortalRowForFilter } from '../../../types/hubdb';

  import ErrorCard from '../ErrorCard/ErrorCard.svelte';
  import SearchInput from '../Search/Search.svelte';
  import Select from '../Select/Select.svelte';
  import { mockPortalFilters } from './mock';
  import { clearParams, setSearchParams, updateUrl } from '../../utils/urlUtils';
  import FilterForm from '../FilterForm/FilterForm.svelte';
  import { defaultItemsLimit, defaultPagination } from '../../utils/constants';

  const searchFromFields = window?.Tosoh?.SupportPortalContent?.search;
  const searchColumnId = searchFromFields?.hubdb_column_id;

  let filtersFromFields = window?.Tosoh?.SupportPortalContent?.filters
    ? [...window.Tosoh.SupportPortalContent.filters.split(','), searchColumnId]
    : [];

  let allAvailableColumnIdsWithTheirValues: Record<string, any> = $state({});

  let isLoading = $state(false);
  let hasError = $state(false);

  const onChange = (event: Event) => {
    onReset();

    setSearchParams({
      pagination: `${defaultPagination}`,
      limit: `${defaultItemsLimit}`,
    });

    updateUrl(event);
  };

  const onReset = () => {
    if (filtersFromFields?.length > 0) {
      clearParams(filtersFromFields as string[]);
    }
  };

  const parseFilterOptions = (rows: SupportPortalRowForFilter[]) => {
    let columnsIdsWithAllTheirAvailableValues: Record<string, any> = {};

    if (rows && rows?.length > 0) {
      rows.forEach((row) => {
        const rowValues = row?.values;

        Object.keys(rowValues)?.map((colummnId) => {
          if ((rowValues as any)[colummnId] && Array.isArray((rowValues as any)[colummnId])) {
            return (columnsIdsWithAllTheirAvailableValues[colummnId] = []);
          }

          if ((rowValues as any)[colummnId] && (rowValues as any)[colummnId]?.label) {
            return (columnsIdsWithAllTheirAvailableValues[colummnId] = []);
          }
        });
      });

      rows.forEach((row) => {
        const rowValues = row?.values;

        Object.keys(rowValues)?.map((colummnId) => {
          //array types
          if (Array.isArray((rowValues as any)[colummnId])) {
            const arrayWithOptions = (rowValues as any)[colummnId] as LabelValue[];

            if (arrayWithOptions && arrayWithOptions.length > 0) {
              arrayWithOptions?.map((option) => {
                const doesValueInColumnIdExists = columnsIdsWithAllTheirAvailableValues[
                  colummnId
                ]?.some((existingValue: LabelValue) => existingValue.label === option?.label);

                if (!doesValueInColumnIdExists) {
                  columnsIdsWithAllTheirAvailableValues[colummnId].push(option);
                }
              });
            }
          }

          //object types
          if ((rowValues as any)[colummnId]?.label) {
            const doesValueInColumnIdExists = columnsIdsWithAllTheirAvailableValues[
              colummnId
            ]?.some((option: any) => option.label === (rowValues as any)[colummnId]?.label);

            if (!doesValueInColumnIdExists) {
              columnsIdsWithAllTheirAvailableValues[colummnId].push((rowValues as any)[colummnId]);
            }
          }
        });
      });
    }

    allAvailableColumnIdsWithTheirValues = columnsIdsWithAllTheirAvailableValues;
  };

  const getFilterOptions = async () => {
    isLoading = true;

    try {
      const response = await fetch(
        `https://${window.location.hostname}/hs/serverless/get-support-portal-filter-options`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            filters: filtersFromFields,
          }),
        }
      );
      //TODO: IMPORTANT REMOVE
      // const data = mockPortalFilters;
      const data = await response?.json();

      if (!data?.error) {
        const filterOptions = data.results;

        if (filterOptions?.length > 0) {
          setAvailableFiltersBasedOnUrl(filterOptions);
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

  const doesColumnIdContainValueFromUrl = (
    row: SupportPortalRowForFilter['values'],
    columnId: keyof SupportPortalRowForFilter
  ) => {
    const params = new URLSearchParams(window.location.search);
    let paramValueWithColumnId = params?.get(columnId);
    let doesContain = false;

    if (!row || !columnId) {
      return doesContain;
    }

    if (!row?.[columnId]) {
      return doesContain;
    }

    if (!paramValueWithColumnId) {
      return doesContain;
    }

    if (row[columnId] && row[columnId]?.length > 0 && Array.isArray(row[columnId])) {
      row[columnId]?.map((selectionObjects: LabelValue) => {
        if (!doesContain) {
          return (doesContain = selectionObjects?.label === paramValueWithColumnId);
        }
      });
    }

    if (row[columnId] && typeof row[columnId] === 'string' && row[columnId]?.length > 0) {
      const stringToSearchAgainst = row[columnId]?.toLowerCase();
      const searchString = paramValueWithColumnId?.toLowerCase();

      if (!doesContain) {
        return (doesContain = stringToSearchAgainst?.includes(searchString));
      }
    }

    if (row[columnId] && typeof row?.[columnId]?.label) {
      if (!doesContain) {
        return (doesContain = row[columnId]?.label === paramValueWithColumnId);
      }
    }

    return doesContain;
  };

  const doesMatchContainAllTheRequiredFilters = (matches: any) => {
    const params = new URLSearchParams(window.location.search);

    const requiredFilters = filtersFromFields?.filter((columnId) => {
      if (params.get(columnId as any)) {
        return true;
      }
      return false;
    });

    let hasAllTheNeccessaryFilters = true;
    let rowMatches = Object?.keys(matches)?.map((columnId) => columnId) || [];

    requiredFilters?.forEach((requiredColumnId) => {
      if (!rowMatches?.some((v) => v === requiredColumnId)) {
        hasAllTheNeccessaryFilters = false;
      }
    });

    return hasAllTheNeccessaryFilters;
  };

  const doesMatchAllColumnIds = (matches: {} | any) => {
    let matchesAll = true;
    if (matches && Object?.keys(matches)) {
      if (!doesMatchContainAllTheRequiredFilters(matches)) {
        matchesAll = false;
      }

      Object?.keys(matches)?.map((columnId) => {
        if (!matches[columnId]) {
          matchesAll = false;
        }
      });
    }

    return matchesAll;
  };

  const setAvailableFiltersBasedOnUrl = (filterRows: any) => {
    if (!filterRows || filterRows.length === 0) {
      return;
    }

    const filteredOptions = filterRows.filter((row: SupportPortalRowForFilter) => {
      let matches = {};
      const rowValues = row.values;
      Object.keys(rowValues)?.map((columnId: any) => {
        const params = new URLSearchParams(window.location.search);

        let paramValueWithColumnId = params?.get(columnId);

        if (paramValueWithColumnId) {
          //init in matches with false as default
          (matches as any)[columnId] = false;

          //if is not matching
          if (!(matches as any)[columnId]) {
            (matches as any)[columnId] = doesColumnIdContainValueFromUrl(rowValues, columnId);
          }
        }
      });
      if (doesMatchAllColumnIds(matches)) {
      }

      return doesMatchAllColumnIds(matches);
    });

    parseFilterOptions(filteredOptions);
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
  class={`bg-ghost-white p-md h-fit rounded-lg lg:sticky lg:top-[6rem] lg:z-10 lg:min-w-[20rem]  ${isLoading ? 'animate-pulse' : ''}`}
>
  {#if hasError}
    <ErrorCard message="Failed to load filter options" retryCallback={reloadFilterOptions} />
    <div class="pb-sm"></div>
  {/if}
  <div class="flex w-full items-center justify-between">
    <p class="font-sans-narrow text-2xl font-semibold">Filter</p>
    {@render filterIcon()}
  </div>

  <SearchInput />
  <FilterForm trigger="change" {onChange} {onReset}>
    {#each filtersFromFields as columnId}
      {#if searchColumnId !== columnId}
        <Select
          options={allAvailableColumnIdsWithTheirValues[columnId as string]}
          name={columnId}
          disabled={isParentLoading || isLoading || hasError}
        />
      {/if}
    {/each}

    <div class="gap-sm mt-lg flex w-full flex-row lg:flex-col">
      <button type="button" data-type="reset" class="outlined w-full hover:bg-red-50">
        Reset
      </button>
      <button
        type="button"
        class="border-imperial-red p-sm w-full cursor-pointer rounded-lg border hover:bg-red-50"
        onclick={handleChangeView}
      >
        {viewAs === 'grid' ? 'View As List' : 'View As Grid'}
      </button>
    </div>
  </FilterForm>
</div>
