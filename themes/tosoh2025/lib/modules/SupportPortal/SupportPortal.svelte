<svelte:options
  customElement={{
    tag: 'tosoh-support-portal',
    shadow: 'none',
  }}
/>

<script lang="ts">
  import { onMount } from 'svelte';
  import { createPortalState } from '../../factories/createPortalState.svelte';
  import { PROD_TOSOH_SUPPORT_PORTAL_TABLE_ID } from '../../utils/constants';
  import ErrorCard from '../../components/ErrorCard/ErrorCard.svelte';
  import PaginationWithLimit from '../../components/Pagination/Pagination.svelte';
  import Card from './Card.svelte';
  import SkeletonCard from './SkeletonCard.svelte';
  import ItemsGrid from '../../components/ItemsGrid/ItemsGrid.svelte';
  import Filters from './Filters.svelte';

  const supportPortalContent = window?.Tosoh?.SupportPortalContent;

  const portal = createPortalState({
    formId: 'support-portal',
    content: supportPortalContent,
    prodTableId: PROD_TOSOH_SUPPORT_PORTAL_TABLE_ID,
    properties:
      'name,image,hs_path,product_family,product_type,document_type,wistia_video_url,document_url',
    isActivated: true,
    accessLevel: supportPortalContent?.access_level || 'Customer',
  });

  const { title, description, formId, fetchData, reloadData } = portal;

  let forceListView = supportPortalContent?.force_list_view || false;

  const params = new URLSearchParams(window.location.search);
  let viewAs: 'grid' | 'list' = $state(
    forceListView ? 'list' : (params.get('view') as 'grid' | 'list') || 'grid'
  );

  const handleChangeView = () => {
    const url = new URL(window.location.href);
    url.searchParams.set('view', viewAs === 'grid' ? 'list' : 'grid');
    window.history.pushState({}, '', url.toString().replace(/%2C/g, ','));
    viewAs = viewAs === 'grid' ? 'list' : 'grid';
  };

  onMount(() => {
    fetchData();
  });
</script>

{#if title || description}
  <div class="max-w-max-page gap-md p-md md:pl-2xl md:pr-2xl m-auto flex flex-col">
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
    <Filters isParentLoading={portal.isLoading} {viewAs} {handleChangeView} {formId}></Filters>
  {/key}
  <div class="flex w-full flex-col justify-between">
    {#if portal.hasError}
      <div class="p-sm">
        <ErrorCard message="Failed to load portal items" retryCallback={reloadData} />
        <div class="pb-sm"></div>
      </div>
    {:else}
      <ItemsGrid tableRows={portal.tableRows} isLoading={portal.isLoading} {viewAs} {Card} {SkeletonCard}></ItemsGrid>

      <div class={`${portal.tableRows?.length > 0 ? 'block' : 'hidden'}`}>
        <PaginationWithLimit totalItems={portal.totalItems} {fetchData} idToScrollToTop={formId}
        ></PaginationWithLimit>
      </div>
    {/if}
  </div>
</div>
