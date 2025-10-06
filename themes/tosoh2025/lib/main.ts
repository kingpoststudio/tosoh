import './styles/main.css';

import './components/Header/Header.svelte';
import './components/GridAccent/GridAccent.svelte';
import './components/TwClasses/TwClasses.svelte';
import './components/Modal/Modal.svelte';
import './components/CompetitorComparisonToolFilters/CompetitorComparisonToolFilters.svelte';
import './components/TabGroup/TabGroup.svelte';
import './components/CompetitorComparisonToolComparisonFilters/CompetitorComparisonToolComparisonFilters.svelte';
import './components/ScrollX/ScrollX.svelte';
import './components/Modal/Modal.svelte';
import './components/RevealGroup/RevealGroup.svelte';

import './widgets/WebinarListings/WebinarListings.svelte';
import './widgets/SupportPortal/SupportPortal.svelte';
import './widgets/KioskDocuments/KioskDocuments.svelte';
import './widgets/HemoglobinVariantsLibrary/HemoglobinVariantsLibrary.svelte';
import './widgets/PortaleEmogiobine/PortaleEmogiobine.svelte';

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
