<svelte:options
  customElement={{
    tag: 'tosoh-tab-group',
    props: {
      groupId: { type: 'String' },
      variant: { reflect: true, type: 'String' },
      active: { reflect: true, type: 'Boolean' },
      isLast: { reflect: true, type: 'Boolean' },
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
    isLast = false,
  }: { groupId: string; variant: 'action' | 'tab'; active: boolean; isLast: boolean } = $props();

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
  <button class:active={isActive} onclick={setTabActive} aria-label="tab-button" class:isLast>
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

    display: flex;
    align-items: center;
    justify-content: center;
    width: 100%;
    padding: var(--spacing-sm);
    text-align: center;
    cursor: pointer;
    height: 100% !important;
    border-right: 1px solid var(--color-border);
    border-top: 1px solid var(--color-border);
    border-bottom: 1px solid var(--color-border);

    &.isLast {
      border-right: none;
    }

    &.active {
      font-weight: 600;
      background: var(--color-ghost-white);
      color: var(--color-imperial-red);
    }
  }

  .tab-wrapper {
    margin-top: var(--space-xl);
  }
</style>
