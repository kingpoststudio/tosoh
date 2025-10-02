<svelte:options customElement="tosoh-reveal-group" />

<script lang="ts">
  import { onDestroy } from 'svelte';
  import { fly } from 'svelte/transition';
  import { on } from 'svelte/events';

  let {
    groupId,
    variant = 'reveal',
    isRevealed = false,
  }: {
    groupId: string;
    variant: 'reveal' | 'action';
    isRevealed: boolean;
  } = $props();

  function setRevealActive() {
    $host().dispatchEvent(
      new CustomEvent('TosohRevealGroupActive', {
        detail: { groupId },
        bubbles: true,
      })
    );

    if (variant === 'action') $host().remove();
  }

  const handler = on(window, 'TosohRevealGroupActive', (e: Event) => {
    if (isRevealed) return;

    const { detail } = e as CustomEvent;
    isRevealed = detail?.groupId === groupId;
  });

  onDestroy(() => handler());
</script>

{#if variant === 'action'}
  <button onclick={setRevealActive} aria-label="Reveal action">
    <svelte:element this={'slot'} />
  </button>
{:else if isRevealed}
  <div in:fly={{ y: '4rem' }}>
    <svelte:element this={'slot'} />
  </div>
{/if}

<style>
  * {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
  }

  button {
    all: unset;
  }
</style>
