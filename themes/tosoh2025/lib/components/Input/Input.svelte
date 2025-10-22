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
