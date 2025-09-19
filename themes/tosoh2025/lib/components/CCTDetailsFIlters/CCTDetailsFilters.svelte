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
  import { updateUrl } from '../../utils/urlUtils';

  let searchValue = $state('');
  let matchInfo = $state({ current: 0, total: 0 });
  let searchInput: HTMLInputElement;
  let debounceTimer: ReturnType<typeof setTimeout> | undefined;

  const onChange = (event: Event) => {
    // onReset();
    handleSearchInput(event);
  };

  const onReset = () => {
    searchValue = '';
    cctSearchManager.clearHighlights();
    matchInfo = { current: 0, total: 0 };
  };

  const handleSearchInput = (event: Event) => {
    const target = event.target as HTMLInputElement;
    searchValue = target.value;

    performSearch(searchValue);
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
      onReset();
    }
  };

  onMount(() => {
    // Add keyboard shortcuts for navigation
    const handleGlobalKeyDown = (event: KeyboardEvent) => {
      if ((event.ctrlKey || event.metaKey) && event.key === 'f' && searchValue) {
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

<FilterForm trigger="change" {onChange} {onReset} customClasses="w-full">
  <div
    transition:fade={{ duration: 100 }}
    class="gap-base p-sm flex w-full flex-col items-center justify-end md:flex-row"
  >
    <div class="gap-sm flex w-full flex-row-reverse md:w-fit">
      <div class={`relative w-full min-w-[16rem] rounded-lg border border-slate-200`}>
        <input
          onkeydown={handleKeyDown}
          name={'search'}
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
          { name: 'Basic Specifications', label: 'Basic Specifications' },
          { name: 'Application Range', label: 'Application Range' },
          { name: 'Measurement Modes', label: 'Measurement Modes' },
          { name: 'Throughput Capacity', label: 'Throughput Capacity' },
          { name: 'Sample Range', label: 'Sample Range' },
          { name: 'Variant Mode Results', label: 'Variant Mode Results' },
          { name: 'Standard Mode Results', label: 'Standard Mode Results' },
        ]}
        name={'category'}
        disabled={false}
      />
    </div>

    <button type="button" data-type="reset" class="w-full md:w-fit"> Reset Filters </button>
  </div>
</FilterForm>
