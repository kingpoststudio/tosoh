<script lang="ts">
  import type { Snippet } from 'svelte';
  import { onDestroy } from 'svelte';
  import { on } from 'svelte/events';

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
    onClickOutside,
    children,
    customClasses,
  }: {
    trigger: triggerType;
    onSubmit?: (e: Event) => void;
    onChange?: (e: Event) => void;
    onReset?: (e: Event) => void;
    onClickOutside?: (e?: Event) => void;
    children: Snippet;
    customClasses?: string;
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
        onReset: (e) => {
          if (formElement && onReset) {
            onReset(e as Event);
          }
        },
        triggerType: trigger,
      });
    }
  };

  $effect(() => {
    if (formElement && !formManager && formElement.elements.length > 0) {
      initiateFormManager();
    }
  });

  const clickOutside = on(document, 'click', (event: MouseEvent) => {
    if (onClickOutside) {
      if (!(event.target instanceof HTMLElement)) return;

      if (formElement && !formElement?.contains(event.target)) {
        onClickOutside();
      }
    }
  });

  onDestroy(() => {
    if (formManager) {
      formManager.destroy();
    }
    clickOutside();
  });
</script>

<form bind:this={formElement} class={customClasses}>
  {@render children()}
</form>
