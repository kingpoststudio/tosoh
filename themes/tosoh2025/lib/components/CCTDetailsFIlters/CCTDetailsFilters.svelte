<svelte:options
  customElement={{
    tag: 'tosoh-cct-details-filters',
    shadow: 'none',
  }}
/>

<script lang="ts">
  import { fade } from 'svelte/transition';
  import { onMount, onDestroy } from 'svelte';
  import FilterForm from '../FilterForm/FilterForm.svelte';
  import Select from '../Select/Select.svelte';
  import { cctSearchManager } from '../../utils/textSearchUtils';
  import { TableFilterManager } from '../../utils/tableFilterUtils';

  let matchInfo = $state({ current: 0, total: 0 });
  let debounceTimer: ReturnType<typeof setTimeout> | undefined;
  let tableFilterManager: TableFilterManager | null = null;

  const onChange = (event: Event) => {
    if (event.target && event.target instanceof HTMLInputElement) {
      handleSearchInput(event);
    }
    if (event.target && event.target instanceof HTMLSelectElement) {
      const targetId = event.target.value;

      if (tableFilterManager) {
        cctSearchManager.clearHighlights();
        (document.querySelector('input[name="search_term"]') as HTMLInputElement).value = '';
        tableFilterManager.filterById(targetId || null);
      }
    }
  };

  const onReset = () => {
    cctSearchManager.clearHighlights();
    (document.querySelector('select[name="category"]') as HTMLSelectElement).value = 'none';

    matchInfo = { current: 0, total: 0 };

    if (tableFilterManager) {
      tableFilterManager.clearFilters();
    }
  };

  const handleSearchInput = (event: Event) => {
    const target = event.target as HTMLInputElement;

    performSearch(target.value);
  };

  const performSearch = (term: string) => {
    if (!term.trim()) {
      cctSearchManager.clearHighlights();
      matchInfo = { current: 0, total: 0 };
      return;
    }

    setTimeout(() => {
      cctSearchManager.search(term);
      matchInfo = cctSearchManager.getCurrentMatchInfo();
    }, 100);
  };

  const navigateToNext = () => {
    cctSearchManager.nextMatch();
    matchInfo = cctSearchManager.getCurrentMatchInfo();
  };

  const navigateToPrevious = () => {
    cctSearchManager.previousMatch();
    matchInfo = cctSearchManager.getCurrentMatchInfo();
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
      cctSearchManager.clearHighlights();
      matchInfo = { current: 0, total: 0 };
    }
  };

  onMount(() => {
    const table = document.querySelector('table') as HTMLTableElement;
    if (table) {
      tableFilterManager = new TableFilterManager(table);
    }

    // Add keyboard shortcuts for navigation
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
    if (debounceTimer) {
      clearTimeout(debounceTimer);
    }
    cctSearchManager.clearHighlights();
  });
</script>

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

<FilterForm trigger="change" {onChange} {onReset} customClasses="w-full" updateUrl={false}>
  <div
    transition:fade={{ duration: 100 }}
    class="gap-base p-sm flex w-full flex-col items-center justify-end md:flex-row"
  >
    <div class="gap-sm flex w-full flex-col md:w-fit md:flex-row-reverse">
      <div class={`relative w-full min-w-[16rem] rounded-lg border border-slate-200 md:w-fit`}>
        <input
          onkeydown={handleKeyDown}
          name={'search_term'}
          class="p-base placeholder:text-default focus:outline-imperial-red h-full w-full rounded-md pr-8"
          placeholder={'Search in table...'}
          autocomplete="off"
        />
        <div
          class="right-sm absolute top-[50%] flex max-h-[1.45rem] max-w-[1.45rem] -translate-y-1/2 items-center"
        >
          {@render magnifier()}
        </div>
      </div>
      {#if matchInfo.total > 0}
        <div
          transition:fade={{ duration: 100 }}
          class="gap-sm flex items-center text-sm text-gray-600"
        >
          <span>{matchInfo.current} of {matchInfo.total} matches</span>
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
        disableReset={true}
        placeholder={'Select Category'}
        displayLabel={false}
        options={[
          { name: 'Bthal', label: 'Bthal' },
          { name: 'Capacity', label: 'Capacity' },
          { name: 'HbA1c', label: 'HbA1c' },
          { name: 'Method', label: 'Method' },
          { name: 'Operational Features', label: 'Operational Features' },
          { name: 'Others', label: 'Others' },
          { name: 'Overall', label: 'Overall' },
          { name: 'Physical Specs', label: 'Physical Specs' },
        ]}
        name={'category'}
        disabled={false}
      />
    </div>
    <button data-type="reset" class="w-full md:w-fit"> Reset </button>
  </div>
</FilterForm>
