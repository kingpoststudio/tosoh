<svelte:options
  customElement={{
    tag: 'tosoh-kiosk-documents',
    shadow: 'none',
  }}
/>

<script lang="ts">
  import { onMount } from 'svelte';
  import { createPortalState } from '../../factories/createPortalState.svelte';
  import { PROD_TOSOH_KIOSK_DOCUMENTS_TABLE_ID } from '../../utils/constants';
  import Filters from './Filters.svelte';
  import ErrorCard from '../../components/ErrorCard/ErrorCard.svelte';
  import PaginationWithLimit from '../../components/Pagination/Pagination.svelte';
  import Card from './Card.svelte';
  import SkeletonCard from './SkeletonCard.svelte';
  import ItemsGrid from '../../components/ItemsGrid/ItemsGrid.svelte';

  const constructDateComparisonFilters = () => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const todayInMilliSeconds = Math.floor(today.getTime());

    return [
      {
        columnId: 'start_date',
        comparison: 'lte',
        value: todayInMilliSeconds,
      },
      {
        columnId: 'end_date',
        comparison: 'gte',
        value: todayInMilliSeconds,
      },
    ];
  };

  const portal = createPortalState({
    formId: 'kiosk-documents',
    content: window?.Tosoh?.KioskDocumentsContent,
    prodTableId: PROD_TOSOH_KIOSK_DOCUMENTS_TABLE_ID,
    properties: 'title,document_type,image,page_path,start_date,end_date',
    sort: '-start_date',
    isActivated: true,
    extraNumericFilters: constructDateComparisonFilters,
  });

  const { title, description, formId, fetchData, reloadData } = portal;

  onMount(() => {
    fetchData();
  });
</script>

{#if title || description}
  <div class="max-w-max-page gap-md p-md md:pl-2xl md:pr-2xl m-auto flex flex-col pt-0">
    {#if title}
      <h2 class="font-bold">{title}</h2>
    {/if}

    {#if description}
      <h6 class="text-nickel">{description}</h6>
    {/if}
  </div>
{/if}

<div
  id={formId}
  class={`p-md  md:pl-2xl md:pr-2xl gap-base max-w-max-page relative m-auto mb-32 flex w-full flex-col justify-around lg:flex-row ${title || description ? '' : 'mt-lg'}`}
>
  {#key portal.hasError}
    <Filters isParentLoading={portal.isLoading} {formId}></Filters>
  {/key}
  <div class="flex w-full flex-col justify-between">
    {#if portal.hasError}
      <div class="p-sm">
        <ErrorCard message="Failed to load portal items" retryCallback={reloadData} />
        <div class="pb-sm"></div>
      </div>
    {:else}
      <ItemsGrid tableRows={portal.tableRows} isLoading={portal.isLoading} {Card} {SkeletonCard}></ItemsGrid>

      <div class={`${portal.tableRows?.length > 0 ? 'block' : 'hidden'}`}>
        <PaginationWithLimit totalItems={portal.totalItems} {fetchData} idToScrollToTop={formId}
        ></PaginationWithLimit>
      </div>
    {/if}
  </div>
</div>
