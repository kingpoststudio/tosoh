<svelte:options customElement="tosoh-sub-header" />

<script lang="ts">
</script>

<section>
  <div class="wrapper">
    <svelte:element this={'slot'} name="logo" />
    <svelte:element this={'slot'} name="cta" />
  </div>
</section>

<style lang="postcss">
  * {
    box-sizing: border-box;
  }

  section {
    position: fixed;
    left: 0;
    top: var(--spacing-header-height);
    right: 0;
    z-index: calc(var(--z-index-header) - 1);

    .wrapper {
      display: flex;
      align-items: center;
      justify-content: space-between;
      width: 90%;
      max-width: var(--page-max-width);
      min-height: 4.25rem;
      margin-inline: auto;
      padding: var(--spacing-sm) var(--spacing-base);
      background: var(--color-white);
      border: 1px solid var(--color-border);
      border-top: none;
      border-bottom-left-radius: var(--spacing-md);
      border-bottom-right-radius: var(--spacing-md);
      box-shadow: rgba(0, 0, 0, 0.1) 0px 0px 1rem;

      @media (min-width: 768px) {
        padding: var(--spacing-sm) var(--spacing-md);
      }

      slot[name='logo'] {
        display: block;
        width: 10rem;
        @media (min-width: 768px) {
          width: 12rem;
        }

        &::slotted(img) {
          width: 100%;
          object-fit: contain;
        }
      }
    }
  }
</style>
