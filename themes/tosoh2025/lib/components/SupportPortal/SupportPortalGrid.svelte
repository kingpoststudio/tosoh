<script lang="ts">
  const { portalItems } = $props();
</script>

<div class="p-sm grid h-full grid-cols-2 gap-4 lg:grid-cols-3">
  {#each portalItems as item}
    <div class="rounded-lg border border-gray-200 p-4">
      <h3 class="text-lg font-bold">{item.name}</h3>
    </div>
  {/each}
</div>
