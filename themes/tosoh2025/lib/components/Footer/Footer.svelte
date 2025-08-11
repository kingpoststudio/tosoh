<svelte:options customElement="tosoh-footer" />

<script lang="ts">
</script>

<footer>
  <div class="wrapper"></div>
</footer>

<style lang="postcss">
  * {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
  }

  footer {
    background: var(--color-navy-blue);

    > .wrapper {
      display: flex;
      flex-direction: column;
      width: 100%;
      min-height: 20rem;
      max-width: var(--container-8xl);
      margin: 0 auto;
    }
  }
</style>
