<svelte:options customElement="tosoh-accordion" />

<script lang="ts">
  import { onDestroy } from 'svelte';
  import { on } from 'svelte/events';
  import { slide, fade } from 'svelte/transition';

  let {
    groupId,
    variant = 'action',
  }: {
    groupId: string;
    variant: 'reveal' | 'action';
  } = $props();

  let isOpen = $state(false);

  function revealAccordionContent() {
    $host().dispatchEvent(
      new CustomEvent('TosohAccordionReveal', {
        detail: { groupId },
        bubbles: true,
      })
    );
  }

  function hideAccordionContent() {
    $host().dispatchEvent(
      new CustomEvent('TosohAccordionHide', {
        detail: { groupId },
        bubbles: true,
      })
    );
  }

  const handler = on(window, 'TosohAccordionReveal', (e: Event) => {
    const { detail } = e as CustomEvent;
    isOpen = detail?.groupId === groupId;
  });

  const handlerClose = on(window, 'TosohAccordionHide', (e: Event) => {
    if (!isOpen) return;

    const { detail } = e as CustomEvent;
    isOpen = detail?.groupId === groupId ? false : true;
  });

  onDestroy(() => handler());
  onDestroy(() => handlerClose());
</script>

<div
  class="accordion-wrapper"
  class:action={variant === 'action'}
  class:reveal={variant === 'reveal'}
  class:isOpen
>
  {#if variant === 'action'}
    <button
      type="button"
      onclick={isOpen ? hideAccordionContent : revealAccordionContent}
      aria-label="Reveal action"
    >
      <div class="action-wrapper">
        <svelte:element this={'slot'} />

        <div class="action-icon">
          <svg
            class:rotate-180={isOpen}
            xmlns="http://www.w3.org/2000/svg"
            width="25"
            height="25"
            viewBox="0 0 35 35"
            fill="none"
          >
            <rect width="35" height="35" rx="17.5" fill="#E4032D" />
            <path
              d="M23.5 14.5L17.5 20.5L11.5 14.5"
              stroke="white"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
          </svg>
        </div>
      </div>
    </button>
  {:else if isOpen}
    <div transition:slide class="accordion-reveal">
      <svelte:element this={'slot'} />
    </div>
  {/if}
</div>

<style lang="postcss">
  * {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
  }

  .accordion-wrapper.action.isOpen {
    background-color: #ffffff14;
    transition: background-color 0.2s ease-in-out;
    border-top-left-radius: 0.5rem;
    border-top-right-radius: 0.5rem;
  }
  .accordion-wrapper.reveal.isOpen {
    background-color: #ffffff14;
    transition: background-color 0.2s ease-in-out;
    border-bottom-left-radius: 0.5rem;
    border-bottom-right-radius: 0.5rem;
  }

  button {
    all: unset;
    display: block;
    min-width: 100%;
    max-width: 100%;

    .action-wrapper {
      position: relative;
      display: flex;
      flex-direction: row;
      flex-direction: row;
      align-items: center;
      justify-content: space-between;
      padding: var(--spacing-base);
      color: var(--color-white);
      width: 100%;
      max-width: 100%;

      > .action-icon {
        position: relative;

        > svg {
          top: 50%;

          transition: transform 0.2s ease-in-out;

          &.rotate-180 {
            transform: rotate(180deg);
          }
        }
      }
    }
  }
  .accordion-reveal {
    padding: 0 var(--spacing-base) var(--spacing-base) var(--spacing-base);
    color: var(--color-white);
  }
</style>
