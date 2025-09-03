<svelte:options customElement="tosoh-scroll-x" />

<script lang="ts">
  import { onMount } from 'svelte';
  import { on } from 'svelte/events';

  let {
    showScrollbar = true,
    showNavButtons = false,
    scrollPercentage = 25,
    scrollbarHeight = '0.25rem',
    scrollbarColor = 'var(--color-petrol)',
    scrollbarTrackColor = 'var(--color-shadow)',
  } = $props();

  let scrollContainer: HTMLDivElement | null = null;
  let scrollTrack: HTMLDivElement | null = $state(null);
  let scrollThumb: HTMLDivElement | null = $state(null);

  let isDragging = $state(false);
  let scrollLeft = $state(0);
  let scrollWidth = $state(0);
  let clientWidth = $state(0);
  let trackWidth = $state(0);
  let dragStartX = $state(0);
  let dragStartScrollLeft = $state(0);

  const canScroll = $derived(scrollWidth > clientWidth);
  const maxScrollLeft = $derived(scrollWidth - clientWidth);
  const scrollRatio = $derived(clientWidth / scrollWidth);
  const thumbWidth = $derived(Math.max(trackWidth * scrollRatio, 20));
  const thumbLeft = $derived(
    maxScrollLeft > 0 ? (scrollLeft / maxScrollLeft) * (trackWidth - thumbWidth) : 0
  );

  const updateScrollDimensions = () => {
    if (!scrollContainer) return;

    scrollLeft = scrollContainer.scrollLeft;
    scrollWidth = scrollContainer.scrollWidth;
    clientWidth = scrollContainer.clientWidth;
    trackWidth = scrollTrack?.clientWidth || 0;
  };

  const handleScroll = () => {
    if (!isDragging) {
      scrollLeft = scrollContainer?.scrollLeft || 0;
    }
  };

  const handleMouseDown = (e: MouseEvent) => {
    if (!scrollContainer || !canScroll) return;

    isDragging = true;
    dragStartX = e.clientX;
    dragStartScrollLeft = scrollContainer.scrollLeft;

    e.preventDefault();
  };

  const handleMouseMove = (e: MouseEvent) => {
    if (!isDragging || !scrollContainer || !canScroll) return;

    const deltaX = e.clientX - dragStartX;
    const scrollRatio = maxScrollLeft / (trackWidth - thumbWidth);
    const newScrollLeft = dragStartScrollLeft + deltaX * scrollRatio;

    scrollContainer.scrollLeft = Math.max(0, Math.min(newScrollLeft, maxScrollLeft));
    scrollLeft = scrollContainer.scrollLeft;
  };

  const handleMouseUp = () => (isDragging = false);

  const handleTrackClick = (e: MouseEvent) => {
    if (!scrollContainer || !canScroll) return;

    const rect = scrollTrack?.getBoundingClientRect();
    if (!rect) return;

    const clickX = e.clientX - rect.left;
    const targetScrollLeft = (clickX / trackWidth) * maxScrollLeft;

    scrollContainer.scrollLeft = Math.max(0, Math.min(targetScrollLeft, maxScrollLeft));
    scrollLeft = scrollContainer.scrollLeft;
  };

  const handleResize = () => {
    updateScrollDimensions();
  };

  const scrollByPercentage = (direction: 'left' | 'right') => {
    if (!scrollContainer || !canScroll) return;

    const scrollAmount = (clientWidth * scrollPercentage) / 100;
    const currentScroll = scrollContainer.scrollLeft;

    let newScrollLeft: number;
    if (direction === 'left') {
      newScrollLeft = Math.max(0, currentScroll - scrollAmount);
    } else {
      newScrollLeft = Math.min(maxScrollLeft, currentScroll + scrollAmount);
    }

    scrollContainer.scrollTo({
      left: newScrollLeft,
      behavior: 'smooth',
    });
  };

  onMount(() => {
    if (!scrollContainer) return;

    requestAnimationFrame(() => {
      updateScrollDimensions();
    });

    const opts = { passive: true };
    const scrollHandler = on(scrollContainer, 'scroll', handleScroll, opts);
    const resizeHandler = on(window, 'resize', handleResize, opts);

    let mouseMoveHandler: (() => void) | null = null;
    let mouseUpHandler: (() => void) | null = null;

    if (showScrollbar) {
      mouseMoveHandler = on(document, 'mousemove', handleMouseMove);
      mouseUpHandler = on(document, 'mouseup', handleMouseUp);
    }

    return () => {
      if (scrollHandler) scrollHandler();
      if (resizeHandler) resizeHandler();
      if (mouseMoveHandler) mouseMoveHandler();
      if (mouseUpHandler) mouseUpHandler();
    };
  });

  $effect(() => {
    if (!scrollContainer) return;

    const resizeObserver = new ResizeObserver(() => {
      requestAnimationFrame(updateScrollDimensions);
    });

    resizeObserver.observe(scrollContainer);

    // Observe scrollbar track for resize events
    if (scrollTrack) {
      resizeObserver.observe(scrollTrack);
    }

    // Observe direct children for content changes
    const children = scrollContainer.children;
    for (let i = 0; i < children.length; i++) {
      resizeObserver.observe(children[i]);
    }

    const timeoutId = setTimeout(updateScrollDimensions, 50);

    return () => {
      resizeObserver.disconnect();
      clearTimeout(timeoutId);
    };
  });
