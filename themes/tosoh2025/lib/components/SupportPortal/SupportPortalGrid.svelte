<script lang="ts">
  import { fade } from 'svelte/transition';
  import Card from './Card.svelte';
  import SkeletonCard from './SkeletonCard.svelte';
  const { portalItems, isLoading } = $props();

  const constructLengthForSkeletons = () => {
    return parseInt(new URLSearchParams(window.location.search)?.get('limit') || '12');
  };

  let skeletonItems = $state(
    Array.from({ length: constructLengthForSkeletons() }, (_, i) => i + 1)
  );

  $effect(() => {
    if (isLoading) {
      skeletonItems = Array.from({ length: constructLengthForSkeletons() }, (_, i) => i + 1);
    }
  });
</script>

<div transition:fade={{ duration: 100 }} class="grid grid-cols-2 gap-4 lg:grid-cols-3">
  {#if isLoading}
    {#each skeletonItems as item}
      <SkeletonCard></SkeletonCard>
    {/each}
  {:else if portalItems.length > 0 && !isLoading}
    {#each portalItems as item}
      <Card hasSiblings={portalItems.length > 1} {item}></Card>
    {/each}
  {:else}
    <div class="p-sm">
      <p class="text-center text-2xl font-bold">No results found</p>
    </div>
  {/if}
</div>
