<script lang="ts">
  import type { Component } from 'svelte';
  import { fade } from 'svelte/transition';
  import type { AdditionalSettings } from '../../../types/fields';
  import { getUrlParam } from '../../utils/urlUtils';

  const {
    Card,
    SkeletonCard,
    hasLargeElements = false,
    isLoading,
    tableRows,
    viewAs = 'grid',
    additionalSettings,
  }: {
    Card: Component | any;
    SkeletonCard: Component | any;
    hasLargeElements?: boolean;
    isLoading: boolean;
    tableRows: any[];
    viewAs?: string;
    additionalSettings?: AdditionalSettings;
  } = $props();

  const noResultsLabel = $derived(
    additionalSettings?.results_settings?.no_results_label ?? 'No results found.'
  );

  const constructLengthForSkeletons = () => {
    return parseInt(getUrlParam('limit') || '12');
  };

  let skeletonItems = $state(
    Array.from({ length: constructLengthForSkeletons() }, (_, i) => i + 1)
  );

  $effect(() => {
    if (isLoading) {
      skeletonItems = Array.from({ length: constructLengthForSkeletons() }, (_, i) => i + 1);
    }
  });

  const gridClass = $derived(
    viewAs === 'grid'
      ? `grid  ${hasLargeElements ? 'grid-cols-1 md:grid-cols-2' : 'grid-cols-2'} gap-4 xl:grid-cols-3`
      : 'flex flex-col gap-sm'
  );
</script>

<div transition:fade={{ duration: 100 }} class={gridClass}>
  {#if isLoading}
    {#each skeletonItems as item}
      <SkeletonCard {viewAs}></SkeletonCard>
    {/each}
  {:else if tableRows?.length > 0 && !isLoading}
    {#each tableRows as item}
      <Card {viewAs} hasSiblings={tableRows?.length > 1} {item}></Card>
    {/each}
  {:else}
    <div class="p-sm">
      <p class="text-center text-2xl font-bold">{noResultsLabel}</p>
    </div>
  {/if}
</div>
