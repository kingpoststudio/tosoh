<svelte:options
  customElement={{
    tag: 'tosoh-portale-emogiobine',
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
    PROD_TOSOH_EMOGLOBINE_ITALIA_TABLE_ID,
  } from '../../utils/constants';
  import PaginationWithLimit from '../../components/Pagination/Pagination.svelte';
  import Card from './Card.svelte';
  import SkeletonCard from './SkeletonCard.svelte';
  import ItemsGrid from '../../components/ItemsGrid/ItemsGrid.svelte';
  import { fetchTableRows } from '../../services/fetchTableRows';
  import { mockPortaleEmogiobineTableRowsResponse } from './mock';
  import {
    constructFilterParams,
    constructRangePmFilters,
    getFilterColumnIds,
    parseSearchColumnIds,
    getFiltersTableId,
  } from '../../utils/utils';
  const formId = 'portale-emogiobine-filters';

  const portaleEmogiobineContent = window?.Tosoh?.HemoglobinPortalContent;
  const topicFilters = portaleEmogiobineContent?.topic_filters?.filters || [];
  const tableId = getFiltersTableId(
    PROD_TOSOH_EMOGLOBINE_ITALIA_TABLE_ID,
    portaleEmogiobineContent?.topic_filters?.hubdb_table_id
  );
  let searchEnabled = portaleEmogiobineContent?.search?.enable_search;
  let searchColumnIds = parseSearchColumnIds(portaleEmogiobineContent?.search);

  let nonNumericFilters = getFilterColumnIds(topicFilters, 'non-numeric', searchColumnIds) || [];

  let title = portaleEmogiobineContent?.title;
  let eyebrow = portaleEmogiobineContent?.eyebrow;
  let description = portaleEmogiobineContent?.description;

  let tableRows: any = $state([]);
  let totalItems = $state(0);
  let hasError = $state(false);
  let isLoading = $state(false);

  const errorCard = portaleEmogiobineContent?.error_card;
  const errorMessage = errorCard?.message || 'Failed to load portal items';
  const reloadInLabel = errorCard?.reload_in_label || 'Reload in';
  const secondReloadLabel = errorCard?.second_reload_label || 'seconds';
  const reloadLabel = errorCard?.reload_label || 'Reload';
  const tryAgainLabel = errorCard?.try_again_label || 'Try again';

  // Additional Configuration Settings
  const additionalConfSettings = portaleEmogiobineContent?.additional_conf_settings;
  const noResultsLabel =
    additionalConfSettings?.results_settings?.no_results_label || 'No results found.';
  const paginationSettings = additionalConfSettings?.pagination_settings;

  const constructBody = () => {
    const params = new URLSearchParams(window.location.search);
    const rangePmFilters = constructRangePmFilters(topicFilters);

    return {
      tableId: tableId,
      properties:
        'name,summary,sex,patient_dob,ethnicity,history,anomaly,blood_count,hemoglobin_status,other,advice,diagnosis,other_diagnosis,attachment_1,attachment_2,attachment_3,attachment_4',
      limit: parseInt(params?.get('limit') || `${defaultItemsLimit}`),
      pagination: parseInt(params?.get('pagination') || `${defaultPagination}`),
      offset:
        parseInt(params?.get('limit') || `${defaultItemsLimit}`) *
          (parseInt(params?.get('pagination') || `${defaultPagination}`) - 1) || 0,
      filters: constructFilterParams(nonNumericFilters),
      numericComparisonFilters: [...rangePmFilters],
    };
  };

  const fetchData = async () => {
    try {
      isLoading = true;
      let data;

      if (!IS_MOCK) {
        data = await fetchTableRows(constructBody());
      } else {
        data = mockPortaleEmogiobineTableRowsResponse;
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
      <div class="text-imperial-red tracking-widest">
        {@html eyebrow}
      </div>
    {/if}
    {#if title}
      <div class="font-bold">{@html title}</div>
    {/if}
    {#if description}
      <div class="text-xl">{@html description}</div>
    {/if}
  </div>
{/if}

<div
  id={formId}
  class={`p-md  md:pl-2xl md:pr-2xl gap-base max-w-max-page relative m-auto mb-32 flex w-full flex-col justify-around lg:flex-row ${title || eyebrow ? '' : 'mt-lg'}`}
>
  {#if topicFilters?.length > 0 || searchEnabled}
    {#key hasError}
      <Filters isParentLoading={isLoading} {formId}></Filters>
    {/key}
  {/if}
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
