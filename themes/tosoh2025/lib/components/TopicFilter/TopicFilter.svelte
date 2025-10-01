<script lang="ts">
  import Select from '../Select/Select.svelte';
  import Checkbox from '../CheckboxGroup/CheckboxGroup.svelte';
  import Input from '../Input/Input.svelte';
  import type { TopicFilters } from '../../../types/fields';

  let {
    filter,
    options,
    name,
    disabled,
    isLoading,
    placeholder,
    labelPosition,
    displayLabel,
    customClasses,
  }: {
    filter: TopicFilters['filters'][number];
    options: any[];
    name: string;
    disabled: boolean;
    isLoading: boolean;
    placeholder?: string;
    labelPosition?: 'top' | 'left';
    displayLabel?: boolean;
    customClasses?: string;
  } = $props();
</script>

{#if filter?.type}
  <div class={customClasses || 'mt-base'}>
    {#if filter?.type === 'dropdown'}
      <Select {options} {name} {disabled} {placeholder} {labelPosition} {displayLabel} />
    {/if}
    {#if filter?.type === 'checkbox'}
      <Checkbox {options} {name} {disabled} {isLoading} {labelPosition} {displayLabel} />
    {/if}
    {#if filter?.type === 'range-pm'}
      <Input
        {name}
        type="number"
        placeholder={`${filter?.min} - ${filter?.max} ` || ''}
        min={filter?.min || 0}
        max={filter?.max || 10}
        step={0.01}
        {disabled}
        {isLoading}
        label={filter?.filter_label}
      />
    {/if}
  </div>
{/if}
