export type triggerType = 'submit' | 'change';

export interface FormManagerOptions {
  onSubmit?: (e: Event) => void;
  onChange?: (e: Event) => void;
  onReset?: (e?: Event) => void;
  triggerType?: triggerType;
  updateUrl?: boolean;
}

export interface FormManagerInstance {
  resetAction: () => void;
  destroy: () => void;
  setFormValuesToParams: (reset?: boolean, input?: string) => void;
}

export const updateFormEvent = (id: string) =>
  window.dispatchEvent(
    new CustomEvent('TosohFormValuesChanged', {
      detail: { id: id },
      bubbles: true,
    })
  );

export const resetFormEvent = (id: string) =>
  window.dispatchEvent(
    new CustomEvent('TosohFormReset', {
      detail: { id: id },
      bubbles: true,
    })
  );

export const getFormParamsFromUrl = (url: URL = new URL(window.location.href)) => {
  return url.searchParams;
};

export const updateUrlWithFormData = (
  formData: FormData,
  form: HTMLFormElement,
  options: { reset?: boolean; input?: string } = {}
) => {
  const { reset, input } = options;
  const url = new URL(window.location.href);

  const params = Array.from(form.elements).reduce(
    (acc: any, el: any) => {
      const elName = el.getAttribute('name') as string;
      if (!elName) return acc;

      if (elName && !acc[elName]) acc[elName] = Array.from(formData.getAll(elName)) as string[];
      acc[elName] = acc[elName]?.filter((value: string) => value) || [];

      return acc;
    },
    {} as Record<string, string[]>
  );

  if (input) {
    url.searchParams.delete(input);
  } else {
    if (reset) form.reset();

    Object.keys(params).forEach((key) => {
      if (reset || !params[key].length) url.searchParams.delete(key);
      else if (params[key].length === 1 && !params[key][0]) url.searchParams.delete(key);
      else if (params[key].length === 1) url.searchParams.set(key, params[key][0]);
      else url.searchParams.set(key, params[key].join(','));
    });
  }

  window.history.pushState({}, '', url.toString().replace(/%2C/g, ','));
  return url;
};

export const resetForm = (form: HTMLFormElement) => {
  Array.from(form.elements).forEach((el) => {
    const elName = el.getAttribute('name') as string;

    if (!elName) return;

    if (el.tagName === 'SELECT') {
      const select = el as HTMLSelectElement;
      select.value = 'none';
    } else if (
      el.tagName === 'INPUT' &&
      ((el as HTMLInputElement).type === 'checkbox' || (el as HTMLInputElement).type === 'radio')
    ) {
      const input = el as HTMLInputElement;
      input.checked = false;
    } else if (el.tagName === 'INPUT' && (el as HTMLInputElement).type === 'number') {
      const input = el as HTMLInputElement;
      input.value = '';
    } else if (el.tagName === 'INPUT') {
      const input = el as HTMLInputElement;
      input.value = '';
    }
  });
};

export const populateFormFromUrl = (form: HTMLFormElement, suppressEvents: boolean = false) => {
  const params = new URL(window.location.href).searchParams;

  Array.from(form.elements).forEach((el) => {
    const elName = el.getAttribute('name') as string;

    if (!elName) return;

    const values = params.getAll(elName).flatMap((v) => v.split(','));

    if (values.length) {
      if (el.tagName === 'SELECT') {
        const select = el as HTMLSelectElement;
        const matchingValue = values.find((v) => v);

        if (matchingValue && select?.value !== matchingValue) {
          select.value = matchingValue;
          if (!suppressEvents) {
            select.dispatchEvent(new Event('change', { bubbles: true }));
          }
        }
      } else if (
        el.tagName === 'INPUT' &&
        ((el as HTMLInputElement).type === 'checkbox' || (el as HTMLInputElement).type === 'radio')
      ) {
        const input = el as HTMLInputElement;
        const shouldBeChecked = values.includes(input.value);
        if (input.checked !== shouldBeChecked) {
          input.checked = shouldBeChecked;
          if (!suppressEvents) {
            input.dispatchEvent(new Event('change', { bubbles: true }));
          }
        }
      } else if (el.tagName === 'INPUT' && (el as HTMLInputElement).type === 'number') {
        const input = el as HTMLInputElement;
        const matchingValue = values.find((v) => v);
        if (matchingValue && input.value !== matchingValue) {
          input.value = matchingValue;
        }
      } else if (el.tagName === 'INPUT') {
        const input = el as HTMLInputElement;
        const matchingValue = values.find((v) => v);
        if (matchingValue && input.value !== matchingValue) {
          input.value = matchingValue;
        }
      }
    }
  });
};

