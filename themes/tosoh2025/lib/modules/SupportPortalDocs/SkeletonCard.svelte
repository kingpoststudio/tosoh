<script lang="ts">
  import { fade } from 'svelte/transition';
</script>

<div
  transition:fade
  class="border-border relative w-full animate-pulse rounded-2xl border p-[1.25rem]"
>
  <div class=" gap-sm flex h-full flex-row items-center justify-between">
    <div class="h-lg w-lg rounded-lg bg-red-50"></div>
    <div class="mt-base flex w-full flex-col gap-[1.25rem]">
      <div class=" skeleton-pulse h-[1rem] w-full max-w-48 rounded-lg bg-red-50"></div>
      <div class="skeleton skeleton-pulse h-[1.5rem] w-full max-w-72 rounded-lg"></div>
      <div class="skeleton skeleton-pulse h-[1rem] w-full max-w-48 rounded-lg"></div>
      <div class="skeleton-pulse h-[1rem] w-full max-w-24 rounded-lg bg-red-50"></div>
    </div>
    <div class="h-lg w-lg skeleton skeleton-pulse rounded-lg"></div>
  </div>
</div>
