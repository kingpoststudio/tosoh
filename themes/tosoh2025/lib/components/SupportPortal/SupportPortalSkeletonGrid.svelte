<script lang="ts">
  import { fade } from 'svelte/transition';
  import SkeletonCard from './SkeletonCard.svelte';
  const { skeletonItems } = $props();
</script>

<div transition:fade={{ duration: 100 }} class="p-sm grid grid-cols-2 gap-4 lg:grid-cols-3">
  {#each skeletonItems as item}
    <SkeletonCard></SkeletonCard>
  {/each}
</div>
