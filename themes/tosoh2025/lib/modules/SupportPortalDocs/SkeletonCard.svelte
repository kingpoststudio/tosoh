<script lang="ts">
  import { fade } from 'svelte/transition';
</script>

<div
  transition:fade
  class="border-border relative w-full animate-pulse rounded-2xl border p-[1.25rem]"
>
  <div class=" gap-sm flex h-full flex-col">
    <div class="h-lg w-lg right-base top-base absolute rounded-lg bg-red-50"></div>
    <div class=" skeleton-pulse h-[1rem] w-full max-w-24 rounded-lg bg-red-50"></div>
    <div class="skeleton skeleton-pulse h-[1.5rem] w-full max-w-72 rounded-lg"></div>
    <div class="skeleton skeleton-pulse h-[1rem] w-full max-w-48 rounded-lg"></div>
    <div class="skeleton-pulse h-[1rem] w-full max-w-24 rounded-lg bg-red-50"></div>

    <div class="gap-sm flex flex-row items-center">
      <div class="skeleton-pulse skeleton h-base w-full max-w-24 rounded-lg"></div>
      <div class="skeleton-pulse h-lg skeleton w-full max-w-20 rounded-lg"></div>
      <div class="skeleton-pulse h-lg w-full max-w-16 rounded-lg bg-red-50"></div>
    </div>
  </div>
</div>