export function createFormManager(
  form: HTMLFormElement,
  options: FormManagerOptions = {}
): FormManagerInstance {
  const { onSubmit, onReset, onChange, triggerType = 'submit', updateUrl = true } = options;

  const setFormValuesToParams = (reset?: boolean, input?: string) => {
    const formData = new FormData(form);
    if (updateUrl) {
      updateUrlWithFormData(formData, form, { reset, input });
    }

    if (reset && onReset) {
      onReset();
    }
  };

  let debounceTimeouts: Map<Element, Timer> = new Map();
  let eventListeners: Map<Element, { type: string; handler: EventListener }[]> = new Map();

  const debounceInput = (element: Element, delay: number, callback: () => void) => {
    if (debounceTimeouts.has(element)) {
      clearTimeout(debounceTimeouts.get(element));
    }

    const timeoutId = setTimeout(() => {
      callback();
      debounceTimeouts.delete(element);
    }, delay);

    debounceTimeouts.set(element, timeoutId);
  };

  const addEventListenerWithTracking = (element: Element, type: string, handler: EventListener) => {
    element.addEventListener(type, handler);
    if (!eventListeners.has(element)) {
      eventListeners.set(element, []);
    }
    eventListeners.get(element)?.push({ type, handler });
  };

  const setupForm = () => {
    if (triggerType === 'change') {
      Array.from(form.elements).forEach((element) => {
        if (element.tagName === 'SELECT') {
          (element as HTMLSelectElement).onchange = (e: Event) => {
            setFormValuesToParams();
            if (onChange) onChange(e);
          };
        }

        if (element.tagName === 'INPUT' && (element as HTMLInputElement).type !== 'checkbox') {
          const inputHandler = (e: Event) => {
            e.stopPropagation();
            const debounceAttr = element.getAttribute('data-debounce');
            const hasDebounce = debounceAttr !== null && !isNaN(parseInt(debounceAttr, 10));
            const debounceDelay = hasDebounce ? parseInt(debounceAttr, 10) : 0;

            if (hasDebounce) {
              debounceInput(element, debounceDelay, () => {
                setFormValuesToParams();
                if (onChange) onChange(e);
              });
            } else {
              setFormValuesToParams();
              if (onChange) onChange(e);
            }
          };
          addEventListenerWithTracking(element, 'input', inputHandler);
        }

        if (
          element.tagName === 'INPUT' &&
          ((element as HTMLInputElement).type === 'checkbox' ||
            (element as HTMLInputElement).type === 'radio')
        ) {
          const changeHandler = (e: Event) => {
            setFormValuesToParams();
            if (onChange) onChange(e);
          };
          addEventListenerWithTracking(element, 'change', changeHandler);
        }
      });
    }

    if (triggerType === 'submit') {
      form.onsubmit = (e) => {
        e.preventDefault();
        setFormValuesToParams();

        if (onSubmit) {
          onSubmit(e);
        }
      };
    }
  };

  const setupResetElements = () => {
    const resetButtons = form.querySelectorAll('[data-type="reset"]');

    resetButtons.forEach((element) => {
      const button = element as HTMLButtonElement;
      button.onclick = (e: Event) => {
        e.preventDefault();
        resetAction();
      };
    });
  };

  const selectActiveFormValues = () => {
    populateFormFromUrl(form, true);
  };

  const resetAction = () => {
    setFormValuesToParams(true);
  };

  const destroy = () => {
    // Clean up event listeners
    form.onsubmit = null;

    // Clean up tracked event listeners
    eventListeners.forEach((listeners, element) => {
      listeners.forEach(({ type, handler }) => {
        element.removeEventListener(type, handler);
      });
    });
    eventListeners.clear();

    // Clean up select element onchange handlers
    Array.from(form.elements).forEach((element) => {
      if (element.tagName === 'SELECT') {
        (element as HTMLSelectElement).onchange = null;
      }
    });

    const resetButtons = form.querySelectorAll('[data-type="reset"]');
    resetButtons.forEach((button) => {
      (button as HTMLButtonElement).onclick = null;
    });

    // Clear debounce timeouts
    debounceTimeouts.forEach((timeoutId) => clearTimeout(timeoutId));
    debounceTimeouts.clear();
  };

  selectActiveFormValues();
  setupResetElements();
  setupForm();

  return {
    resetAction,
    destroy,
    setFormValuesToParams,
  };
}

// Example usage:
//
// // Full form manager
// const manager = createFormManager(formElement, {
//   onSubmit: () => console.log('submitted!'),
//   onReset: () => console.log('reset!')
// });
//
// // Or use individual utilities
// const formData = new FormData(formElement);
// updateUrlWithFormData(formData, formElement, { reset: true });
// populateFormFromUrl(formElement);
