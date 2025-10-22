<script lang="ts">
  import { setupFilterTitle } from '../../utils/utils';

  let {
    disabled,
    displayLabel = true,
    isLoading,
    label,
    labelPosition = 'top',
    name,
    options,
  }: {
    disabled: boolean;
    displayLabel?: boolean;
    isLoading?: boolean;
    label?: string;
    labelPosition?: 'top' | 'left';
    multiple?: boolean;
    name: string;
    options: any[];
  } = $props();

  const urlParams = new URLSearchParams(window.location.search);
  const activeFilters = urlParams.getAll(name);
</script>

<div class="gap-sm flex flex-col">
  <div class={`gap-sm flex ${labelPosition === 'top' ? 'flex-col' : 'flex-row'}`}>
    <div class="gap-sm flex items-center">
      {#if displayLabel}
        <div class="text-lg font-semibold">{label || setupFilterTitle(name)}</div>
      {/if}
    </div>

    <div class="w-full">
      {#if options?.length > 0}
        <div class="gap-sm flex flex-col">
          {#each options as option}
            <label
              class={`gap-sm hover:text-imperial-red flex  items-center transition-colors duration-200  ${option?.quantity === 0 ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'}`}
            >
              <input
                type="checkbox"
                {name}
                value={option.name}
                disabled={disabled || option?.quantity === 0 ? true : false}
                checked={activeFilters.includes(option.name)}
                class="checkbox-custom focus:ring-imperial-red text-imperial-red h-base w-base cursor-pointer rounded border-slate-200 focus:outline-none focus:ring-1 focus:ring-opacity-50 disabled:cursor-not-allowed disabled:opacity-50"
              />
              <span class={`text-default select-none`}
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
                class="checkbox-custom focus:ring-imperial-red text-imperial-red h-base w-base cursor-pointer rounded border-slate-200 focus:outline-none focus:ring-1 focus:ring-opacity-50 disabled:cursor-not-allowed disabled:opacity-50"
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
    width: 0.375rem;
    height: 0.625rem;
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
