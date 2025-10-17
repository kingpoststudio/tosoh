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

    const shouldBeShown = detail?.groupId === groupId;
    const isHostTab = $host().getAttribute('variant') === 'tab';

    isActive = shouldBeShown;

    if (shouldBeShown && isHostTab) {
      $host().classList?.remove('hidden');
    } else if (isHostTab && !shouldBeShown) {
      $host().classList?.add('hidden');
    }
  });

  onDestroy(() => handler());
</script>

{#if variant === 'action'}
  <button class:active={isActive} onclick={setTabActive} aria-label="tab-button" class:isLast>
    <svelte:element this={'slot'} />
  </button>
{:else if isActive}
  <div class="tab-wrapper" class:active={isActive} in:fade>
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
    color: var(--color-nickel);
    border-bottom: 1px solid var(--color-border);

    &.isLast {
      border-right: none;
    }

    &.active {
      font-weight: 600;
      background: var(--color-ghost-white);
      border-bottom: 2px solid var(--color-imperial-red);
      color: var(--color-default);
    }
  }

  .tab-wrapper {
    margin-top: var(--space-xl);
  }
</style>