</script>

<div class="wrapper">
  {#if showNavButtons && canScroll}
    <button
      class="nav-button left"
      onclick={() => scrollByPercentage('left')}
      aria-label="Scroll left"
      tabindex="0"
    >
      <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
        <path
          d="M7.5 2L3.5 6L7.5 10"
          stroke="currentColor"
          stroke-width="1.5"
          stroke-linecap="round"
          stroke-linejoin="round"
        />
      </svg>
    </button>
  {/if}

  <div class="container" id="scroll-content" bind:this={scrollContainer}>
    <svelte:element this={'slot'} />
  </div>

  {#if showNavButtons && canScroll}
    <button
      class="nav-button right"
      onclick={() => scrollByPercentage('right')}
      aria-label="Scroll right"
      tabindex="0"
    >
      <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
        <path
          d="M4.5 2L8.5 6L4.5 10"
          stroke="currentColor"
          stroke-width="1.5"
          stroke-linecap="round"
          stroke-linejoin="round"
        />
      </svg>
    </button>
  {/if}

  {#if showScrollbar}
    <div
      class="track"
      bind:this={scrollTrack}
      onclick={handleTrackClick}
      onkeydown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          handleTrackClick(e as unknown as MouseEvent);
        }
      }}
      role="scrollbar"
      tabindex="0"
      aria-orientation="horizontal"
      aria-controls="scroll-content"
      aria-valuenow={scrollLeft}
      aria-valuemin={0}
      aria-valuemax={maxScrollLeft}
      style:height={scrollbarHeight}
      style:background-color={scrollbarTrackColor}
    >
      {#if canScroll}
        <div
          class="thumb"
          bind:this={scrollThumb}
          class:dragging={isDragging}
          onmousedown={handleMouseDown}
          role="button"
          tabindex="0"
          aria-label="Scrollbar thumb"
          style:width="{thumbWidth}px"
          style:transform="translateX({thumbLeft}px)"
          style:background-color={scrollbarColor}
          style:height={scrollbarHeight}
        ></div>
      {/if}
    </div>
  {/if}
</div>

<style lang="postcss">
  * {
    box-sizing: border-box;
  }

  :host {
    display: block;
    width: 100%;
  }

  .wrapper {
    position: relative;
    width: 100%;
  }

  .container {
    width: 100%;
    overflow-x: auto;
    overflow-y: hidden;
    scrollbar-width: none; /* Firefox */
    -ms-overflow-style: none; /* IE and Edge */

    &::-webkit-scrollbar {
      display: none; /* Chrome, Safari, Opera */
    }
  }

  .track {
    position: relative;
    width: 100%;
    cursor: pointer;
    user-select: none;
  }

  .thumb {
    position: absolute;
    top: 0;
    left: 0;
    cursor: grab;
    transition: transform 0.1s ease-out;

    &:hover {
      opacity: 0.8;
    }

    &.dragging {
      cursor: grabbing;
      transition: none;
    }
  }

  .nav-button {
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
    z-index: 10;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 2rem;
    height: 2rem;
    border-radius: 50%;
    background-color: var(--color-petrol);
    border: none;
    cursor: pointer;
    color: var(--color-lime);
    transition: opacity 0.2s ease;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);

    &:hover {
      opacity: 0.6;
    }

    &:active {
      opacity: 0.8;
    }

    &.left {
      left: 0.5rem;
    }

    &.right {
      right: 0.5rem;
    }
  }
</style>
