<svelte:options
  customElement={{
    tag: 'tosoh-tab-group',
    props: {
      groupId: { type: 'String' },
      variant: { reflect: true, type: 'String' },
      active: { reflect: true, type: 'Boolean' },
    },
  }}
/>

<script lang="ts">
  import { onDestroy } from 'svelte';
  import { on } from 'svelte/events';
  import { fade } from 'svelte/transition';

  let {
    groupId,
    variant = 'tab',
    active = false,
  }: { groupId: string; variant: 'action' | 'tab'; active: boolean } = $props();

  let isActive = $state(active);

  function setTabActive() {
    isActive = true;

    $host().dispatchEvent(
      new CustomEvent('TosohTabGroupActive', {
        detail: { groupId },
        bubbles: true,
      })
    );
  }

  const handler = on(window, 'TosohTabGroupActive', (e: Event) => {
    const { detail } = e as CustomEvent;

    isActive = detail?.groupId === groupId;
  });

  onDestroy(() => handler());
</script>

{#if variant === 'action'}
  <button class:active={isActive} onclick={setTabActive} aria-label="tab-button">
    <svelte:element this={'slot'} />
  </button>
{:else if isActive}
  <div class="tab-wrapper" in:fade>
    <svelte:element this={'slot'} />
  </div>
{/if}

<style lang="postcss">
  :host([variant='action']) {
    display: contents;
  }

  button {
    all: unset;
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100%;
    min-width: 8rem;
    max-width: 16rem;
    padding: var(--space);
    font-weight: 450;
    cursor: pointer;
    transition: text-shadow 0.2s ease-in-out;

    &:after {
      content: '';
      position: absolute;
      bottom: 0;
      left: 0;
      width: 100%;
      height: 0.2rem;
      background: transparent;
      transition: background 0.2s ease-in-out;
    }

    &.active {
      font-weight: 600;
      &:after {
        background: var(--color-deep-blue);
      }
    }
  }

  .tab-wrapper {
    margin-top: var(--space-xl);
  }
</style>
