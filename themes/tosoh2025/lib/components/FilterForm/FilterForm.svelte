<script lang="ts">
  import type { Snippet } from 'svelte';
  import { onDestroy } from 'svelte';

  import {
    createFormManager,
    type FormManagerInstance,
    type triggerType,
  } from '../../utils/formManager';

  let {
    trigger,
    onChange,
    onSubmit,
    onReset,
    children,
  }: {
    trigger: triggerType;
    onSubmit?: (e: Event) => void;
    onChange?: (e: Event) => void;
    onReset?: () => void;
    children: Snippet;
  } = $props();

  let formElement: HTMLFormElement | null = $state(null);
  let formManager: FormManagerInstance | null = $state(null);

  const initiateFormManager = () => {
    if (formElement && !formManager) {
      formManager = createFormManager(formElement, {
        onChange: (e) => {
          if (formElement && onChange) {
            onChange(e);
          }
        },
        onSubmit(e) {
          if (formElement && onSubmit) {
            onSubmit(e);
          }
        },
        onReset: () => {
          if (formElement && onReset) {
            onReset();
          }
        },
        triggerType: trigger,
      });
    }
  };

  $effect(() => {
    if (formElement && !formManager) {
      initiateFormManager();
    }
  });

  onDestroy(() => {
    if (formManager) {
      formManager.destroy();
    }
  });
</script>

<form bind:this={formElement}>
  {@render children()}
</form>
