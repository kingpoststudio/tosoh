<script lang="ts">
  import { onMount } from 'svelte';
  import { fade } from 'svelte/transition';
  import { createFormManager, type FormManagerInstance } from '../../utils/FormManager';

  let matches: string[] = $state([]);
  let isLoading = $state(false);
  let showDropdown = $state(false);
  let formElement: HTMLFormElement | null = $state(null);
  let formManager: FormManagerInstance | null = $state(null);
  let inputElement: HTMLInputElement | null = $state(null);
  const searchFromFields = window?.Tosoh?.SupportPortalContent?.search;
  const hubdb_table_id = searchFromFields?.hubdb_table_id || 'support_portal';
  const hubdb_column_id = searchFromFields?.hubdb_column_id || 'search_terms';
  const title = searchFromFields?.title || '';

  const activeFilter = new URLSearchParams(window.location.search)?.get(hubdb_column_id as string);

  let filtersFromFields = window?.Tosoh?.SupportPortalContent?.filters
    ? [...window.Tosoh.SupportPortalContent.filters.split(','), 'pagination', 'limit']
    : [
        'document_category',
        'document_type',
        'product_family',
        'product_type',
        'pagination',
        'limit',
      ];

  const handleOnClick = (searchTerm: string) => {
    showDropdown = false;

    if (hubdb_column_id) {
      const params = new URLSearchParams(window.location.search);

      filtersFromFields?.map((column) => {
        params.delete(column);
      });

      params.set(hubdb_column_id, searchTerm);
      window.location.search = params.toString();
    }
  };

  const fetchMatches = async (e: any) => {
    let searchString = e?.target?.value;
    if ((typeof searchString === 'string' && searchString?.length < 2) || activeFilter) return;
    try {
      isLoading = true;
      const response = await fetch(
        `https://145184808.hs-sites-eu1.com/hs/serverless/get-matching-search-items`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            term: searchString,
            tableId: hubdb_table_id,
            columnId: hubdb_column_id,
          }),
        }
      );
      const data = await response.json();

      if (!data?.error) {
        const { matchingTerms } = data;
        matches = [...matchingTerms];
        showDropdown = matchingTerms.length > 0;
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

  const handleClickOutside = (event: MouseEvent) => {
    if (!(event.target instanceof HTMLElement)) return;

    if (!formElement?.contains(event.target) && showDropdown) {
      resetDropdown();
    }
  };

  const resetDropdown = () => {
    showDropdown = false;
    matches = [];
  };

  const initiateFormManager = () => {
    if (formElement && !formManager) {
      formManager = createFormManager(formElement, {
        onSubmit(e) {
          e.preventDefault();
          if (inputElement) {
            handleOnClick(inputElement?.value);
          }
        },
      });
    }
  };
  const clearFilter = () => {
    if (hubdb_column_id) {
      const url = new URL(window.location.href);
      url.searchParams.delete(hubdb_column_id);
      window.location.href = url.toString();
    }
  };

  onMount(() => {
    document.addEventListener('click', handleClickOutside);

    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  });

  onMount(() => initiateFormManager());
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

{#snippet clearInput()}
  <button
    type="button"
    transition:fade={{ duration: 200 }}
    class="fill-imperial-red plain bg-ghost-white h-4 w-4 cursor-pointer"
    onclick={clearFilter}
    aria-label="Clear selection"
  >
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 384 512" height="100%" width="100%">
      <path
        d="M55.1 73.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3L147.2 256 9.9 393.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0L192.5 301.3 329.9 438.6c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L237.8 256 375.1 118.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L192.5 210.7 55.1 73.4z"
      />
    </svg>
  </button>
{/snippet}

<form class="relative" bind:this={formElement}>
  <div class="mt-md gap-sm flex flex-col">
    {#if title}
      <label for={hubdb_column_id} class=" text-xl font-black">{title}</label>
    {/if}
    <div
      class={` relative w-full rounded-lg border ${showDropdown ? 'border-imperial-red' : 'border-slate-200'}`}
    >
      <input
        bind:this={inputElement}
        oninput={fetchMatches}
        name={hubdb_column_id}
        data-debounce="500"
        class=" p-base placeholder:text-default focus:outline-imperial-red h-full w-full rounded-md pr-8"
        placeholder="Search here..."
      />
      <div
        class="right-sm absolute top-[50%] flex max-h-[1.45rem] max-w-[1.45rem] -translate-y-1/2 items-center"
      >
        {#if isLoading}
          {@render loader()}
        {:else if activeFilter}
          {@render clearInput()}
        {:else}
          {@render magnifier()}{/if}
      </div>
    </div>
  </div>

  {#if showDropdown && matches.length > 0}
    <div
      transition:fade={{ duration: 100 }}
      class="border-imperial-red border-1 absolute left-0 z-10 mt-[0.5rem] max-h-[24rem] w-full overflow-y-auto rounded-lg bg-white shadow-md lg:max-w-[19.75rem]"
    >
      <div class="p-sm border-shadow-white w-full border-b text-center">Possible results</div>
      {#each matches as match}
        {#if match}
          <div class="p-sm hover:bg-red-50">
            <button
              type="button"
              class="plain text-left! cursor-pointer break-all text-sm font-bold"
              onclick={() => {
                handleOnClick(match);
              }}
            >
              {match}
            </button>
          </div>
        {/if}
      {/each}
    </div>
  {/if}
</form>
