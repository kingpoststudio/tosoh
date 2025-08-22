<script lang="ts">
  import { onMount, onDestroy } from 'svelte';
  let { onFilterSubmit, onFormReset, isParentLoading } = $props();

  import type { LabelValue, SupportPortalRowForFilter } from '../../../types/hubdb';
  import { createFormManager, type FormManagerInstance } from '../../utils/FormManager';
  import { cacheResponse, useCachedData } from '../../utils/CacheManager';
  import ErrorCard from '../ErrorCard/ErrorCard.svelte';

  let formElement: HTMLFormElement | null = $state(null);
  let formManager: FormManagerInstance | null = $state(null);
  const CACHE_KEY = 'support-portal-filter-options';

  let allFilterOptions: SupportPortalRowForFilter[] = $state([]);
  let isLoading = $state(false);
  let hasError = $state(false);

  let document_types: LabelValue[] = $state([]);
  let product_families: LabelValue[] = $state([]);
  let product_types: LabelValue[] = $state([]);
  let document_categories: LabelValue[] = $state([]);

  let active_document_type: string = $state('none');
  let active_product_family: string = $state('none');
  let active_product_type: string = $state('none');
  let active_document_category: string = $state('none');

  const parseFilterOptions = (filterOptions: SupportPortalRowForFilter[]) => {
    let localDocumentCategories: LabelValue[] = [];
    let localDocumentTypes: LabelValue[] = [];
    let localProductFamilies: LabelValue[] = [];
    let localProductTypes: LabelValue[] = [];

    if (filterOptions && filterOptions?.length > 0) {
      filterOptions.forEach((option) => {
        if (option.document_type && option.document_type.length > 0) {
          option.document_type.forEach((type) => {
            if (!localDocumentTypes.some((local_type) => local_type.value === type.value)) {
              localDocumentTypes.push({
                label: type.label,
                value: type.value,
              });
            }
          });
        }

        if (option.document_category && option.document_category.length > 0) {
          option.document_category.forEach((cat) => {
            if (!localDocumentCategories.some((local_cat) => local_cat.value === cat.value)) {
              localDocumentCategories.push({
                label: cat.label,
                value: cat.value,
              });
            }
          });
        }

        if (option.product_family && option.product_family.length > 0) {
          option.product_family.forEach((family) => {
            if (!localProductFamilies.some((local_family) => local_family.value === family.value)) {
              localProductFamilies.push({
                label: family.label,
                value: family.value,
              });
            }
          });
        }

        if (option.product_type && option.product_type.length > 0) {
          option.product_type.forEach((type) => {
            if (!localProductTypes.some((local_type) => local_type.value === type.value)) {
              localProductTypes.push({
                label: type.label,
                value: type.value,
              });
            }
          });
        }
      });

      document_categories = localDocumentCategories;
      document_types = localDocumentTypes;
      product_families = localProductFamilies;
      product_types = localProductTypes;
    }
  };

  const useFiltersFromCache = (checkTime: boolean) => {
    const data = useCachedData(CACHE_KEY, checkTime) as any;

    if (data) {
      const filterOptions = data?.data?.HUBDB?.support_portal_collection?.items;
      allFilterOptions = filterOptions;
      parseFilterOptions(filterOptions);
      return true;
    }
  };

  const getFilterOptions = async () => {
    try {
      let cachedData = useFiltersFromCache(true);

      if (cachedData) {
        console.log('cachedData', cachedData);
        return;
      }
    } catch (error) {
      console.warn('Failed to read from cache:', error);
    }

    isLoading = true;

    try {
      const response = await fetch(
        'https://145184808.hs-sites-eu1.com/hs/serverless/get-support-portal-filter-options'
      );
      const data = await response.json();

      if (!data?.error) {
        cacheResponse(CACHE_KEY, data);
        const filterOptions = data?.data?.HUBDB?.support_portal_collection?.items;
        allFilterOptions = filterOptions;
        return parseFilterOptions(filterOptions);
      }

      if (data?.error) {
        useFiltersFromCache(false);
      }
    } catch (error) {
      useFiltersFromCache(false);
      console.warn('Failed to fetch filter options:', error);
    } finally {
      isLoading = false;
    }
  };

  const handleFormSubmit = (event: Event) => {
    event.preventDefault();

    if (formManager) {
      formManager.setFormValuesToParams(false);
    }

    if (!formElement) return;

    onFilterSubmit();
  };

  const clearActiveFilters = () => {
    active_document_type = 'none';
    active_product_family = 'none';
    active_product_type = 'none';
    active_document_category = 'none';
  };

  const setAvailableFiltersBasedOnCurrentSelection = (
    active_document_category: string,
    active_document_type: string,
    active_product_family: string,
    active_product_type: string
  ) => {
    if (
      !active_document_category &&
      !active_document_type &&
      !active_product_family &&
      !active_product_type
    ) {
      parseFilterOptions(allFilterOptions);
      return;
    }

    const filteredOptions = allFilterOptions.filter((option) => {
      let matches = true;

      if (active_document_category && active_document_category !== 'none') {
        matches =
          matches &&
          option.document_category?.some((cat) => cat.value === active_document_category);
      }

      if (active_document_type && active_document_type !== 'none') {
        matches =
          matches && option.document_type?.some((type) => type.value === active_document_type);
      }

      if (active_product_family && active_product_family !== 'none') {
        matches =
          matches &&
          option.product_family?.some((family) => family.value === active_product_family);
      }

      if (active_product_type && active_product_type !== 'none') {
        matches =
          matches && option.product_type?.some((type) => type.value === active_product_type);
      }

      return matches;
    });

    parseFilterOptions(filteredOptions);
  };

  const initiateFormManager = () => {
    if (formElement && !formManager) {
      formManager = createFormManager(formElement, {
        onSubmit: (e) => {
          if (formElement) {
            handleFormSubmit(e);
          }
        },
        onReset: () => {
          clearActiveFilters();
          onFormReset();
        },
      });
    }
  };

  $effect(() => {
    setAvailableFiltersBasedOnCurrentSelection(
      active_document_category,
      active_document_type,
      active_product_family,
      active_product_type
    );
  });

  $effect(() => {
    if (allFilterOptions && allFilterOptions?.length > 0) {
      initiateFormManager();
    }
  });

  onMount(() => {
    getFilterOptions();
  });

  onDestroy(() => {
    if (formManager) {
      formManager.destroy();
    }
  });

  const reloadFilterOptions = () => {
    hasError = false;
    getFilterOptions();
  };

  $effect(() => {
    if (!isLoading && !allFilterOptions?.length) {
      hasError = true;
    }
  });
