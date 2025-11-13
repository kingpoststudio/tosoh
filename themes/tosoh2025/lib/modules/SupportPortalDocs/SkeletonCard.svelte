<script lang="ts">
  import { fade } from 'svelte/transition';
</script>

<div
  transition:fade
  class="border-border relative w-full animate-pulse rounded-2xl border p-[1.25rem]"
>
  <div class=" flex h-full flex-col items-center justify-between">
    <div class="mt-base flex w-full flex-col gap-[1.25rem]">
      <div class=" skeleton skeleton-pulse h-[1rem] w-full max-w-48 rounded-lg"></div>
      <div class="skeleton skeleton-pulse h-[1.5rem] w-full max-w-72 rounded-lg"></div>

      <div class="gap-sm flex flex-col sm:flex-row">
        <div class="gap-sm flex flex-row">
          <div class="skeleton skeleton-pulse h-md min-w-24 self-center rounded-lg"></div>
          <select disabled class="skeleton skeleton-pulse h-lg w-full rounded-lg sm:w-40"></select>
        </div>
        <span
          class="skeleton-pulse! h-lg w-4xl flex items-center justify-center gap-[1.25rem] rounded-lg bg-red-100 text-center text-sm"
        ></span>
      </div>
    </div>
    <div class="top-base right-base h-md w-lg absolute rounded-lg bg-red-50"></div>
  </div>
</div>
