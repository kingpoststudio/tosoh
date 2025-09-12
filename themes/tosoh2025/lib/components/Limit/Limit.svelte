<script lang="ts">
  let { totalItems, limit, pagination } = $props();

  let options = [12, 24, 48];
</script>

<div class="gap-sm flex items-center justify-center text-[#4E4F54]">
  <p>Items per page:</p>
  <select
    bind:value={limit}
    name="limit"
    class="bg-ghost-white p-xs rounded border border-slate-200"
  >
    {#each options as option}
      <option value={option}>{option}</option>
    {/each}
  </select>
  <p>
    {(pagination - 1) * limit || 1} - {Math.min((pagination - 1) * limit + limit, totalItems)} of
    {totalItems}
    items
  </p>
</div>
