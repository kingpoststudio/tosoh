<svelte:options
  customElement={{
    tag: 'tosoh-support-portal-docs',
    shadow: 'none',
  }}
/>

<script lang="ts">
  import { onMount } from 'svelte';
  import { createPortalState } from '../../factories/createPortalState.svelte';
  import {
    DEFAULT_ACCESS_LEVEL,
    PROD_TOSOH_SUPPORT_PORTAL_SDS_DOCS_TABLE_ID,
  } from '../../utils/constants';
  import { setSearchParams } from '../../utils/urlUtils';
  import Card from './Card.svelte';
  import ErrorCard from '../../components/ErrorCard/ErrorCard.svelte';
  import Filters from './Filters.svelte';
  import ItemsGrid from '../../components/ItemsGrid/ItemsGrid.svelte';
  import PaginationWithLimit from '../../components/Pagination/Pagination.svelte';
  import SkeletonCard from './SkeletonCard.svelte';

  const supportPortalDocsContent = window?.Tosoh?.SupportPortalDocsContent;

  const portal = createPortalState({
    formId: 'support-portal-docs',
    content: supportPortalDocsContent,
    prodTableId: PROD_TOSOH_SUPPORT_PORTAL_SDS_DOCS_TABLE_ID,
    properties:
      'f,document_folder,document_url_part,languages,designation,category,linked_product_codes,expiration_date,batch_number',
    isActivated: true,
    accessLevel: supportPortalDocsContent?.access_level || DEFAULT_ACCESS_LEVEL,
  });

  const { title, description, searchColumnIds, formId, fetchData, reloadData } = portal;

  const defaultLanguage = supportPortalDocsContent?.default_language;
  const viewAs = 'list';

  const setDefaultLanguage = () => {
    if (defaultLanguage) {
      const params = new URLSearchParams(window.location.search);

      if (!params.has('languages') && !searchColumnIds?.some((id) => params?.has(id))) {
        setSearchParams({
          languages: defaultLanguage,
        });
      }
    }
  };

  setDefaultLanguage();

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
  class={`p-md md:pl-2xl md:pr-2xl gap-base max-w-max-page relative m-auto mb-32 flex w-full flex-col justify-around lg:flex-row ${title || description ? '' : 'mt-lg'}`}
>
  {#key portal.hasError}
    <Filters isParentLoading={portal.isLoading} {formId}></Filters>
  {/key}
  <div class="flex w-full flex-col justify-between">
    {#if portal.hasError}
      <div class="p-sm">
        <ErrorCard errorCard={supportPortalDocsContent?.error_card} retryCallback={reloadData} />
        <div class="pb-sm"></div>
      </div>
    {:else}
      <ItemsGrid
        tableRows={portal.tableRows}
        isLoading={portal.isLoading}
        {viewAs}
        {Card}
        {SkeletonCard}
        additionalSettings={supportPortalDocsContent?.additional_settings}
      ></ItemsGrid>

      <div class={`${portal.tableRows?.length > 0 ? 'block' : 'hidden'}`}>
        <PaginationWithLimit
          totalItems={portal.totalItems}
          {fetchData}
          idToScrollToTop={formId}
          additionalSettings={supportPortalDocsContent?.additional_settings}
        ></PaginationWithLimit>
      </div>
    {/if}
  </div>
</div>