</script>

{#snippet searchInput()}
  <div class="mt-sm relative w-full rounded-lg border border-slate-200">
    <input
      name="search"
      class=" p-sm placeholder:text-default focus:outline-imperial-red h-full w-full rounded-md"
      placeholder="Search here..."
    />
    <div class="right-sm absolute top-[50%] max-h-[1.45rem] max-w-[1.45rem] -translate-y-1/2">
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
    </div>
  </div>
{/snippet}

<div class={`wrapper bg-ghost-white p-md h-fit rounded-lg ${isLoading ? 'animate-pulse' : ''}`}>
  {#if hasError}
    <ErrorCard message="Failed to load filter options" retryCallback={reloadFilterOptions} />
    <div class="pb-sm"></div>
  {/if}
  <div class="gap-5xl flex items-center">
    <p class="font-sans-narrow text-2xl font-semibold">Filter</p>
    <div class="max-h-[1.375rem] max-w-[1rem]">
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
  </div>

  <form bind:this={formElement}>
    {@render searchInput()}

    <div class="mt-md gap-sm flex flex-col">
      <div class=" gap-sm flex flex-col">
        <label for={'product_family'} class=" text-xl font-black">Product Family</label>
        <div class="relative">
          <select
            id={'product_family'}
            name="product_family"
            disabled={product_families?.length === 0}
            class="p-sm focus:ring-imperial-red peer w-full cursor-pointer appearance-none rounded-lg border border-slate-200 focus:outline-none focus:ring-1 focus:ring-opacity-50 disabled:cursor-not-allowed disabled:opacity-50"
            bind:value={active_product_family}
          >
            <option value="none" selected disabled hidden class="text-imperial-red">Select</option>
            {#each product_families as option}
              <option value={option.value} class="text-default">{option.label}</option>
            {/each}
          </select>
          <div
            class="pointer-events-none absolute inset-y-0 right-3 flex items-center transition-transform duration-200 peer-open:rotate-180"
          >
            <svg
              class="text-imperial-red h-4 w-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="4"
                d="M19 9l-7 7-7-7"
              ></path>
            </svg>
          </div>
        </div>
      </div>
    </div>
    <div class="mt-md gap-sm flex flex-col">
      <div class=" gap-sm flex flex-col">
        <label for={'product_family'} class=" text-xl font-black">Product Type</label>
        <div class="relative">
          <select
            id={'product_type'}
            name="product_type"
            disabled={product_types?.length === 0}
            class="p-sm focus:ring-imperial-red peer w-full cursor-pointer appearance-none rounded-lg border border-slate-200 focus:outline-none focus:ring-1 focus:ring-opacity-50 disabled:cursor-not-allowed disabled:opacity-50"
            bind:value={active_product_type}
          >
            <option value="none" selected disabled hidden class="text-imperial-red">Select</option>
            {#each product_types as option}
              <option value={option.value} class="text-default">{option.label}</option>
            {/each}
          </select>
          <div
            class="pointer-events-none absolute inset-y-0 right-3 flex items-center transition-transform duration-200 peer-open:rotate-180"
          >
            <svg
              class="text-imperial-red h-4 w-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="4"
                d="M19 9l-7 7-7-7"
              ></path>
            </svg>
          </div>
        </div>
      </div>
    </div>

    <div class="mt-md gap-sm flex flex-col">
      <div class=" gap-sm flex flex-col">
        <label for={'document_category'} class=" text-xl font-black">Document Category</label>
        <div class="relative">
          <select
            id={'document_category'}
            name="document_category"
            disabled={document_categories?.length === 0}
            class="p-sm focus:ring-imperial-red peer w-full cursor-pointer appearance-none rounded-lg border border-slate-200 focus:outline-none focus:ring-1 focus:ring-opacity-50 disabled:cursor-not-allowed disabled:opacity-50"
            bind:value={active_document_category}
          >
            <option value="none" selected disabled hidden class="text-imperial-red">Select</option>
            {#each document_categories as option}
              <option value={option.value} class="text-default">{option.label}</option>
            {/each}
          </select>
          <div
            class="pointer-events-none absolute inset-y-0 right-3 flex items-center transition-transform duration-200 peer-open:rotate-180"
          >
            <svg
              class="text-imperial-red h-4 w-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="4"
                d="M19 9l-7 7-7-7"
              ></path>
            </svg>
          </div>
        </div>
      </div>
    </div>
    <div class="mt-md gap-sm flex flex-col">
      <div class=" gap-sm flex flex-col">
        <label for={'document_type'} class=" text-xl font-black">Document Type</label>
        <div class="relative">
          <select
            id={'document_type'}
            name="document_type"
            disabled={document_types?.length === 0}
            class="p-sm focus:ring-imperial-red peer w-full cursor-pointer appearance-none rounded-lg border border-slate-200 focus:outline-none focus:ring-1 focus:ring-opacity-50 disabled:cursor-not-allowed disabled:opacity-50"
            bind:value={active_document_type}
          >
            <option value="none" selected disabled hidden class="text-imperial-red">Select</option>
            {#each document_types as option}
              <option value={option.value} class="text-default">{option.label}</option>
            {/each}
          </select>
          <div
            class="pointer-events-none absolute inset-y-0 right-3 flex items-center transition-transform duration-200 peer-open:rotate-180"
          >
            <svg
              class="text-imperial-red h-4 w-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="4"
                d="M19 9l-7 7-7-7"
              ></path>
            </svg>
          </div>
        </div>
      </div>
    </div>

    <div class="gap-sm mt-lg flex w-full">
      <button
        type="button"
        disabled={isLoading || hasError || isParentLoading}
        class="border-imperial-red text-default! p-sm outlined w-full rounded-lg border hover:bg-red-50"
        onclick={() => {
          if (formManager) {
            formManager.resetAction();
          }
        }}
      >
        Reset
      </button>
      <button
        type="submit"
        class="bg-imperial-red p-sm w-full rounded-lg text-white disabled:cursor-not-allowed disabled:opacity-50"
        disabled={isLoading || hasError || isParentLoading}
      >
        Apply
      </button>
    </div>
  </form>
</div>
