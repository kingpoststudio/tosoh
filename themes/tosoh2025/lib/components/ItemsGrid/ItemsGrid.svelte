<script lang="ts">
  import type { Component } from 'svelte';
  import { fade } from 'svelte/transition';
  import { getUrlParam } from '../../utils/urlUtils';

  const {
    Card,
    SkeletonCard,
    hasLargeElements = false,
    isLoading,
    tableRows,
    viewAs = 'grid',
  }: {
    Card: Component | any;
    SkeletonCard: Component | any;
    hasLargeElements?: boolean;
    isLoading: boolean;
    tableRows: any[];
    viewAs?: string;
  } = $props();

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
      {#if item?.values?.languages?.length > 1}
        {#each item?.values?.languages as language}
          <Card {viewAs} hasSiblings={tableRows?.length > 1} {item} {language}></Card>
        {/each}
      {:else}
        <Card {viewAs} hasSiblings={tableRows?.length > 1} {item}></Card>
      {/if}
    {/each}
  {:else}
    <div class="p-sm">
      <p class="text-center text-2xl font-bold">No results found</p>
    </div>
  {/if}
</div>
