import './styles/main.css';

import './components/Header/Header.svelte';
import './components/Modal/Modal.svelte';
import './components/CCTFilters/CCTFilters.svelte';
import './components/CCTDetailsFilters/CCTDetailsFilters.svelte';
import './components/TabGroup/TabGroup.svelte';
import './components/ScrollX/ScrollX.svelte';
import './components/Modal/Modal.svelte';
import './components/RevealGroup/RevealGroup.svelte';
import './components/Accordion/Accordion.svelte';
import './components/ActiveProductImage/ActiveProductImage.svelte';
import './components/InView/InView.svelte';
import './components/SubHeader/SubHeader.svelte';

import './modules/WebinarListing/WebinarListing.svelte';
import './modules/SupportPortal/SupportPortal.svelte';
import './modules/KioskDocuments/KioskDocuments.svelte';
import './modules/HemoglobinVariantsLibrary/HemoglobinVariantsLibrary.svelte';
import './modules/HemoglobinPortal/HemoglobinPortal.svelte';

import EmblaCarousel, { type EmblaCarouselType } from 'embla-carousel';

document.addEventListener('DOMContentLoaded', () => {
  const emblaNodes = document.querySelectorAll('.embla') as NodeListOf<HTMLElement>;

  emblaNodes.forEach((emblaNode) => {
    const parentContainer = emblaNode.closest('.max-w-max-page, [data-carousel-container]');

    if (!parentContainer) {
      console.warn('Carousel parent container not found for', emblaNode);
      return;
    }

    const prevButtonNode = parentContainer.querySelector('.embla__prev');
    const nextButtonNode = parentContainer.querySelector('.embla__next');

    const options = {
      loop: false,
      dragFree: false,
      containScroll: 'trimSnaps' as const,
    };

    const embla = EmblaCarousel(emblaNode, options);

    prevButtonNode?.addEventListener('click', () => embla.scrollPrev(), false);
    nextButtonNode?.addEventListener('click', () => embla.scrollNext(), false);

    embla.on('slidesInView', () => controlScroll(embla, prevButtonNode, nextButtonNode));

    function controlScroll(
      emblaEvent: EmblaCarouselType,
      prevButton: Element | null,
      nextButton: Element | null
    ) {
      const canScrollNext = emblaEvent?.canScrollNext();
      const canScrollPrev = emblaEvent?.canScrollPrev();

      if (canScrollNext) {
        nextButton?.removeAttribute('disabled');
      } else {
        nextButton?.setAttribute('disabled', '');
      }

      if (canScrollPrev) {
        prevButton?.removeAttribute('disabled');
      } else {
        prevButton?.setAttribute('disabled', '');
      }
    }
  });
});
