<svelte:options customElement="tosoh-reveal-below" />

<script lang="ts">
  import { fade } from "svelte/transition";

  let { maxHeight = "32rem" } = $props();
  let isRevealed = $state(false);

  let wrapper: HTMLDivElement;
  let animatingHeight = $state<string | undefined>();

  function reveal() {
    if (!wrapper) return;

    const scrollHeight = wrapper.scrollHeight;
    animatingHeight = `${scrollHeight}px`;
    isRevealed = true;

    setTimeout(() => {
      if (isRevealed) animatingHeight = undefined;
    }, 300);
  }
</script>

<div
  bind:this={wrapper}
  class={["wrapper", isRevealed && "revealed"]}
  style:--max-height={maxHeight}
  style:--animating-height={animatingHeight}
>
  <svelte:element this={"slot"} />

  {#if !isRevealed}
    <div class="reveal" out:fade>
      <button onclick={reveal} aria-label="Reveal">
        <svelte:element this={"slot"} name="label" />
        <svg viewBox="0 0 15 8" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path
            d="M0 0.880503L7.1195 8L14.239 0.880503L13.3459 0L7.1195 6.22642L0.893082 0L0 0.880503Z"
            fill="#27424A"
          />
        </svg>
      </button>
    </div>
  {/if}
</div>

<style lang="postcss">
  * {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
  }

  .wrapper {
    position: relative;
    display: block;
    max-height: var(--max-height, 24rem);
    overflow: hidden;
    transition: max-height 300ms ease-in-out;

    &.revealed {
      max-height: var(--animating-height, 100%);
    }

    > .reveal {
      position: absolute;
      bottom: 0;
      left: 50%;
      transform: translateX(-50%);
      display: flex;
      align-items: flex-end;
      width: 100%;
      height: 3rem;
      padding-bottom: var(--space-sm);
      background: var(--color-cream);
      border-bottom: 1px solid var(--color-sand);

      &:before {
        content: "";
        position: absolute;
        bottom: calc(100% - 0.25rem);
        left: 50%;
        transform: translateX(-50%);
        width: 100%;
        height: 100%;
        background: linear-gradient(0, var(--color-cream) 20%, transparent);
      }

      > button {
        all: unset;
        display: flex;
        align-items: center;
        gap: var(--space-xs);
        font-size: var(--font-size-sm);
        cursor: pointer;

        > svg {
          width: 0.8rem;
          transition: transform 0.2s ease-in-out;
        }

        &:hover {
          > svg {
            transform: translateY(0.1rem);
          }
        }
      }
    }
  }
</style>
