<svelte:options customElement="tosoh-grid-accent" />

<div class="wrapper">
  <div class="position-bl grid"></div>
  <svelte:element this={'slot'} />
  <div class="position-tr grid"></div>
</div>

<style lang="postcss">
  :host {
    position: relative;
    display: block;
    z-index: var(--z-index-content);
  }

  * {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
  }

  .wrapper {
    position: relative;
    background: var(--color-navy-blue);
    overflow: hidden;

    > .grid {
      position: absolute;
      width: 64rem;
      height: 64rem;
      display: grid;
      grid-template-columns: repeat(32, 2rem);
      grid-template-rows: repeat(32, 2rem);
      transform: rotate(37.5deg);
      pointer-events: none;
      z-index: var(--z-index-background);

      &::before {
        content: '';
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background-image:
          linear-gradient(to right, white 1px, transparent 1px),
          linear-gradient(to bottom, white 1px, transparent 1px);
        background-size: 2rem 2rem;
        opacity: 0.1;
        mask: radial-gradient(circle at center, white 40%, transparent 75%);
        -webkit-mask: radial-gradient(circle at center, white 40%, transparent 75%);
      }

      &.position-bl {
        bottom: max(-200%, -32rem);
        left: -56rem;

        @media (min-width: 48rem) {
          left: max(-50%, -36rem);
        }
      }

      &.position-tr {
        top: max(-200%, -32rem);
        right: -56rem;

        @media (min-width: 48rem) {
          right: max(-50%, -36rem);
        }
      }
    }
  }
</style>
