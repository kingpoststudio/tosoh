<svelte:options
  customElement={{
    tag: 'tosoh-cct-details-filters',
    shadow: 'none',
  }}
/>

<script lang="ts">
  import { onDestroy, onMount } from 'svelte';
  import { fade } from 'svelte/transition';

  import FilterForm from '../FiltersForm/FiltersForm.svelte';
  import Select from '../Select/Select.svelte';
  import MagnifierIcon from '../icons/MagnifierIcon.svelte';

  import { tableSearchManager } from '../../utils/textSearchUtils';
  import { TableFilterManager } from '../../utils/tableFilterUtils';

  const FILTERS_FORM_ID = 'cct-details-filters';
  const SEARCH_DEBOUNCE_MS = 100;
  const hostEl = $host();

  let searchValue = $state('');
  let searchMatches = $state({ current: 0, total: 0 });
  let tableFilterManager: TableFilterManager | null = null;

  let categorySelectValue: string = $state('none');
  let cctDetailsConfig = window?.Tosoh?.CCTDetails;

  const uniqueCategoryOptions =
    (cctDetailsConfig?.comparisonRows?.objects?.map((row: any) => row?.category) || [])?.filter(
      (category: any, index: number, self: any[]) =>
        category && self?.findIndex((cat: any) => cat?.id === category?.id) === index
    ) || [];

  const resetButtonLabel = cctDetailsConfig?.resetButtonLabel;
  const selectCategoryPlaceholder = cctDetailsConfig?.selectCategoryPlaceholder;
  const searchPlaceholder = cctDetailsConfig?.searchPlaceholder;
  const firstPartOfMatchesText = cctDetailsConfig?.firstPartOfMatchesText;
  const secondPartOfMatchesText = cctDetailsConfig?.secondPartOfMatchesText;

  const resetSearchInput = () => {
    tableSearchManager.clearHighlights();
    searchValue = '';
    searchMatches = { current: 0, total: 0 };
  };

  const onChange = (event: Event) => {
    if (!event?.target) return;

    const searchInputChanged = event.target instanceof HTMLInputElement;
    const selectChanged = event.target instanceof HTMLSelectElement;

    if (searchInputChanged) {
      handleSearchInput(event);
    }

    if (selectChanged) {
      const tableRowId = event.target.value;

      if (tableFilterManager) {
        resetSearchInput();
        tableFilterManager.filterById(tableRowId || null);
      }
    }
  };

  const onReset = () => {
    resetSearchInput();

    if (tableFilterManager) {
      categorySelectValue = 'none';
      tableFilterManager.clearFilters();
    }
  };

  const handleSearchInput = (event: Event) => {
    const target = event?.target as HTMLInputElement;

    performTableSearch(target?.value);
  };

  const performTableSearch = (term: string) => {
    if (!term.trim()) {
      tableSearchManager.clearHighlights();
      searchMatches = { current: 0, total: 0 };
      return;
    }

    setTimeout(() => {
      tableSearchManager.search(term);
      searchMatches = tableSearchManager.getCurrentMatchInfo();
    }, SEARCH_DEBOUNCE_MS);
  };

  const navigateToNext = () => {
    tableSearchManager.nextMatch();
    searchMatches = tableSearchManager.getCurrentMatchInfo();
  };

  const navigateToPrevious = () => {
    tableSearchManager.previousMatch();
    searchMatches = tableSearchManager.getCurrentMatchInfo();
  };

  const handleKeyDown = (event: KeyboardEvent) => {
    if (event.key === 'Enter') {
      event.preventDefault();
      if (event.shiftKey) {
        navigateToPrevious();
      } else {
        navigateToNext();
      }
    } else if (event.key === 'Escape') {
      tableSearchManager.clearHighlights();
      searchMatches = { current: 0, total: 0 };
    }
  };

  onMount(() => {
    const table = hostEl.parentElement?.querySelector('table') as HTMLTableElement;
    if (table) {
      tableFilterManager = new TableFilterManager(table);
    }

    const handleGlobalKeyDown = (event: KeyboardEvent) => {
      if ((event.ctrlKey || event.metaKey) && event.key === 'f') {
        event.preventDefault();
      }
    };

    document.addEventListener('keydown', handleGlobalKeyDown);

    return () => {
      document.removeEventListener('keydown', handleGlobalKeyDown);
    };
  });

  onDestroy(() => {
    tableSearchManager.clearHighlights();
  });
</script>


<FilterForm
  trigger="change"
  {onChange}
  {onReset}
  customClasses="w-full"
  updateUrl={false}
  formId={FILTERS_FORM_ID}
>
  <div
    transition:fade={{ duration: 100 }}
    class="gap-base p-sm flex w-full flex-col items-center justify-end md:flex-row"
  >
    <div class="gap-sm flex w-full flex-col md:w-fit md:flex-row-reverse">
      <div class={`relative w-full min-w-[16rem] rounded-lg border border-slate-200 md:w-fit`}>
        <input
          bind:value={searchValue}
          onkeydown={handleKeyDown}
          name={'search_term'}
          class="p-base placeholder:text-default focus:outline-imperial-red h-full w-full rounded-md pr-8"
          placeholder={searchPlaceholder}
          autocomplete="off"
        />
        <div
          class="right-sm absolute top-[50%] flex max-h-[1.45rem] max-w-[1.45rem] -translate-y-1/2 items-center"
        >
          <span class="text-imperial-red"><MagnifierIcon /></span>
        </div>
      </div>
      {#if searchMatches.total > 0}
        <div
          transition:fade={{ duration: 100 }}
          class="gap-sm flex items-center text-sm text-gray-600"
        >
          <span
            >{searchMatches.current}
            {firstPartOfMatchesText}
            {searchMatches.total}
            {secondPartOfMatchesText}</span
          >
          <div class="flex gap-1">
            <button
              onclick={navigateToPrevious}
              class="plain text-imperial-red! p-xs! rounded hover:bg-gray-100"
              type="button"
              aria-label="Previous match"
            >
              ↑
            </button>
            <button
              onclick={navigateToNext}
              class="plain text-imperial-red! p-xs! rounded hover:bg-gray-100"
              type="button"
              aria-label="Next match"
            >
              ↓
            </button>
          </div>
        </div>
      {/if}
    </div>
    <div class="w-full min-w-[16rem] md:w-fit">
      <Select
        excludeAllOption={true}
        placeholder={selectCategoryPlaceholder}
        displayLabel={false}
        options={uniqueCategoryOptions}
        name={'category'}
        disabled={false}
        bind:value={categorySelectValue}
      />
    </div>
    <button type="button" data-type="reset" class="w-full md:w-fit"> {resetButtonLabel} </button>
  </div>
</FilterForm>
