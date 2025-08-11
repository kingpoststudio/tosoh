<svelte:options customElement="tosoh-footer" />

<footer>
  <div class="position-bl grid"></div>
  <div class="wrapper"></div>
  <div class="position-tr grid"></div>
</footer>

<style lang="postcss">
  * {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
  }

  footer {
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
      z-index: 1;

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
        mask: radial-gradient(circle at center, white 40%, transparent 80%);
        -webkit-mask: radial-gradient(circle at center, white 40%, transparent 80%);
      }

      &.position-bl {
        bottom: -200%;
        left: -56rem;

        @media (min-width: 48rem) {
          bottom: -200%;
          left: -60%;
        }
      }

      &.position-tr {
        top: -200%;
        right: -56rem;

        @media (min-width: 48rem) {
          top: -200%;
          right: -60%;
        }
      }
    }

    > .wrapper {
      position: relative;
      display: flex;
      flex-direction: column;
      width: 100%;
      min-height: 20rem;
      max-width: var(--container-8xl);
      margin: 0 auto;
      z-index: 2;
    }
  }
</style>
