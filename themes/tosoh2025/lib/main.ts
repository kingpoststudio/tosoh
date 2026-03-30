// Framework imports
import EmblaCarousel, { type EmblaCarouselType } from 'embla-carousel';

// Styles
import './styles/main.css';

// Components
import './components/Accordion/Accordion.svelte';
import './components/ActiveProductImage/ActiveProductImage.svelte';
import './components/CCTDetailsFilters/CCTDetailsFilters.svelte';
import './components/CCTFilters/CCTFilters.svelte';
import './components/Header/Header.svelte';
import './components/InView/InView.svelte';
import './components/Modal/Modal.svelte';
import './components/RevealGroup/RevealGroup.svelte';
import './components/ScrollX/ScrollX.svelte';
import './components/SubHeader/SubHeader.svelte';
import './components/TabGroup/TabGroup.svelte';

// Modules
import './modules/HemoglobinPortal/HemoglobinPortal.svelte';
import './modules/HemoglobinVariantsLibrary/HemoglobinVariantsLibrary.svelte';
import './modules/KioskDocuments/KioskDocuments.svelte';
import './modules/SupportPortal/SupportPortal.svelte';
import './modules/SupportPortalDocs/SupportPortalDocs.svelte';
import './modules/WebinarListing/WebinarListing.svelte';

// Constants
const CAROUSEL_SELECTORS = {
  EMBLA: '.embla',
  PREV_BUTTON: '.embla__prev',
  NEXT_BUTTON: '.embla__next',
  CONTAINER: '.max-w-max-page, [data-carousel-container]',
} as const;

const CAROUSEL_OPTIONS = {
  loop: false,
  dragFree: false,
  containScroll: 'trimSnaps' as const,
} as const;


/**
 * Sets the disabled state of a button based on a condition
 */
function setButtonState(button: Element | null, isEnabled: boolean) {
  if (!button) return;

  if (isEnabled) {
    button.removeAttribute('disabled');
  } else {
    button.setAttribute('disabled', '');
  }
}

/**
 * Controls carousel navigation button states based on scroll position
 */
function updateCarouselButtons(
  emblaEvent: EmblaCarouselType,
  prevButton: Element | null,
  nextButton: Element | null
) {
  const canScrollNext = emblaEvent?.canScrollNext();
  const canScrollPrev = emblaEvent?.canScrollPrev();

  setButtonState(nextButton, canScrollNext);
  setButtonState(prevButton, canScrollPrev);
}

/**
 * Attaches event listeners to carousel navigation buttons
 */
function attachCarouselButtonEvents(
  embla: EmblaCarouselType,
  prevButton: Element | null,
  nextButton: Element | null
) {
  prevButton?.addEventListener('click', () => embla.scrollPrev(), false);
  nextButton?.addEventListener('click', () => embla.scrollNext(), false);
}

/**
 * Attaches carousel state update events
 */
function attachCarouselStateEvents(
  embla: EmblaCarouselType,
  prevButton: Element | null,
  nextButton: Element | null
) {
  const updateButtons = () => updateCarouselButtons(embla, prevButton, nextButton);

  embla.on('init', updateButtons);
  embla.on('scroll', updateButtons);
  embla.on('settle', updateButtons);
  embla.on('slidesInView', updateButtons);
}

/**
 * Initializes a single carousel instance
 */
function initializeCarouselInstance(emblaNode: HTMLElement) {
  const parentContainer = emblaNode.closest(CAROUSEL_SELECTORS.CONTAINER);

  if (!parentContainer) {
    console.warn('Carousel parent container not found for', emblaNode);
    return;
  }

  const prevButton = parentContainer.querySelector(CAROUSEL_SELECTORS.PREV_BUTTON);
  const nextButton = parentContainer.querySelector(CAROUSEL_SELECTORS.NEXT_BUTTON);

  const embla = EmblaCarousel(emblaNode, CAROUSEL_OPTIONS);

  attachCarouselButtonEvents(embla, prevButton, nextButton);
  attachCarouselStateEvents(embla, prevButton, nextButton);
}

/**
 * Initializes all carousel instances on the page
 */
function initializeCarousels() {
  const emblaNodes = document.querySelectorAll(CAROUSEL_SELECTORS.EMBLA) as NodeListOf<HTMLElement>;
  emblaNodes.forEach(initializeCarouselInstance);
}



/**
 * Initializes all application components
 */
function initializeApp() {
  initializeCarousels();
}

// Initialize all components when DOM is ready
document.addEventListener('DOMContentLoaded', initializeApp);



