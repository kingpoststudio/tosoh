<script lang="ts">
  import { onMount } from 'svelte';
  import { fade } from 'svelte/transition';

  import { setSearchParams } from '../../utils/urlUtils';
  import { updateFormEvent } from '../../utils/formManager';
  import { USE_HARDCODED_IDS } from '../../utils/constants';
  import FilterForm from '../FiltersForm/FiltersForm.svelte';

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
  }: {
    accessLevel?: string;
    customClasses?: string;
    disabled?: boolean;
    formId: string;
    isActivatedQuery?: boolean;
    manualTableId?: string;
    onReset: (searchCb: () => void) => void;
    searchFromFields: Search;
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

{#snippet magnifier()}
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="100%"
    height="100%"
    viewBox="0 0 23 23"
    fill="none"
  >
    <path
      d="M17.3528 17.8152L21.1977 21.6601M19.9831 11.0491C19.9831 13.5323 18.9966 15.9137 17.2408 17.6695C15.485 19.4254 13.1036 20.4118 10.6204 20.4118C8.13731 20.4118 5.75589 19.4254 4.00006 17.6695C2.24423 15.9137 1.25781 13.5323 1.25781 11.0491C1.25781 8.56603 2.24423 6.18461 4.00006 4.42877C5.75589 2.67294 8.13731 1.68652 10.6204 1.68652C13.1036 1.68652 15.485 2.67294 17.2408 4.42877C18.9966 6.18461 19.9831 8.56603 19.9831 11.0491Z"
      stroke="#ED1A3A"
      stroke-width="1.87252"
      stroke-linecap="round"
      stroke-linejoin="round"
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
            class=" p-base placeholder:text-default focus:ring-imperial-red focus:outline-imperial-red h-full w-full rounded-md pr-8 focus:outline-none focus:ring-1 disabled:cursor-not-allowed disabled:opacity-50"
            placeholder={placeholder || 'Search here...'}
            {disabled}
          />
          <div
            class="right-sm absolute top-[50%] flex max-h-[1.45rem] max-w-[1.45rem] -translate-y-1/2 items-center"
          >
            {#if isLoading}
              {@render loader()}
            {:else}
              {@render magnifier()}{/if}
          </div>
        </div>
      </div>

      {#if showDropdown && matches.length > 0}
        <div
          transition:fade={{ duration: 100 }}
          class="border-imperial-red border-1 mt-xs absolute left-0 z-10 max-h-[24rem] w-full overflow-y-auto rounded-lg bg-white shadow-md lg:max-w-[19.75rem]"
        >
          <div class="p-sm border-shadow-white w-full border-b text-center">Possible results</div>
          {#each matches as match}
            {#if match}
              <button
                type="button"
                class="plain text-left! p-sm! w-full cursor-pointer break-all text-sm font-semibold hover:bg-red-50"
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
