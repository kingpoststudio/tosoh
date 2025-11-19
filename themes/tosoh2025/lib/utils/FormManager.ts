export type triggerType = 'submit' | 'change';

export interface FormManagerOptions {
  onSubmit?: (event: Event) => void;
  onChange?: (event: Event) => void;
  onReset?: (event?: Event) => void;
  triggerType?: triggerType;
  updateUrl?: boolean;
}

export interface FormManagerInstance {
  resetAction: () => void;
  destroy: () => void;
  setFormValuesToParams: (reset?: boolean, input?: string) => void;
}

// Constants
const FORM_CONSTANTS = {
  NO_SELECTION_VALUE: 'none',
  ENCODED_COMMA: '%2C',
  EVENTS: {
    VALUES_CHANGED: 'TosohFormValuesChanged',
    RESET: 'TosohFormReset',
  },
} as const;

// Type guards for form elements
const isSelectElement = (element: Element): element is HTMLSelectElement =>
  element.tagName === 'SELECT';

const isInputElement = (element: Element): element is HTMLInputElement =>
  element.tagName === 'INPUT';

const isCheckboxOrRadio = (element: Element): element is HTMLInputElement =>
  isInputElement(element) && (element.type === 'checkbox' || element.type === 'radio');

const isNumberInput = (element: Element): element is HTMLInputElement =>
  isInputElement(element) && element.type === 'number';

// Event dispatchers
export const updateFormEvent = (id: string) =>
  window.dispatchEvent(
    new CustomEvent(FORM_CONSTANTS.EVENTS.VALUES_CHANGED, {
      detail: { id },
      bubbles: true,
    })
  );

