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
  import PaginationWithLimit from '../../components/PaginationWithLimit/PaginationWithLimit.svelte';
  import Card from './Card.svelte';
  import SkeletonCard from './SkeletonCard.svelte';
  import ItemsGrid from '../../components/ItemsGrid/ItemsGrid.svelte';
  import { fetchTableRows } from '../../services/fetchTableRows';
  import { mockPortaleEmogiobineTableRowsResponse } from './mock';
  import {
    constructFilterParams,
    constructRangePmFilters,
    getFilterColumnIds,
  } from '../../utils/utils';
  const formId = 'portale-emogiobine-filters';

  const portaleEmogiobineContent = window?.Tosoh?.PortaleEmogiobineContent;
  const topicFilters = portaleEmogiobineContent?.topic_filters?.filters || [];

  let searchColumnId = portaleEmogiobineContent?.search
    ? portaleEmogiobineContent?.search?.hubdb_column_id
    : '';

  let nonNumericFilters = getFilterColumnIds(topicFilters, 'non-numeric', [searchColumnId]) || [];

  let title = portaleEmogiobineContent?.title;
  let eyebrow = portaleEmogiobineContent?.eyebrow;
  let description = portaleEmogiobineContent?.description;

  let tableRows: any = $state([]);
  let totalItems = $state(0);
  let hasError = $state(false);
  let isLoading = $state(false);

  const constructBody = () => {
    const params = new URLSearchParams(window.location.search);
    const rangePmFilters = constructRangePmFilters(topicFilters);

    return {
      tableId: PROD_TOSOH_EMOGLOBINE_ITALIA_TABLE_ID,
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
        console.log(constructBody(), 'body');
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
      <h6 class="text-imperial-red tracking-widest">
        {eyebrow}
      </h6>
    {/if}
    {#if title}
      <h2 class="font-bold">{title}</h2>
    {/if}
    {#if description}
      <p class="text-xl">{description}</p>
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
