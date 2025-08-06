<svelte:options customElement="tosoh-hero-banner" />

<script lang="ts">
  import { fly } from "svelte/transition";
  import type { ThemeColor } from "../../../types/global";

  type Props = {
    decorated?: boolean | string;
    condensed?: boolean | string;
    bgColor?: ThemeColor;
    imageVariant?: "circle-top" | "circle-bottom" | "pill" | "square";
  };

  let {
    decorated = false,
    condensed = false,
    bgColor = "petrol",
    imageVariant = "square",
  }: Props = $props();
</script>

<div
  class={[
    "wrapper",
    condensed && "condensed",
    decorated && "decorated",
    bgColor && `bg-${bgColor}`,
    imageVariant && `variant-${imageVariant}`,
  ]}
>
  <div class="content">
    <div class="title">
      <svelte:element this={"slot"} name="eyebrow" />
      <svelte:element this={"slot"} name="title" />
    </div>
    {#if decorated}
      <div class="spacer"></div>
    {/if}
    <div class="description">
      <svelte:element this={"slot"} name="description" />
      <div>
        <svelte:element this={"slot"} name="cta" />
      </div>
    </div>
  </div>
  <div
    class="image"
    transition:fly={{ duration: 500, delay: 300, x: "0.5rem" }}
  >
    <svelte:element this={"slot"} name="image" />
  </div>
</div>

<style lang="postcss">
  * {
    box-sizing: border-box;
  }

  .wrapper {
    position: relative;
    display: flex;
    align-items: center;
    height: 100%;
    min-height: 36rem;
    max-width: var(--page-max-width);
    margin: 0 auto;
    color: var(--color-petrol);
    overflow: hidden;

    &.bg-petrol {
      background-color: var(--color-petrol);
      color: var(--color-cream);
    }

    &.bg-lime {
      background-color: var(--color-lime);
    }

    &.bg-cream {
      background-color: var(--color-cream);
    }

    &.bg-sand {
      background-color: var(--color-sand);
    }

    &.condensed {
      min-height: 24rem;
    }

    &.variant-circle-top {
      padding-top: 4rem;

      @media (min-width: 768px) {
        padding-top: 0;
      }

      .image {
        position: absolute;
        top: 0;
        right: 0;
        width: auto;
        height: 100%;
        max-height: 24rem;
        aspect-ratio: 1;
        clip-path: circle(100% at 100% 0%);

        @media (min-width: 768px) {
          max-height: 36rem;
        }

        @media (min-width: 1280px) {
          max-height: 48rem;
        }
      }

      .content {
        width: 80%;
        margin-top: 12rem;

        @media (min-width: 768px) {
          width: 60%;
          margin-top: 0;
        }
      }
    }

    &.variant-circle-bottom {
      padding-bottom: 16rem;

      @media (min-width: 768px) {
        padding-bottom: 0;
      }

      .image {
        position: absolute;
        bottom: 0;
        right: 0;
        width: auto;
        height: 100%;
        max-height: 24rem;
        aspect-ratio: 1;
        clip-path: circle(100% at 100% 100%);

        @media (min-width: 768px) {
          max-height: 36rem;
        }

        @media (min-width: 1280px) {
          max-height: 48rem;
        }
      }

      .content {
        width: 80%;

        @media (min-width: 768px) {
          width: 60%;
        }
      }
    }

    &.variant-square {
      .image {
        position: absolute;
        right: 0;
        top: 0;
        display: flex;
        width: 40%;
        height: 100%;
      }

      .content {
        width: 60%;
      }
    }

    &.variant-pill {
      align-items: flex-start;

      @media (min-width: 768px) {
        align-items: center;
      }

      .image {
        position: absolute;
        right: 0;
        bottom: var(--space-md);
        display: flex;
        aspect-ratio: 7 / 5;
        width: 50%;
        border-top-left-radius: 9999px;
        border-bottom-left-radius: 9999px;
        overflow: hidden;
        max-height: 24rem;

        @media (min-width: 768px) {
          top: 50%;
          bottom: 0;
          transform: translateY(-50%);
          width: 45%;
          max-width: 96rem;
        }
      }

      .content {
        width: 80%;
        margin-bottom: 12rem;

        @media (min-width: 768px) {
          width: 60%;
          margin-bottom: 0;
        }
      }
    }

    .image {
      slot[name="image"]::slotted(img) {
        width: 100%;
        height: 100%;
        object-fit: cover;
      }
    }

    .content {
      position: relative;
      z-index: 1;
      display: flex;
      flex-direction: column;
      justify-content: center;
      gap: var(--space-md);
      height: 100%;
      min-height: inherit;
      padding: var(--space-lg) var(--space-md);

      @media (min-width: 768px) {
        padding: var(--space-xl) var(--space-2xl);
      }

      > .title,
      > .description {
        display: flex;
        flex-direction: column;
      }

      > .description {
        gap: var(--space);

        > slot[name="description"]::slotted(*) {
          font-size: var(--font-size-md);
        }
      }
    }

    &.decorated .content {
      @media screen and (min-width: 768px) {
        gap: 0;
        justify-content: space-between;

        > .title,
        > .description {
          flex: 1;
          display: flex;
          flex-direction: column;
          min-height: 12rem;
        }

        > .title {
          justify-content: flex-end;
        }

        > .description {
          justify-content: center;
        }

        > .spacer {
          flex: none;
          height: 6rem;
        }
      }
    }
  }
</style>
