<script lang="ts">
  import Card from './Card.svelte';
  const { portalItems } = $props();

  let emptyItems = $state(
    portalItems.length < 6 ? Array.from({ length: 6 - portalItems?.length }, (_, i) => i + 1) : []
  );
</script>

<div class="p-sm grid h-full grid-cols-2 gap-4 lg:grid-cols-3">
  {#each portalItems as item}
    <Card hasSiblings={portalItems.length > 1} {item}></Card>
  {/each}
  {#each emptyItems as item}
    <div class="w-full"></div>
  {/each}
</div>
