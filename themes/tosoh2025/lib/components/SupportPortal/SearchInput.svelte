<script lang="ts">
  import { onMount } from 'svelte';
  import type { SupportPortalSearchItem } from '../../../types/hubdb';
  import { fade } from 'svelte/transition';
  const params = new URLSearchParams(window.location.search);

  let search_term: string | null = $state(params?.get('search_term') || '');
  let matches: SupportPortalSearchItem[] = $state([]);
  let isLoading = $state(false);
  let hasError = $state(false);
  let showDropdown = $state(false);
  let formElement: HTMLFormElement | null = $state(null);
  let debounceTimer: ReturnType<typeof setTimeout> | null = null;

  const fetchMatches = async () => {
    try {
      if (!search_term) return;

      isLoading = true;
      const response = await fetch(
        `https://145184808.hs-sites-eu1.com/hs/serverless/get-matching-search-items`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            term: search_term,
            tableId: '651452658',
          }),
        }
      );
      const data = await response.json();

      if (!data?.error) {
        const { matchingItems } = data;
        matches = [...matchingItems];
        showDropdown = matchingItems.length > 0;
      }

      if (data?.error) {
        hasError = true;
        showDropdown = false;
      }
    } catch (error) {
      hasError = true;
      showDropdown = false;
    } finally {
      isLoading = false;
    }
  };

  const handleClickOutside = (event: MouseEvent) => {
    if (!formElement) return;

    if (!formElement.contains(event.target as Node)) {
      resetDropdown();
    }
  };

  const resetDropdown = () => {
    showDropdown = false;
    matches = [];
    search_term = '';
  };

  onMount(() => {
    document.addEventListener('click', handleClickOutside);

    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  });

  $effect(() => {
    // Clear existing timer
    if (debounceTimer) {
      clearTimeout(debounceTimer);
    }

    // Reset dropdown if search term is too short
    if (!search_term || search_term.length <= 1) {
      showDropdown = false;
      matches = [];
      return;
    }

    // Set new debounced timer (300ms delay)
    debounceTimer = setTimeout(() => {
      fetchMatches();
    }, 300);

    // Cleanup function to clear timer if effect runs again
    return () => {
      if (debounceTimer) {
        clearTimeout(debounceTimer);
      }
    };
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

<form bind:this={formElement} class="relative">
  <div class="mt-sm relative w-full rounded-lg border border-slate-200">
    <input
      disabled={hasError}
      bind:value={search_term}
      name="search_term"
      data-debounce="100"
      class=" p-base placeholder:text-default focus:outline-imperial-red h-full w-full rounded-md"
      placeholder="Search here..."
    />
    <div class="right-sm absolute top-[50%] max-h-[1.45rem] max-w-[1.45rem] -translate-y-1/2">
      {#if isLoading}
        {@render loader()}
      {:else}
        {@render magnifier()}
      {/if}
    </div>
  </div>
  {#if showDropdown && matches.length > 0}
    <div
      transition:fade={{ duration: 100 }}
      class="p-sm absolute left-0 top-full z-10 max-h-[24rem] w-full max-w-[18.75rem] overflow-y-auto rounded-md bg-white shadow-md"
    >
      {#each matches as match}
        {#if match.name}
          <div class="p-sm">
            <div class="break-all text-sm font-bold">
              {match.name}
            </div>
          </div>
        {/if}
      {/each}
    </div>
  {/if}
</form>
