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
    updateUrl = true,
  }: {
    trigger: triggerType;
    onSubmit?: (e: Event) => void;
    onChange?: (e: Event) => void;
    onReset?: (e: Event) => void;
    onClickOutside?: (e?: Event) => void;
    children: Snippet;
    customClasses?: string;
    updateUrl?: boolean;
  } = $props();

  let formElement: HTMLFormElement | null = $state(null);
  let formManager: FormManagerInstance | null = $state(null);

  const initiateFormManager = () => {
    if (formElement && !formManager) {
      // Small delay to ensure DOM is fully updated
      setTimeout(() => {
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
            updateUrl: updateUrl,
          });
        }
      }, 0);
    }
  };

  let debounceTimeout: Timer | null = null;

  const debouncedInitiate = () => {
    if (debounceTimeout) {
      clearTimeout(debounceTimeout);
    }
    debounceTimeout = setTimeout(() => {
      if (formElement && formElement.elements.length > 0) {
        if (formManager) {
          formManager.destroy();
          formManager = null;
        }
        initiateFormManager();
      }
    }, 100);
  };

  $effect(() => {
    if (formElement) {
      if (formElement.elements.length > 0 && !formManager) {
        debouncedInitiate();
      }

      // Use MutationObserver to watch for DOM changes
      const observer = new MutationObserver(() => {
        debouncedInitiate();
      });

      observer.observe(formElement, {
        childList: true,
        subtree: true,
      });

      return () => {
        observer.disconnect();
        if (debounceTimeout) {
          clearTimeout(debounceTimeout);
        }
      };
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
