<svelte:options
  customElement={{
    tag: 'tosoh-hemoglobin-variants-library',
    shadow: 'none',
  }}
/>

<script lang="ts">
  import { onMount } from 'svelte';
  import { createPortalState } from '../../factories/createPortalState.svelte';
  import { PROD_TOSOH_HEMOGLOBIN_VARIANTS_LIBRARY_TABLE_ID } from '../../utils/constants';
  import Filters from './Filters.svelte';
  import ErrorCard from '../../components/ErrorCard/ErrorCard.svelte';
  import PaginationWithLimit from '../../components/Pagination/Pagination.svelte';
  import Card from './Card.svelte';
  import SkeletonCard from './SkeletonCard.svelte';
  import ItemsGrid from '../../components/ItemsGrid/ItemsGrid.svelte';

  const hemoglobinVariantsLibraryContent = window?.Tosoh?.HemoglobinVariantsLibraryContent;

  const portal = createPortalState({
    formId: 'hemoglobin-variants-library-filters',
    content: hemoglobinVariantsLibraryContent,
    prodTableId: PROD_TOSOH_HEMOGLOBIN_VARIANTS_LIBRARY_TABLE_ID,
    properties:
      'document_url,heterozygote_comments,aka,variant_image,variant_name,hgvs_name,mutation,mutation_description,heterozygote_clinical_presentation,heterozygote_laboratory_findings,heterozygote_comments,homozygote_clinical_presentation,homozygote_laboratory_findings,homozygote_comments,ethnicity,comments,instrument,area_under_peak,rt_min,rt_max,window,references',
    sort: '-start_date',
    isActivated: true,
  });

  const { title, eyebrow, formId, fetchData, reloadData } = portal;

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
  {#key portal.hasError}
    <Filters isParentLoading={portal.isLoading} {formId}></Filters>
  {/key}
  <div class="flex w-full flex-col justify-between">
    {#if portal.hasError}
      <div class="p-sm">
        <ErrorCard
          errorCard={hemoglobinVariantsLibraryContent?.error_card}
          retryCallback={reloadData}
        />
        <div class="pb-sm"></div>
      </div>
    {:else}
      <ItemsGrid
        tableRows={portal.tableRows}
        isLoading={portal.isLoading}
        {Card}
        {SkeletonCard}
        hasLargeElements={true}
        additionalConfSettings={hemoglobinVariantsLibraryContent?.additional_settings}
      ></ItemsGrid>

      <div class={`${portal.tableRows?.length > 0 ? 'block' : 'hidden'}`}>
        <PaginationWithLimit
          totalItems={portal.totalItems}
          {fetchData}
          idToScrollToTop={formId}
          additionalConfSettings={hemoglobinVariantsLibraryContent?.additional_settings}
        ></PaginationWithLimit>
      </div>
    {/if}
  </div>
</div>
