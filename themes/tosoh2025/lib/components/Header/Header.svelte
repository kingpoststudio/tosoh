<svelte:options customElement="tosoh-header" />

<script lang="ts">
  import { innerWidth } from 'svelte/reactivity/window';
  import NavMobile from './NavMobile.svelte';
  import NavDesktop from './NavDesktop.svelte';

  const MOBILE_BREAKPOINT = 768;
</script>

<header>
  {#if innerWidth.current && innerWidth.current < MOBILE_BREAKPOINT}
    <NavMobile />
  {:else}
    <NavDesktop />
  {/if}
</header>

<style lang="postcss">
  :host {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    z-index: var(--z-index-header);
  }

  * {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
  }

  header {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    background: var(--color-white);
    z-index: var(--z-index-header);
    transition: background 150ms ease-in-out;
  }
</style>
