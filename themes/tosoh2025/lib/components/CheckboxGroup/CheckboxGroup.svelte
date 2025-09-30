<script lang="ts">
  import { fade } from 'svelte/transition';

  let {
    options,
    name,
    disabled,
    displayLabel = true,
    labelPosition = 'top',
    disableReset,
    label,
    customClearFilter,
    isLoading,
  }: {
    options: any[];
    name: string;
    disabled: boolean;
    displayLabel?: boolean;
    labelPosition?: 'top' | 'left';
    disableReset?: boolean;
    label?: string;
    customClearFilter?: () => void;
    isLoading?: boolean;
  } = $props();

  const urlParams = new URLSearchParams(window.location.search);
  const activeFilters = urlParams.getAll(name);

  const clearFilter = () => {
    if (customClearFilter) {
      customClearFilter();
    } else {
      const url = new URL(window.location.href);
      url.searchParams.delete(name);
      window.location.href = url.toString();
    }
  };

  const setupFilterTitle = (column: string) =>
    column?.replace(/_/g, ' ')?.replace(/\b\w/g, (c) => c?.toUpperCase());
</script>

<div class="gap-sm flex flex-col">
  <div class={`gap-sm flex ${labelPosition === 'top' ? 'flex-col' : 'flex-row'}`}>
    <div class="gap-sm flex items-center">
      {#if displayLabel}
        <div class="text-lg font-semibold">{label || setupFilterTitle(name)}</div>
      {/if}
      {#if activeFilters.length > 0 && !disableReset}
        <button
          type="button"
          {disabled}
          transition:fade={{ duration: 200 }}
          class="fill-imperial-red plain h-4 w-4 cursor-pointer"
          onclick={clearFilter}
          aria-label="Clear selection"
        >
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 640" class="fill-imperial-red">
            <path
              d="M183.1 137.4C170.6 124.9 150.3 124.9 137.8 137.4C125.3 149.9 125.3 170.2 137.8 182.7L275.2 320L137.9 457.4C125.4 469.9 125.4 490.2 137.9 502.7C150.4 515.2 170.7 515.2 183.2 502.7L320.5 365.3L457.9 502.6C470.4 515.1 490.7 515.1 503.2 502.6C515.7 490.1 515.7 469.8 503.2 457.3L365.8 320L503.1 182.6C515.6 170.1 515.6 149.8 503.1 137.3C490.6 124.8 470.3 124.8 457.8 137.3L320.5 274.7L183.1 137.4z"
            /></svg
          >
        </button>
      {/if}
    </div>

    <div class="w-full">
      {#if options?.length > 0}
        <div class="gap-sm flex flex-col">
          {#each options as option}
            <label
              class="gap-sm hover:text-imperial-red flex cursor-pointer items-center transition-colors duration-200"
            >
              <input
                type="checkbox"
                {name}
                value={option.name}
                {disabled}
                checked={activeFilters.includes(option.name)}
                class="checkbox-custom focus:ring-imperial-red text-imperial-red h-4 w-4 cursor-pointer rounded border-slate-200 focus:outline-none focus:ring-1 focus:ring-opacity-50 disabled:cursor-not-allowed disabled:opacity-50"
              />
              <span class="text-default select-none"
                >{option.label}{option.quantity !== undefined ? ` (${option?.quantity})` : ''}</span
              >
            </label>
          {/each}
        </div>
      {:else if isLoading}
        <div class="gap-sm flex flex-col">
          {#each [1, 2, 3] as skeletonOption}
            <label
              class="gap-sm hover:text-imperial-red flex cursor-pointer items-center transition-colors duration-200"
            >
              <input
                type="checkbox"
                {name}
                value={skeletonOption}
                disabled={true}
                class="checkbox-custom focus:ring-imperial-red text-imperial-red h-4 w-4 cursor-pointer rounded border-slate-200 focus:outline-none focus:ring-1 focus:ring-opacity-50 disabled:cursor-not-allowed disabled:opacity-50"
              />
              <span
                class={`h-6 animate-pulse select-none rounded bg-slate-200 ${skeletonOption === 2 ? 'w-24' : 'w-32'}`}
              ></span>
            </label>
          {/each}
        </div>
      {:else}
        <div>No options available</div>
      {/if}
    </div>
  </div>
</div>

<style>
  .checkbox-custom {
    appearance: none;
    background-color: transparent;
    border: 1px solid var(--color-border);
    transition: all 0.2s ease-in-out;
    position: relative;
  }

  .checkbox-custom:checked {
    background-color: var(--color-imperial-red);
    border-color: var(--color-imperial-red);
  }

  .checkbox-custom:checked::after {
    content: '';
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 6px;
    height: 10px;
    border: solid white;
    border-width: 0 2px 2px 0;
    transform: translate(-50%, -60%) rotate(45deg);
  }

  .checkbox-custom:hover:not(:disabled) {
    border-color: var(--color-imperial-red);
  }

  .checkbox-custom:focus {
    box-shadow: 0 0 0 1px var(--color-imperial-red);
  }

  label:hover .checkbox-custom:not(:disabled) {
    border-color: var(--color-imperial-red);
  }
</style>
