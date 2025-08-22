<script lang="ts">
  import Card from './Card.svelte';

  const { portalItems } = $props();
</script>

<div class="p-sm grid h-full grid-cols-2 gap-4 lg:grid-cols-3">
  {#each portalItems as item}
    <Card {item}></Card>
  {/each}
</div>
