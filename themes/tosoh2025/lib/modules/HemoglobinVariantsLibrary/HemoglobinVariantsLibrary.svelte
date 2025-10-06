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
  import PaginationWithLimit from '../../components/PaginationWithLimit/PaginationWithLimit.svelte';
  import Card from './Card.svelte';
  import SkeletonCard from './SkeletonCard.svelte';
  import ItemsGrid from '../../components/ItemsGrid/ItemsGrid.svelte';
  import { fetchTableRows } from '../../services/fetchTableRows';
  import { mockHemoglobinVariantsLibraryTableRowsResponse } from './mock';
  import {
    constructFilterParams,
    constructRangePmFilters,
    getFilterColumnIds,
  } from '../../utils/utils';

  const formId = 'hemoglobin-variants-library-filters';

  const hemoglobinVariantsLibraryContent = window?.Tosoh?.HemoglobinVariantsLibraryContent;
  const topicFilters = hemoglobinVariantsLibraryContent?.topic_filters?.filters || [];

  let searchColumnId = hemoglobinVariantsLibraryContent?.search
    ? hemoglobinVariantsLibraryContent?.search?.hubdb_column_id
    : '';

  let nonNumericFilters = getFilterColumnIds(topicFilters, 'non-numeric', [searchColumnId]) || [];

  let title = hemoglobinVariantsLibraryContent?.title;
  let eyebrow = hemoglobinVariantsLibraryContent?.eyebrow;

  let tableRows: any = $state([]);
  let totalItems = $state(0);
  let hasError = $state(false);
  let isLoading = $state(false);

  const constructBody = () => {
    const params = new URLSearchParams(window.location.search);
    const rangePmFilters = constructRangePmFilters(topicFilters);

    return {
      sort: '-start_date',
      tableId: PROD_TOSOH_HEMOGLOBIN_VARIANTS_LIBRARY_TABLE_ID,
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
  class={`p-md  md:pl-2xl md:pr-2xl gap-base max-w-max-page relative m-auto mb-32 flex w-full flex-col justify-around lg:flex-row ${title || eyebrow ? '' : 'mt-lg'}`}
>
  <Filters isParentLoading={isLoading} {formId}></Filters>
  <div class="flex w-full flex-col justify-between">
    {#if hasError}
      <div class="p-sm">
        <ErrorCard message="Failed to load portal items" retryCallback={reloadData} />
        <div class="pb-sm"></div>
      </div>
    {:else}
      <ItemsGrid {tableRows} {isLoading} {Card} {SkeletonCard} hasLargeElements={true}></ItemsGrid>

      <div class={`${tableRows?.length > 0 ? 'block' : 'hidden'}`}>
        <PaginationWithLimit {totalItems} {fetchData}></PaginationWithLimit>
      </div>
    {/if}
  </div>
</div>
