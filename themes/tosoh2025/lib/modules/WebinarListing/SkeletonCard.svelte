<script lang="ts">
  import { fade } from 'svelte/transition';
</script>

<div
  transition:fade
  class="border-border mx-auto flex w-full max-w-[32rem] animate-pulse flex-col overflow-hidden rounded-2xl border bg-white"
>
  <!-- Header Section with Dark Blue Background -->
  <div
    class="bg-prussian-blue p-md relative flex min-h-[18rem] flex-col justify-between overflow-hidden"
  >
    <!-- Time and Title Section -->
    <div class=" flex h-full flex-col justify-end">
      <!-- Title Skeleton -->
      <div class="space-y-2">
        <div class="h-6 w-3/5 rounded bg-white/30"></div>
        <div class="h-6 w-full rounded bg-white/30"></div>
        <div class="h-6 w-4/5 rounded bg-white/30"></div>
      </div>
    </div>
  </div>

  <!-- Bottom Section with White Background -->
  <div class="p-md gap-md flex h-full flex-col justify-between">
    <!-- Speakers Section Skeleton -->
    <div class="gap-sm flex h-full flex-col justify-center space-y-4">
      <!-- First Speaker -->
      <div class="flex items-center">
        <!-- Avatar -->
        <div class="mr-3 flex -space-x-6">
          <div class="skeleton skeleton-pulse h-lg w-lg rounded-full"></div>
        </div>
        <!-- Speaker Info -->
        <div class="flex-1 space-y-2">
          <div class="skeleton skeleton-pulse h-5 w-32 rounded"></div>
          <div class="skeleton skeleton-pulse h-4 w-24 rounded"></div>
        </div>
      </div>
    </div>

    <!-- Register Button Skeleton -->
    <div class="skeleton skeleton-pulse h-lg w-full rounded-lg"></div>
  </div>
</div>
