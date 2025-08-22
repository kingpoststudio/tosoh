<script lang="ts">
  import { fade } from 'svelte/transition';
  import Card from './Card.svelte';
  const { portalItems } = $props();

  let emptyItems = $state(
    portalItems.length < 6 ? Array.from({ length: 6 - portalItems?.length }, (_, i) => i + 1) : []
  );
</script>

<div transition:fade={{ duration: 100 }} class="p-sm grid grid-cols-2 gap-4 lg:grid-cols-3">
  {#each portalItems as item}
    <Card hasSiblings={portalItems.length > 1} {item}></Card>
  {/each}
</div>
