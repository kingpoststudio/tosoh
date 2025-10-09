<script lang="ts">
  import { setupFilterTitle } from '../../utils/utils';

  let {
    disabled,
    displayLabel = true,
    isLoading,
    label,
    labelPosition = 'top',
    max,
    min,
    name,
    placeholder,
    step,
    type = 'text',
  }: {
    disabled: boolean;
    displayLabel?: boolean;
    isLoading?: boolean;
    label?: string;
    labelPosition?: 'top' | 'left';
    max?: number;
    min?: number;
    name: string;
    placeholder?: string;
    step?: number;
    type: string;
  } = $props();

  const urlParams = new URLSearchParams(window.location.search);
  const activeFilter = urlParams.get(name);
</script>

<div class="gap-sm flex flex-col">
  <div class={`gap-sm flex ${labelPosition === 'top' ? 'flex-col' : 'flex-row'}`}>
    <div class="gap-sm flex items-center">
      {#if displayLabel}
        <div class="text-lg font-semibold">{label || setupFilterTitle(name)}</div>
      {/if}
    </div>
    <div
      class={` focus-within:border-imperial-red border-border relative w-full rounded-lg border`}
    >
      <div class="gap-sm flex flex-col">
        <input
          {type}
          data-debounce="600"
          {name}
          defaultValue={activeFilter ? activeFilter : ''}
          {min}
          {max}
          {step}
          {placeholder}
          disabled={disabled || isLoading}
          class=" p-base placeholder:text-default focus:outline-imperial-red h-full w-full rounded-md pr-8 disabled:cursor-not-allowed disabled:opacity-50"
        />
      </div>
    </div>
  </div>
</div>

<style>
  /* Use :global() to ensure webkit pseudo-elements work properly */
  :global(input[type='number']::-webkit-outer-spin-button),
  :global(input[type='number']::-webkit-inner-spin-button) {
    opacity: 1;
    height: 22px;
    width: 18px;
    cursor: pointer;
    -webkit-appearance: none;
    appearance: none;
    background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 20 24'%3E%3Cpath d='M4 8l6-5 6 5H4z' fill='%23ed1a3b'/%3E%3Cpath d='M4 16l6 5 6-5H4z' fill='%23ed1a3b'/%3E%3C/svg%3E");
    background-size: 18px 22px;
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
    right: var(--spacing-xs);

    background-repeat: no-repeat;
  }

  /* For Firefox - enable number input controls */
  :global(input[type='number']) {
    appearance: textfield;
    -moz-appearance: textfield;
  }

  /* Firefox specific styles */
  @supports (-moz-appearance: textfield) {
    :global(input[type='number']) {
      appearance: number-input;
      -moz-appearance: number-input;
    }
  }
</style>
