<svelte:options customElement="tosoh-header" />

<script lang="ts">
  import { innerWidth } from 'svelte/reactivity/window';
  import NavDesktop from './NavDesktop.svelte';
  import NavMobile from './NavMobile.svelte';

  const MOBILE_BREAKPOINT = 768;

  let headerRef: HTMLElement;
  let { fixed } = $props();
  let isScrolled = $state(false);

  function handleScroll() {
    if (!headerRef || !fixed) return;
    const headerHeight = headerRef.clientHeight;
    isScrolled = window.scrollY > headerHeight / 2;
  }
</script>

<svelte:window on:scroll={handleScroll} />

<header bind:this={headerRef} class:scrolled={isScrolled} class:fixed>
  {#if innerWidth.current && innerWidth.current < MOBILE_BREAKPOINT}
    <div class="mobile">
      <NavMobile />
    </div>
  {:else}
    <div class="desktop">
      <NavDesktop />
    </div>
  {/if}
</header>

<style lang="postcss">
  * {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
  }

  header {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    background: var(--color-white);
    z-index: var(--z-index-header);
    transition: background 150ms ease-in-out;

    &.fixed {
      position: fixed;
    }

    &.scrolled {
    }

    div.mobile {
      display: block;

      @media (min-width: 768px) {
        display: none;
      }
    }

    div.desktop {
      display: none;

      @media (min-width: 768px) {
        display: block;
      }
    }
  }
</style>
