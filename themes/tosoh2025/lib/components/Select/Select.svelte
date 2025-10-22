<script lang="ts">
  import { fade } from 'svelte/transition';
  import { setupFilterTitle } from '../../utils/utils';

  let {
    customClearFilter,
    customDisabledOption,
    disabled,
    displayLabel = true,
    label,
    labelPosition = 'top',
    name,
    options,
    placeholder,
    value = $bindable(),
  }: {
    customClearFilter?: () => void;
    customDisabledOption?: (option: any) => boolean;
    disabled?: boolean;
    displayLabel?: boolean;
    label?: string;
    labelPosition?: 'top' | 'left';
    name: string;
    options: any[];
    placeholder?: string;
    value?: unknown;
  } = $props();

  const activeFilter = new URLSearchParams(window.location.search)?.get(name);
</script>

<div class="gap-sm flex h-full flex-col">
  <div class={`gap-sm flex h-full ${labelPosition === 'top' ? 'flex-col' : 'flex-row'}`}>
    {#if displayLabel}
      <div class="gap-sm flex items-center">
        {#if displayLabel}
          <label for={name} class="text-lg font-semibold"
            >{label ? label : setupFilterTitle(name)}</label
          >
        {/if}
        {#if customClearFilter && activeFilter}
          <button
            type="button"
            {disabled}
            transition:fade={{ duration: 200 }}
            class="fill-imperial-red plain h-4 w-4 cursor-pointer"
            onclick={customClearFilter}
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
    {/if}
    <div class="relative h-full w-full">
      <select
        id={name}
        {name}
        disabled={disabled || options?.length === 0 || !options}
        class="p-sm focus:ring-imperial-red peer h-full w-full cursor-pointer appearance-none rounded-lg border border-slate-200 focus:outline-none focus:ring-1 focus:ring-opacity-50 disabled:cursor-not-allowed disabled:opacity-50"
        bind:value
      >
        <option value="none" selected disabled hidden class="text-imperial-red"
          >{placeholder ? placeholder : 'Select'}</option
        >

        {#if (options?.length === 0 || !options) && activeFilter}
          <option value={activeFilter} selected disabled hidden class="text-imperial-red"
            >{activeFilter}</option
          >
        {/if}

        {#if options?.length > 0}
          {#each options as option}
            <option
              value={option.name}
              class="text-default disabled:cursor-not-allowed disabled:opacity-50"
              selected={option.name === activeFilter}
              disabled={customDisabledOption
                ? customDisabledOption(option)
                : option?.quantity === 0
                  ? true
                  : false}
            >
              {option.label || option.name}
              {option.quantity !== undefined ? ` (${option?.quantity})` : ''}
            </option>
          {/each}
        {/if}
      </select>
      <div
        class="pointer-events-none absolute inset-y-0 right-3 flex items-center transition-transform duration-200 peer-open:rotate-180"
      >
        <svg
          class="text-imperial-red h-4 w-4"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="4" d="M19 9l-7 7-7-7"
          ></path>
        </svg>
      </div>
    </div>
  </div>
</div>
