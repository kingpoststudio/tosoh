<script lang="ts">
  import type { Snippet } from 'svelte';
  import { onDestroy } from 'svelte';
  import { on } from 'svelte/events';

  import {
    createFormManager,
    populateFormFromUrl,
    resetForm,
    type FormManagerInstance,
    type triggerType,
  } from '../../utils/formManager';

  let {
    children,
    customClasses,
    excludeFromObserver = false,
    formId,
    onChange,
    onClickOutside,
    onReset,
    onSubmit,
    trigger,
    updateUrl = true,
  }: {
    children: Snippet;
    customClasses?: string;
    excludeFromObserver?: boolean;
    formId: string;
    onChange?: (e: Event) => void;
    onClickOutside?: (e?: Event) => void;
    onReset?: (e: Event) => void;
    onSubmit?: (e: Event) => void;
    trigger: triggerType;
    updateUrl?: boolean;
  } = $props();

  let formElement: HTMLFormElement | null = $state(null);
  let formManager: FormManagerInstance | null = $state(null);
  let debounceTimeout: Timer | null = null;

  const initiateFormManager = () => {
    if (formElement && !formManager) {
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

  const clickOutside = on(document, 'click', (event: MouseEvent) => {
    if (onClickOutside) {
      if (!(event.target instanceof HTMLElement)) return;

      if (formElement && !formElement?.contains(event.target)) {
        onClickOutside();
      }
    }
  });

  const onResetForm = on(window, 'TosohFormReset', (e: Event) => {
    const { detail } = e as CustomEvent;
    if (detail?.id === formId) {
      if (formElement) {
        resetForm(formElement);
      }
    }
  });

  const onChangeValues = on(window, 'TosohFormValuesChanged', (e: Event) => {
    const { detail } = e as CustomEvent;

    if (detail?.id === formId) {
      if (formManager && formElement) {
        populateFormFromUrl(formElement, true);
      }
    }
  });

  $effect(() => {
    if (formElement) {
      if (formElement.elements.length > 0 && !formManager) {
        debouncedInitiate();
      }
      let observer: MutationObserver | null = null;
      if (!excludeFromObserver) {
        observer = new MutationObserver(() => {
          debouncedInitiate();
        });

        observer.observe(formElement, {
          childList: true,
          subtree: true,
        });
      }
      return () => {
        if (!excludeFromObserver) {
          if (observer) {
            observer.disconnect();
          }
        }
        if (debounceTimeout) {
          clearTimeout(debounceTimeout);
        }
      };
    }
  });

  onDestroy(() => {
    onChangeValues();
    onResetForm();
    clickOutside();

    if (formManager) {
      formManager.destroy();
    }
  });
</script>

<form
  onsubmit={(e) => {
    e.preventDefault();
  }}
  bind:this={formElement}
  class={customClasses}
>
  {@render children()}
</form>
