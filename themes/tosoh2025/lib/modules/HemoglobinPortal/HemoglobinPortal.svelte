<svelte:options
  customElement={{
    tag: 'tosoh-portale-emogiobine',
    shadow: 'none',
  }}
/>

<script lang="ts">
  import { onMount } from 'svelte';
  import { createPortalState } from '../../factories/createPortalState.svelte';
  import { PROD_TOSOH_EMOGLOBINE_ITALIA_TABLE_ID } from '../../utils/constants';
  import Filters from './Filters.svelte';
  import ErrorCard from '../../components/ErrorCard/ErrorCard.svelte';
  import PaginationWithLimit from '../../components/Pagination/Pagination.svelte';
  import Card from './Card.svelte';
  import SkeletonCard from './SkeletonCard.svelte';
  import ItemsGrid from '../../components/ItemsGrid/ItemsGrid.svelte';

  const hemoglobinPortalContent = window?.Tosoh?.HemoglobinPortalContent;

  const portal = createPortalState({
    formId: 'portale-emogiobine-filters',
    content: hemoglobinPortalContent,
    prodTableId: PROD_TOSOH_EMOGLOBINE_ITALIA_TABLE_ID,
    properties:
      'name,summary,sex,patient_dob,ethnicity,history,anomaly,blood_count,hemoglobin_status,other,advice,diagnosis,other_diagnosis,attachment_1,attachment_2,attachment_3,attachment_4',
  });

  const {
    title,
    eyebrow,
    description,
    searchEnabled,
    topicFilters,
    formId,
    fetchData,
    reloadData,
  } = portal;

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
    {#key portal.hasError}
      <Filters isParentLoading={portal.isLoading} {formId}></Filters>
    {/key}
  {/if}
  <div class="flex w-full flex-col justify-between">
    {#if portal.hasError}
      <div class="p-sm">
        <ErrorCard errorCard={hemoglobinPortalContent?.error_card} retryCallback={reloadData} />
        <div class="pb-sm"></div>
      </div>
    {:else}
      <ItemsGrid
        tableRows={portal.tableRows}
        isLoading={portal.isLoading}
        {Card}
        {SkeletonCard}
        hasLargeElements={true}
        additionalConfSettings={hemoglobinPortalContent?.additional_settings}
      ></ItemsGrid>

      <div class={`${portal.tableRows?.length > 0 ? 'block' : 'hidden'}`}>
        <PaginationWithLimit
          totalItems={portal.totalItems}
          {fetchData}
          idToScrollToTop={formId}
          additionalConfSettings={hemoglobinPortalContent?.additional_settings}
        ></PaginationWithLimit>
      </div>
    {/if}
  </div>
</div>
