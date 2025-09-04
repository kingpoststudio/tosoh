<svelte:options customElement="tosoh-modal" />

<script lang="ts">
  import { onDestroy } from 'svelte';
  import { on } from 'svelte/events';
  import { fly } from 'svelte/transition';

  let {
    modalId,
    variant = 'modal',
    isVisible = false,
  }: {
    modalId: string;
    variant: 'modal' | 'action';
    isVisible: boolean;
  } = $props();

  let dialogEl: HTMLDialogElement | null = $state(null);

  function setModalActive() {
    $host().dispatchEvent(
      new CustomEvent('TosohModalOpen', {
        detail: { modalId },
        bubbles: true,
      })
    );
  }

  function closeModal() {
    $host().dispatchEvent(
      new CustomEvent('TosohModalClose', {
        detail: { modalId },
        bubbles: true,
      })
    );
  }

  const escKeyHandler = (e: KeyboardEvent) => {
    if (e.key === 'Escape') {
      e.preventDefault();
      closeModal();
    }
  };

  const dialogClickHandler = (e: MouseEvent) => {
    if (!dialogEl) return;

    const innerEl = dialogEl.querySelector('.inner');
    if (!innerEl) return;

    const rect = innerEl.getBoundingClientRect();
    const isInDialog =
      rect.top <= e.clientY &&
      e.clientY <= rect.top + rect.height &&
      rect.left <= e.clientX &&
      e.clientX <= rect.left + rect.width;

    if (!isInDialog) closeModal();
  };

  const openHandler = on(window, 'TosohModalOpen', (e: Event) => {
    const { detail } = e as CustomEvent;
    if (detail?.modalId === modalId && !isVisible) {
      isVisible = true;
      setTimeout(() => {
        if (dialogEl) {
          dialogEl.showModal();
          window.addEventListener('keydown', escKeyHandler);
        }
      }, 50);
    }
  });

  const closeHandler = on(window, 'TosohModalClose', (e: Event) => {
    const { detail } = e as CustomEvent;
    if (detail?.modalId === modalId && isVisible) {
      isVisible = false;
      setTimeout(() => {
        if (dialogEl) {
          dialogEl.close();
          window.removeEventListener('keydown', escKeyHandler);
        }
      }, 300);
    }
  });

  onDestroy(() => {
    openHandler();
    closeHandler();
    window.removeEventListener('keydown', escKeyHandler);
  });
</script>

{#if variant === 'action'}
  <button onclick={setModalActive} aria-label="Modal action">
    <svelte:element this={'slot'} />
  </button>
{:else}
  <div class="wrapper">
    <div
      class="overlay"
      class:visible={isVisible}
      onclick={closeModal}
      onkeydown={(e) => e.key === 'Enter' && closeModal()}
      role="button"
      tabindex="0"
      aria-label="Close modal"
    ></div>
    {#if isVisible}
      <dialog bind:this={dialogEl} onclick={dialogClickHandler} transition:fly={{ y: 64 }}>
        <div class="inner">
          <div class="title">
            <svelte:element this={'slot'} name="title" />
            <button onclick={closeModal} aria-label="Close modal" class="close-button">
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M19 5L5 19M5 5L19 19"
                  stroke="currentColor"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
              </svg>
            </button>
          </div>
          <div class="content">
            <svelte:element this={'slot'} name="content" />
          </div>
        </div>
      </dialog>
    {/if}
  </div>
{/if}

<style lang="postcss">
  * {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
  }

  button {
    all: unset;
    display: flex;
    cursor: pointer;
  }

  .wrapper {
    display: contents;

    > .overlay {
      position: fixed;
      z-index: 100;
      inset: 0;
      display: block;
      width: 100vw;
      height: 100vh;
      opacity: 0;
      background: rgba(0, 0, 0, 0.5);
      z-index: 12345;
      pointer-events: none;
      transition: opacity 200ms ease-out;

      &.visible {
        opacity: 1;
        pointer-events: auto;
      }
    }

    > dialog {
      position: fixed;
      inset: 0;
      width: 100%;
      height: 100%;
      max-width: 100vw;
      max-height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 0;
      margin: 0;
      border: none;
      border-radius: 0;
      box-shadow: none;
      outline: none;
      background: none;

      &::backdrop {
        display: none;
      }

      > .inner {
        display: flex;
        flex-direction: column;
        color: var(--color-ghost-white);
        background: var(--color-prussian-blue);
        min-width: 24rem;
        width: fit-content;
        max-width: calc(100vw - var(--space-xl));
        min-height: 12rem;
        height: fit-content;
        max-height: calc(100vh - 12rem);
        border-radius: 8px;
        box-shadow: 0 10px 25px rgba(0, 0, 0, 0.15);
        overflow-y: auto;

        @media (min-width: 768px) {
          max-width: 70vw;
        }

        > .title {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: var(--space);
          border-bottom: 1px solid var(--color-ghost-white);
        }

        > .content {
          padding: var(--space-xl);
          overflow-y: auto;
          flex-grow: 1;
          max-height: calc(90vh - 4rem);
        }
      }
    }
  }
</style>
