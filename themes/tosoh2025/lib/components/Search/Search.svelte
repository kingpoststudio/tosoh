<script lang="ts">
  import { onMount } from 'svelte';
  import { fade } from 'svelte/transition';

  import { setSearchParams } from '../../utils/urlUtils';
  import { updateFormEvent } from '../../utils/formManager';
  import { USE_HARDCODED_IDS } from '../../utils/constants';
  import FilterForm from '../FiltersForm/FiltersForm.svelte';
  import MagnifierIcon from '../icons/MagnifierIcon.svelte';

  import type { Search } from '../../../types/fields';
  const {
    accessLevel,
    customClasses,
    disabled,
    formId,
    isActivatedQuery = true,
    manualTableId,
    onReset,
    searchFromFields,
    possibleResultsLabel = 'Possible results',
  }: {
    accessLevel?: string;
    customClasses?: string;
    disabled?: boolean;
    formId: string;
    isActivatedQuery?: boolean;
    manualTableId?: string | number;
    onReset: (searchCb: () => void) => void;
    searchFromFields: Search;
    possibleResultsLabel?: string;
  } = $props();

  const {
    hubdb_table_id: searchTableId,
    hubdb_column_ids: searchColumnIds = [],
    title,
    placeholder,
    typeahead_enabled: typeaheadEnabled,
    enable_search: isSearchEnabled,
  } = searchFromFields || {};

  // Extract column ID strings from the array of objects
  const columnIds = searchColumnIds?.map((col) => col.hubdb_column_id) || [];

  // Check if any of the column IDs have a value in the URL
  const urlParams = new URLSearchParams(window.location.search);
  const activeFilter = columnIds.find((colId) => urlParams.get(colId))
    ? urlParams.get(columnIds.find((colId) => urlParams.get(colId)) as string)
    : '';
  const activeColumnId = columnIds.find((colId) => urlParams.get(colId)) || '';

  interface MatchResult {
    value: string;
    columnId: string;
  }

  let matches: MatchResult[] = $state([]);
  let isLoading = $state(false);
  let showDropdown = $state(false);
  let mounted = $state(false);
  let searchValue = $state(activeFilter || '');

  const handleFetch = (searchTerm: string, columnId: string) => {
    showDropdown = false;
    searchValue = searchTerm;

    onReset?.(() => {
      setSearchParams({ [columnId]: searchTerm });
      updateFormEvent(formId as string);
    });
  };

  const onSubmit = (e: Event) => {
    if (e?.target && columnIds.length > 0) {
      const formElement = e.target as HTMLFormElement;
      // Use the first column ID as the default for manual search submission
      const defaultColumnId = activeColumnId || columnIds[0];
      const searchTerm = new FormData(formElement).get(defaultColumnId) as string;

      if (searchTerm) {
        handleFetch(searchTerm, defaultColumnId);
      }
    }
  };

  const onClick = (match: MatchResult) => {
    if (match?.value && match?.columnId) {
      handleFetch(match.value, match.columnId);
    }
  };

  const fetchMatches = async (e: any) => {
    let searchString = e?.target?.value;

    if ((typeof searchString === 'string' && searchString?.length < 2) || !mounted) {
      matches = [];
      return;
    }

    try {
      isLoading = true;
      const response = await fetch(
        `https://${window.location.hostname}/hs/serverless/get-matching-search-items`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            accessLevel: accessLevel,
            term: searchString,
            tableId: USE_HARDCODED_IDS ? manualTableId : searchTableId,
            columnIds: columnIds,
            isActivated: isActivatedQuery,
          }),
        }
      );
      const data = await response.json();

      if (!data?.error) {
        const { matches: matchResults } = data;
        matches = matchResults;
        showDropdown = matches.length > 0;
      }

      if (data?.error) {
        showDropdown = false;
      }
    } catch (error) {
      showDropdown = false;
    } finally {
      isLoading = false;
    }
  };

  const resetDropdown = () => {
    if (showDropdown) {
      showDropdown = false;
      matches = [];
    }
  };

  onMount(() => {
    mounted = true;
  });
</script>

{#snippet loader()}
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 640 640"
    class="fill-imperial-red h-full w-full animate-spin"
  >
    <path
      d="M320.3 93.7C322.8 76.2 339 64.1 356.5 66.6C480.6 84.4 576 191 576 320C576 353.5 569.5 385.6 557.8 415.1C551.2 431.5 532.6 439.5 516.2 432.9C499.8 426.3 491.8 407.7 498.4 391.3C507.2 369.3 512.1 345.3 512.1 320C512.1 223.3 440.6 143.3 347.6 129.9C330.1 127.4 318 111.2 320.5 93.7z"
    />
  </svg>
{/snippet}


{#if isSearchEnabled}
  <FilterForm
    {onSubmit}
    trigger="submit"
    onClickOutside={resetDropdown}
    {formId}
    excludeFromObserver={true}
  >
    <div class={`relative ${customClasses}`}>
      <div class="gap-sm flex flex-col">
        {#if title}
          <div class="gap-sm flex items-center">
            <label for={columnIds[0]} class=" text-xl font-black">{title}</label>
          </div>
        {/if}
        <div
          class={`focus-within:border-imperial-red relative w-full rounded-lg border ${showDropdown ? 'border-imperial-red' : 'border-slate-200'}`}
        >
          <input
            bind:value={searchValue}
            oninput={typeaheadEnabled ? fetchMatches : () => {}}
            name={columnIds[0]}
            class=" p-base placeholder:text-default focus:ring-imperial-red focus:outline-imperial-red h-full w-full rounded-md pr-8 focus:ring-1 focus:outline-none disabled:cursor-not-allowed disabled:opacity-50"
            placeholder={placeholder || 'Search here...'}
            {disabled}
          />
          <div
            class="right-sm absolute top-[50%] flex max-h-[1.45rem] max-w-[1.45rem] -translate-y-1/2 items-center"
          >
            {#if isLoading}
              {@render loader()}
            {:else}
              <span class="text-imperial-red"><MagnifierIcon /></span>
            {/if}
          </div>
        </div>
      </div>

      {#if showDropdown && matches.length > 0}
        <div
          transition:fade={{ duration: 100 }}
          class="border-imperial-red mt-xs absolute left-0 z-10 max-h-[24rem] w-full overflow-y-auto rounded-lg border-1 bg-white shadow-md lg:max-w-[19.75rem]"
        >
          <div class="p-sm border-shadow-white w-full border-b text-center">
            {possibleResultsLabel}
          </div>
          {#each matches as match}
            {#if match}
              <button
                type="button"
                class="plain p-sm! w-full cursor-pointer text-left! text-sm font-semibold break-all hover:bg-red-50"
                onclick={() => {
                  onClick(match);
                }}
              >
                <div class="flex flex-col gap-1">
                  <span>{@html match.value}</span>
                </div>
              </button>
            {/if}
          {/each}
        </div>
      {/if}
    </div>
  </FilterForm>
{/if}
