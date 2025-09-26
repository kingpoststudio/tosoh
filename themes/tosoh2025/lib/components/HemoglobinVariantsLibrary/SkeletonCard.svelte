<script lang="ts"></script>

<div
  class="border-border relative flex h-full w-full flex-col content-around gap-[1.25rem] rounded-2xl border p-[1.25rem]"
>
  <!-- Image skeleton -->
  <div class="skeleton h-[20rem] w-full rounded-lg"></div>

  <div class="gap-sm flex h-full w-full flex-col justify-between">
    <!-- Title and percentage section -->
    <div class="gap-sm flex flex-col">
      <!-- Variant name skeleton -->
      <div class="mt-base w-3/4">
        <div class="skeleton h-6 w-full rounded"></div>
      </div>

      <!-- Percentage with icon skeleton -->
      <div class="gap-sm flex items-center">
        <div class="skeleton h-5 w-12 rounded"></div>
        <div class="skeleton h-3 w-4 rounded"></div>
      </div>
    </div>

    <!-- AKA section skeleton -->
    <div class="skeleton h-4 w-2/3 rounded"></div>
    <div class="skeleton h-4 w-2/3 rounded"></div>

    <!-- Tags and button section -->
    <div class="gap-sm flex flex-col">
      <!-- Tags skeleton -->
      <div class="gap-sm align-start flex flex-col md:flex-row">
        <div class="skeleton p-xs h-8 w-full rounded-2xl md:w-20"></div>
        <div class="skeleton p-xs h-8 w-full rounded-2xl md:w-24"></div>
      </div>

      <!-- View Details button skeleton -->
      <div class="skeleton gap-sm flex h-10 w-full items-center justify-center rounded">
        <div class="skeleton-pulse h-4 w-20 rounded bg-white/20"></div>
        <div class="skeleton-pulse h-3 w-3 rounded bg-white/20"></div>
      </div>
    </div>
  </div>

  <!-- Top-right mutation badge skeleton -->
  <div class="px-sm py-xs absolute right-[1.25rem] top-[1.25rem]">
    <div class="skeleton h-6 w-16 rounded-2xl"></div>
  </div>
</div>

<style>
  .skeleton {
    background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
    background-size: 200% 100%;
    animation: loading 1.5s infinite;
  }

  @keyframes loading {
    0% {
      background-position: 200% 0;
    }
    100% {
      background-position: -200% 0;
    }
  }

  .skeleton-pulse {
    animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
  }

  @keyframes pulse {
    0%,
    100% {
      opacity: 1;
    }
    50% {
      opacity: 0.5;
    }
  }
</style>