export const resetFormEvent = (id: string) =>
  window.dispatchEvent(
    new CustomEvent(FORM_CONSTANTS.EVENTS.RESET, {
      detail: { id },
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

  const formParams = Array.from(form.elements).reduce(
    (parametersMap: Record<string, string[]>, element: Element) => {
      const elementName = element.getAttribute('name');
      if (!elementName) return parametersMap;

      if (!parametersMap[elementName]) {
        const values = Array.from(formData.getAll(elementName)) as string[];
        // Filter out empty values and 'none' (which represents "All" or no selection)
        parametersMap[elementName] = values.filter(
          (value: string) => value && value !== FORM_CONSTANTS.NO_SELECTION_VALUE
        );
      }

      return parametersMap;
    },
    {} as Record<string, string[]>
  );

  if (input) {
    url.searchParams.delete(input);
  } else {
    if (reset) form.reset();

    Object.keys(formParams).forEach((key) => {
      if (reset || !formParams[key].length) {
        url.searchParams.delete(key);
      } else if (formParams[key].length === 1 && !formParams[key][0]) {
        url.searchParams.delete(key);
      } else if (formParams[key].length === 1) {
        url.searchParams.set(key, formParams[key][0]);
      } else {
        url.searchParams.set(key, formParams[key].join(','));
      }
    });
  }

  window.history.pushState({}, '', url.toString().replace(FORM_CONSTANTS.ENCODED_COMMA, ','));
  return url;
};

const resetFormElement = (element: Element): void => {
  const elementName = element.getAttribute('name');
  if (!elementName) return;

  if (isSelectElement(element)) {
    element.value = FORM_CONSTANTS.NO_SELECTION_VALUE;
  } else if (isCheckboxOrRadio(element)) {
    element.checked = false;
  } else if (isNumberInput(element)) {
    element.value = '';
  } else if (isInputElement(element)) {
    element.value = '';
  }
};

export const resetForm = (form: HTMLFormElement): void => {
  Array.from(form.elements).forEach(resetFormElement);
};

const populateFormElement = (
  element: Element,
  params: URLSearchParams,
  suppressEvents: boolean
): void => {
  const elementName = element.getAttribute('name');
  if (!elementName) return;

  const values = params.getAll(elementName).flatMap((value) => value.split(','));
  if (!values.length) return;

  if (isSelectElement(element)) {
    const matchingValue = values.find((value) => value);
    if (matchingValue && element.value !== matchingValue) {
      element.value = matchingValue;
      if (!suppressEvents) {
        element.dispatchEvent(new Event('change', { bubbles: true }));
      }
    }
  } else if (isCheckboxOrRadio(element)) {
    const shouldBeChecked = values.includes(element.value);
    if (element.checked !== shouldBeChecked) {
      element.checked = shouldBeChecked;
      if (!suppressEvents) {
        element.dispatchEvent(new Event('change', { bubbles: true }));
      }
    }
  } else if (isNumberInput(element)) {
    const matchingValue = values.find((value) => value);
    if (matchingValue && element.value !== matchingValue) {
      element.value = matchingValue;
    }
  } else if (isInputElement(element)) {
    const matchingValue = values.find((value) => value);
    if (matchingValue && element.value !== matchingValue) {
      element.value = matchingValue;
    }
  }
};

export const populateFormFromUrl = (
  form: HTMLFormElement,
  suppressEvents: boolean = false
): void => {
  const params = new URL(window.location.href).searchParams;
  Array.from(form.elements).forEach((element) =>
    populateFormElement(element, params, suppressEvents)
  );
};

// Debounce utility
interface DebounceManager {
  debounce: (element: Element, delay: number, callback: () => void) => void;
  clear: () => void;
}

const createDebounceManager = (): DebounceManager => {
  const timeouts: Map<Element, Timer> = new Map();

  return {
    debounce: (element: Element, delay: number, callback: () => void) => {
      if (timeouts.has(element)) {
        clearTimeout(timeouts.get(element));
      }

      const timeoutId = setTimeout(() => {
        callback();
        timeouts.delete(element);
      }, delay);

      timeouts.set(element, timeoutId);
    },
    clear: () => {
      timeouts.forEach((timeoutId) => clearTimeout(timeoutId));
      timeouts.clear();
    },
  };
};

// Event tracking utility
interface EventTracker {
  track: (element: Element, type: string, handler: EventListener) => void;
  cleanup: () => void;
}

const createEventTracker = (): EventTracker => {
  const listeners: Map<Element, { type: string; handler: EventListener }[]> = new Map();

  return {
    track: (element: Element, type: string, handler: EventListener) => {
      element.addEventListener(type, handler);
      if (!listeners.has(element)) {
        listeners.set(element, []);
      }
      listeners.get(element)?.push({ type, handler });
    },
    cleanup: () => {
      listeners.forEach((elementListeners, element) => {
        elementListeners.forEach(({ type, handler }) => {
          element.removeEventListener(type, handler);
        });
      });
      listeners.clear();
    },
  };
};

// Form element event handlers
const getDebounceDelay = (element: Element): number => {
  const debounceAttr = element.getAttribute('data-debounce');
  const hasDebounce = debounceAttr !== null && !isNaN(parseInt(debounceAttr, 10));
  return hasDebounce ? parseInt(debounceAttr, 10) : 0;
};

const setupSelectListener = (
  element: HTMLSelectElement,
  onChange: ((event: Event) => void) | undefined
): void => {
  if (onChange) {
    element.onchange = (event: Event) => onChange(event);
  }
};

const setupInputListener = (
  element: HTMLInputElement,
  onChange: ((event: Event) => void) | undefined,
  eventTracker: EventTracker,
  debounceManager: DebounceManager
): void => {
  if (!onChange) return;

  const inputHandler = (event: Event) => {
    event.stopPropagation();
    const debounceDelay = getDebounceDelay(element);

    if (debounceDelay > 0) {
      debounceManager.debounce(element, debounceDelay, () => onChange(event));
    } else {
      onChange(event);
    }
  };

  eventTracker.track(element, 'input', inputHandler);
};

const setupCheckboxRadioListener = (
  element: HTMLInputElement,
  onChange: ((event: Event) => void) | undefined,
  eventTracker: EventTracker
): void => {
  if (!onChange) return;

  const changeHandler = (event: Event) => onChange(event);
  eventTracker.track(element, 'change', changeHandler);
};

export function createFormManager(
  form: HTMLFormElement,
  options: FormManagerOptions = {}
): FormManagerInstance {
  const { onSubmit, onReset, onChange, triggerType = 'submit', updateUrl = true } = options;

  const debounceManager = createDebounceManager();
  const eventTracker = createEventTracker();

  const setupChangeListeners = (): void => {
    Array.from(form.elements).forEach((element) => {
      if (isSelectElement(element)) {
        setupSelectListener(element, onChange);
      } else if (isCheckboxOrRadio(element)) {
        setupCheckboxRadioListener(element, onChange, eventTracker);
      } else if (isInputElement(element)) {
        setupInputListener(element, onChange, eventTracker, debounceManager);
      }
    });
  };

  const setupSubmitListener = (): void => {
    form.onsubmit = (event) => {
      event.preventDefault();
      if (onSubmit) {
        onSubmit(event);
      }
    };
  };

  const setupForm = (): void => {
    if (triggerType === 'change') {
      setupChangeListeners();
    }

    if (triggerType === 'submit') {
      setupSubmitListener();
    }
  };

  const setupResetElements = (): void => {
    const resetButtons = form.querySelectorAll('[data-type="reset"]');

    resetButtons.forEach((element) => {
      const button = element as HTMLButtonElement;
      button.onclick = (event: Event) => {
        event.preventDefault();
        resetAction();
      };
    });
  };

  const selectActiveFormValues = (): void => {
    populateFormFromUrl(form, true);
  };

  const resetAction = (): void => {
    if (onReset) {
      onReset();
    }
  };

  const cleanupSelectElements = (): void => {
    Array.from(form.elements).forEach((element) => {
      if (isSelectElement(element)) {
        element.onchange = null;
      }
    });
  };

  const cleanupResetButtons = (): void => {
    const resetButtons = form.querySelectorAll('[data-type="reset"]');
    resetButtons.forEach((button) => {
      (button as HTMLButtonElement).onclick = null;
    });
  };

  const destroy = (): void => {
    form.onsubmit = null;
    eventTracker.cleanup();
    cleanupSelectElements();
    cleanupResetButtons();
    debounceManager.clear();
  };

  const setFormValuesToParams = (reset?: boolean, input?: string): void => {
    if (updateUrl) {
      const formData = new FormData(form);
      updateUrlWithFormData(formData, form, { reset, input });
    }
  };

  // Initialize
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
