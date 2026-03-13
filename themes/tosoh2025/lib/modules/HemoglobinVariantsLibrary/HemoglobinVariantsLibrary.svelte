<svelte:options
  customElement={{
    tag: 'tosoh-hemoglobin-variants-library',
    shadow: 'none',
  }}
/>

<script lang="ts">
  import { onMount } from 'svelte';

  import Filters from './Filters.svelte';
  import ErrorCard from '../../components/ErrorCard/ErrorCard.svelte';

  import {
    defaultItemsLimit,
    defaultPagination,
    IS_MOCK,
    PROD_TOSOH_HEMOGLOBIN_VARIANTS_LIBRARY_TABLE_ID,
  } from '../../utils/constants';
  import PaginationWithLimit from '../../components/Pagination/Pagination.svelte';
  import Card from './Card.svelte';
  import SkeletonCard from './SkeletonCard.svelte';
  import ItemsGrid from '../../components/ItemsGrid/ItemsGrid.svelte';
  import { fetchTableRows } from '../../services/fetchTableRows';
  import { mockHemoglobinVariantsLibraryTableRowsResponse } from './mock';
  import {
    constructFilterParams,
    constructRangePmFilters,
    getFilterColumnIds,
    parseSearchColumnIds,
    getFiltersTableId,
  } from '../../utils/utils';

  const formId = 'hemoglobin-variants-library-filters';

  const hemoglobinVariantsLibraryContent = window?.Tosoh?.HemoglobinVariantsLibraryContent;
  const topicFilters = hemoglobinVariantsLibraryContent?.topic_filters?.filters || [];
  const tableId = getFiltersTableId(
    PROD_TOSOH_HEMOGLOBIN_VARIANTS_LIBRARY_TABLE_ID,
    hemoglobinVariantsLibraryContent?.topic_filters?.hubdb_table_id
  );
  let searchColumnIds = parseSearchColumnIds(hemoglobinVariantsLibraryContent?.search);

  let nonNumericFilters = getFilterColumnIds(topicFilters, 'non-numeric', searchColumnIds) || [];

  let title = hemoglobinVariantsLibraryContent?.title;
  let eyebrow = hemoglobinVariantsLibraryContent?.eyebrow;

  let tableRows: any = $state([]);
  let totalItems = $state(0);
  let hasError = $state(false);
  let isLoading = $state(false);

  const errorCard = hemoglobinVariantsLibraryContent?.error_card;
  const errorMessage = errorCard?.message || 'Failed to load portal items';
  const reloadInLabel = errorCard?.reload_in_label || 'Reload in';
  const secondReloadLabel = errorCard?.second_reload_label || 'seconds';
  const reloadLabel = errorCard?.reload_label || 'Reload';
  const tryAgainLabel = errorCard?.try_again_label || 'Try again';

  // Additional Configuration Settings
  const additionalConfSettings = hemoglobinVariantsLibraryContent?.additional_conf_settings;
  const noResultsLabel =
    additionalConfSettings?.results_settings?.no_results_label || 'No results found.';
  const paginationSettings = additionalConfSettings?.pagination_settings;

  const constructBody = () => {
    const params = new URLSearchParams(window.location.search);
    const rangePmFilters = constructRangePmFilters(topicFilters);

    return {
      sort: '-start_date',
      tableId: tableId,
      properties:
        'document_url,heterozygote_comments,aka,variant_image,variant_name,hgvs_name,mutation,mutation_description,heterozygote_clinical_presentation,heterozygote_laboratory_findings,heterozygote_comments,homozygote_clinical_presentation,homozygote_laboratory_findings,homozygote_comments,ethnicity,comments,instrument,area_under_peak,rt_min,rt_max,window,references',
      limit: parseInt(params?.get('limit') || `${defaultItemsLimit}`),
      pagination: parseInt(params?.get('pagination') || `${defaultPagination}`),
      offset:
        parseInt(params?.get('limit') || `${defaultItemsLimit}`) *
          (parseInt(params?.get('pagination') || `${defaultPagination}`) - 1) || 0,
      filters: constructFilterParams(nonNumericFilters),
      numericComparisonFilters: [...rangePmFilters],
      isActivated: true,
    };
  };

  const fetchData = async () => {
    try {
      isLoading = true;
      let data;

      if (!IS_MOCK) {
        data = await fetchTableRows(constructBody());
      } else {
        data = mockHemoglobinVariantsLibraryTableRowsResponse;
      }

      const { results, total } = data ?? { results: [], total: 0 };
      tableRows = results;
      totalItems = total;
    } catch (error) {
      hasError = true;
    } finally {
      isLoading = false;
    }
  };

  const reloadData = () => {
    hasError = false;
    fetchData();
  };

  onMount(() => {
    fetchData();
  });
</script>

{#if title || eyebrow}
  <div class="max-w-max-page gap-sm p-md md:pl-2xl md:pr-2xl m-auto flex flex-col pt-0">
    {#if eyebrow}
      <h6 class="text-imperial-red tracking-widest">
        {eyebrow}
      </h6>
    {/if}
    {#if title}
      <h2 class="font-bold">{title}</h2>
    {/if}
  </div>
{/if}

<div
  id={formId}
  class={`p-md  md:pl-2xl md:pr-2xl gap-base max-w-max-page relative m-auto mb-32 flex w-full flex-col justify-around lg:flex-row ${title || eyebrow ? '' : 'mt-lg'}`}
>
  {#key hasError}
    <Filters isParentLoading={isLoading} {formId}></Filters>
  {/key}
  <div class="flex w-full flex-col justify-between">
    {#if hasError}
      <div class="p-sm">
        <ErrorCard
          message={errorMessage}
          retryCallback={reloadData}
          {reloadInLabel}
          {secondReloadLabel}
          {reloadLabel}
          {tryAgainLabel}
        />
        <div class="pb-sm"></div>
      </div>
    {:else}
      <ItemsGrid {tableRows} {isLoading} {Card} {SkeletonCard} hasLargeElements={true} {noResultsLabel}></ItemsGrid>

      <div class={`${tableRows?.length > 0 ? 'block' : 'hidden'}`}>
        <PaginationWithLimit {totalItems} {fetchData} idToScrollToTop={formId} {paginationSettings}
        ></PaginationWithLimit>
      </div>
    {/if}
  </div>
</div>
