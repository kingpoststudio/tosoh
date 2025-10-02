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

import './widgets/WebinarListings/WebinarListings.svelte';
import './widgets/SupportPortal/SupportPortal.svelte';
import './widgets/KioskDocuments/KioskDocuments.svelte';
import './widgets/HemoglobinVariantsLibrary/HemoglobinVariantsLibrary.svelte';

import EmblaCarousel, { type EmblaCarouselType } from 'embla-carousel';

document.addEventListener('DOMContentLoaded', () => {
  const emblaNode = document.querySelector('.embla') as HTMLElement;
  const prevButtonNode = document.querySelector('.embla__prev');
  const nextButtonNode = document.querySelector('.embla__next');

  if (emblaNode) {
    const options = {
      loop: false,
      dragFree: false,
      containScroll: 'trimSnaps' as const,
    };

    const embla = EmblaCarousel(emblaNode, options);

    prevButtonNode?.addEventListener('click', () => embla.scrollPrev(), false);
    nextButtonNode?.addEventListener('click', () => embla.scrollNext(), false);

    embla.on('slidesInView', controlScroll);

    function controlScroll(emblaEvent: EmblaCarouselType) {
      const canScrollNext = emblaEvent?.canScrollNext();
      const canScrollPrev = emblaEvent?.canScrollPrev();

      if (canScrollNext) {
        nextButtonNode?.removeAttribute('disabled');
      } else {
        nextButtonNode?.setAttribute('disabled', '');
      }

      if (canScrollPrev) {
        prevButtonNode?.removeAttribute('disabled');
      } else {
        prevButtonNode?.setAttribute('disabled', '');
      }
    }
  }
});
