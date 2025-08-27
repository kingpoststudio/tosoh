<script lang="ts">
  import { fade } from 'svelte/transition';
  import Card from './Card.svelte';
  const { portalItems } = $props();
</script>

{#if portalItems.length > 0}
  <div transition:fade={{ duration: 100 }} class="lg:p-sm grid grid-cols-2 gap-4 lg:grid-cols-3">
    {#each portalItems as item}
      <Card hasSiblings={portalItems.length > 1} item={item.values}></Card>
    {/each}
  </div>
{:else}
  <div class="p-sm">
    <p class="text-center text-2xl font-bold">No results found</p>
  </div>
{/if}
