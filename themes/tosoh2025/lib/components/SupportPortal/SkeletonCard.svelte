<script lang="ts">
  import { fade } from 'svelte/transition';
</script>

<div transition:fade class="p-sm h-[22rem] w-full animate-pulse rounded-lg bg-slate-50">
  <div class="gap-sm flex h-full flex-col items-center justify-between">
    <div class="h-32 w-full rounded-lg bg-slate-200"></div>
    <div class="h-8 w-full rounded-lg bg-slate-200"></div>
    <div class="h-12 w-full rounded-lg bg-slate-200"></div>
    <button
      disabled
      class="text-thin gap-sm flex w-full items-center justify-center rounded-lg bg-red-100 text-center text-sm"
      >Download
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="19"
        height="18"
        viewBox="0 0 19 18"
        fill="none"
        class="h-4 w-4"
      >
        <path
          d="M1.34863 13.004V14C1.34863 14.7956 1.6647 15.5587 2.22731 16.1213C2.78992 16.6839 3.55298 17 4.34863 17H14.3486C15.1443 17 15.9073 16.6839 16.47 16.1213C17.0326 15.5587 17.3486 14.7956 17.3486 14V13M9.34863 1.5V12.5M9.34863 12.5L12.8486 9M9.34863 12.5L5.84863 9"
          stroke="white"
          stroke-width="1.5"
          stroke-linecap="round"
          stroke-linejoin="round"
        />
      </svg></button
    >
  </div>
</div>
