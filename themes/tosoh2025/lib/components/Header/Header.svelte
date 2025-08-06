<svelte:options customElement="tosoh-header" />

<script lang="ts">
  import { innerWidth } from "svelte/reactivity/window";
  import NavMobile from "./NavMobile.svelte";
  import NavDesktop from "./NavDesktop.svelte";
</script>

<header>
  {#if innerWidth.current && innerWidth.current < 768}
    <NavMobile>
      <svelte:element this={"slot"} name="logo" slot="logo" />
      <svelte:element this={"slot"} name="cta" slot="cta" />
      <svelte:element this={"slot"} name="search" slot="search" />
    </NavMobile>
  {:else}
    <NavDesktop>
      <svelte:element this={"slot"} name="logo" slot="logo" />
      <svelte:element this={"slot"} name="cta" slot="cta" />
      <svelte:element this={"slot"} name="search" slot="search" />
    </NavDesktop>
  {/if}
</header>

<style lang="postcss">
  :host {
    position: fixed;
    top: 0;
    left: 0;
    z-index: 1000;
    width: 100%;
  }

  * {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
  }

  header {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 100%;
    height: 4.5rem;
    max-width: var(--page-max-width);
    padding: 0 var(--space-lg);
    margin: 0 auto;
    background: var(--color-petrol);

    @media (min-width: 768px) {
      justify-content: space-between;
      height: 8rem;
      gap: var(--space-md);
      padding: 0 var(--space-2xl);
    }
  }
</style>
