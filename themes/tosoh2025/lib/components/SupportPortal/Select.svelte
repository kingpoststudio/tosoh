<script lang="ts">
  import { fade } from 'svelte/transition';

  let { value = $bindable(), options, label, name, disabled } = $props();
  let selectElement: HTMLSelectElement | null = $state(null);

  let activeOptions = $derived(options);

  const handleClear = () => {
    if (selectElement) {
      selectElement.value = 'none';
      selectElement.dispatchEvent(new Event('change', { bubbles: true }));
    }
  };
</script>

<div class="mt-md gap-sm flex flex-col">
  <div class=" gap-sm flex flex-col">
    <div class="gap-sm flex items-center">
      <label for={name} class=" text-xl font-black">{label}</label>
      {#if value !== 'none' && value}
        <button
          type="button"
          {disabled}
          transition:fade={{ duration: 200 }}
          class="fill-imperial-red plain h-4 w-4 cursor-pointer"
          onclick={handleClear}
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
    <div class="relative">
      <select
        id={name}
        {name}
        disabled={disabled || activeOptions?.length === 0}
        class="p-sm focus:ring-imperial-red peer w-full cursor-pointer appearance-none rounded-lg border border-slate-200 focus:outline-none focus:ring-1 focus:ring-opacity-50 disabled:cursor-not-allowed disabled:opacity-50"
        bind:value
        bind:this={selectElement}
      >
        <option value="none" selected disabled hidden class="text-imperial-red">Select</option>
        {#each activeOptions as option}
          <option value={option.value} class="text-default">{option.label}</option>
        {/each}
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

<style>
  select {
    &,
    &::picker(select) {
      appearance: base-select;
    }
    transition: border-color 0.2s ease-in-out;

    &:open {
      border-color: var(--color-imperial-red);
      border-width: 1px;
    }

    &::picker(select) {
      border-color: var(--color-imperial-red);
      border-width: 1px;
      max-height: 16rem;
    }

    &::picker-icon {
      display: none !important;
    }

    &:open::picker(select) {
      margin-top: 0.5rem;
      margin-bottom: 0.5rem;
      border-radius: 0.5rem;
    }
  }
  option {
    padding: 0.5rem;

    &:hover {
      background-color: var(--color-red-50);
    }
  }

  option::checkmark {
    display: none;
  }
</style>
