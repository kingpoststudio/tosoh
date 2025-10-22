<script lang="ts">
  import { fade } from 'svelte/transition';
  const { viewAs } = $props();
</script>

<div
  transition:fade
  class="border-border relative w-full animate-pulse rounded-2xl border p-[1.25rem]"
>
  <div class=" flex h-full flex-col items-center justify-between">
    {#if viewAs === 'grid'}
      <div class="skeleton skeleton-pulse aspect-video w-full rounded-lg"></div>
    {/if}

    <div class="mt-base flex w-full flex-col gap-[1.25rem]">
      <div
        class=" h-[1rem] w-full {viewAs === 'list'
          ? 'max-w-48'
          : ''} skeleton skeleton-pulse rounded-lg"
      ></div>
      <div
        class="{viewAs === 'list' ? 'h-[1.5rem]' : 'h-[3.5rem]'} w-full {viewAs === 'list'
          ? 'max-w-72'
          : ''} skeleton skeleton-pulse rounded-lg"
      ></div>
      <span
        class="skeleton-pulse! h-lg flex items-center justify-center gap-[1.25rem] rounded-lg bg-red-100 text-center text-sm {viewAs ===
        'list'
          ? 'w-fit'
          : 'w-full'}"
      >
      </span>
    </div>
    <div class=" top-base right-base absolute h-[2rem] w-[3.125rem] rounded-lg bg-red-50"></div>
  </div>
</div>
