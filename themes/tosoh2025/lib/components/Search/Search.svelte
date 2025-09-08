<script lang="ts">
  import { fade } from 'svelte/transition';

  import FilterForm from '../FilterForm/FilterForm.svelte';
  import { onMount } from 'svelte';
  import { PROD_TOSOH_SUPPORT_PORTAL_TABLE_ID } from '../../utils/constants';

  const { accessLevel }: { accessLevel?: string } = $props();

  let matches: string[] = $state([]);
  let isLoading = $state(false);
  let showDropdown = $state(false);
  let mounted = $state(false);

  let filtersFromFields = window?.Tosoh?.SupportPortalContent?.filters
    ? [...window.Tosoh.SupportPortalContent.filters.split(','), 'pagination', 'limit']
    : [];

  const searchFromFields = window?.Tosoh?.SupportPortalContent?.search;

  const hubdb_table_id = searchFromFields?.hubdb_table_id;
  const hubdb_column_id = searchFromFields?.hubdb_column_id || 'search_terms';
  const title = searchFromFields?.title || '';

  const activeFilter = new URLSearchParams(window.location.search)?.get(hubdb_column_id as string);

  const handleFetch = (searchTerm: string) => {
    showDropdown = false;

    const params = new URLSearchParams(window.location.search);

    filtersFromFields?.map((column) => {
      params.delete(column);
    });

    params.set(hubdb_column_id, searchTerm);
    window.location.search = params.toString();
  };

  const onSubmit = (e: Event) => {
    if (e?.target && hubdb_column_id) {
      const formElement = e.target as HTMLFormElement;
      const searchTerm = new FormData(formElement).get(hubdb_column_id) as string;

      if (searchTerm) {
        handleFetch(searchTerm);
      }
    }
  };

  const onClick = (searchTerm: string) => {
    if (searchTerm) {
      handleFetch(searchTerm);
    }
  };

  const fetchMatches = async (e: any) => {
    let searchString = e?.target?.value;
    if ((typeof searchString === 'string' && searchString?.length < 2) || !mounted) return;
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
            // tableId: hubdb_table_id,
            tableId: PROD_TOSOH_SUPPORT_PORTAL_TABLE_ID,
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

  const resetDropdown = () => {
    if (showDropdown) {
      showDropdown = false;
      matches = [];
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

{#snippet xIcon()}
  <button
    type="button"
    transition:fade={{ duration: 200 }}
    class="fill-imperial-red plain bg-ghost-white h-4 w-4 cursor-pointer"
    onclick={clearFilter}
    aria-label="Clear selection"
  >
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 640" class="fill-imperial-red">
      <path
        d="M183.1 137.4C170.6 124.9 150.3 124.9 137.8 137.4C125.3 149.9 125.3 170.2 137.8 182.7L275.2 320L137.9 457.4C125.4 469.9 125.4 490.2 137.9 502.7C150.4 515.2 170.7 515.2 183.2 502.7L320.5 365.3L457.9 502.6C470.4 515.1 490.7 515.1 503.2 502.6C515.7 490.1 515.7 469.8 503.2 457.3L365.8 320L503.1 182.6C515.6 170.1 515.6 149.8 503.1 137.3C490.6 124.8 470.3 124.8 457.8 137.3L320.5 274.7L183.1 137.4z"
      />
    </svg>
  </button>
{/snippet}

<FilterForm {onSubmit} trigger="submit" onClickOutside={resetDropdown}>
  <div class="relative">
    <div class="mt-md gap-sm flex flex-col">
      {#if title}
        <div class="gap-sm flex items-center">
          <label for={hubdb_column_id} class=" text-xl font-black">{title}</label>
          {#if activeFilter && title}
            {@render xIcon()}
          {/if}
        </div>
      {/if}
      <div
        class={` relative w-full rounded-lg border ${showDropdown ? 'border-imperial-red' : 'border-slate-200'}`}
      >
        <input
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
          {:else if activeFilter && !title}
            {@render xIcon()}
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
            <button
              type="button"
              class="plain text-left! p-sm! w-full cursor-pointer break-all text-sm font-bold hover:bg-red-50"
              onclick={() => {
                onClick(match);
              }}
            >
              {match}
            </button>
          {/if}
        {/each}
      </div>
    {/if}
  </div>
</FilterForm>
