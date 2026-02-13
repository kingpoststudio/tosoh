<script lang="ts">
  import { onDestroy } from 'svelte';
  import { on } from 'svelte/events';
  import { fade, slide, fly } from 'svelte/transition';
  import type { HubSpotMenu } from '../../../types/hubspot';

  let menu: HubSpotMenu = $state((window as any)?.Tosoh?.Header?.mainNavigationMenu || {});
  let auxiliaryMenu: HubSpotMenu = $state((window as any)?.Tosoh?.Header?.auxiliaryMenu || {});
  let isMenuOpen = $state(false);
  let expandedItems: Set<string> = $state(new Set());

  function toggleMenu() {
    isMenuOpen = !isMenuOpen;
    if (isMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
  }

  function closeMenu() {
    isMenuOpen = false;
    document.body.style.overflow = '';
    expandedItems.clear();
  }

  function toggleSubmenu(itemPath: string, event: Event) {
    event.preventDefault();
    event.stopPropagation();

    if (expandedItems.has(itemPath)) {
      expandedItems.delete(itemPath);
    } else {
      expandedItems.add(itemPath);
    }
    expandedItems = new Set(expandedItems);
  }

  function hasChildren(item: HubSpotMenu): boolean {
    return !!(item.children && item.children.length > 0);
  }

  function handleLinkClick() {
    closeMenu();
  }

  function getItemPath(indices: number[]): string {
    return indices.join('-');
  }

  const keydownHandler = on(window, 'keydown', (e: KeyboardEvent) => {
    if (e.key === 'Escape') {
      isMenuOpen = false;
    }
  });

  onDestroy(() => {
    keydownHandler();
  });
</script>

{#snippet navItem(item: HubSpotMenu, indices: number[] = [], level: number = 1)}
  <li class="item level-{level}">
    <div class="content">
      {#if item.url}
        <a href={item.url} class="link" onclick={handleLinkClick}>
          {@html item.label}
        </a>
      {:else}
        <span class="label">{@html item.label}</span>
      {/if}

      {#if hasChildren(item)}
        {@const itemPath = getItemPath(indices)}
        <button
          class="expand"
          onclick={(e) => toggleSubmenu(itemPath, e)}
          aria-expanded={expandedItems.has(itemPath)}
          aria-label="Toggle submenu for {item.label}"
        >
          <svg
            class:expanded={expandedItems.has(itemPath)}
            width="16"
            height="16"
            viewBox="0 0 16 16"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M6 12L10 8L6 4"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
          </svg>
        </button>
      {/if}
    </div>

    {#if hasChildren(item) && expandedItems.has(getItemPath(indices))}
      <ul class="submenu level-{level + 1}" transition:slide={{ duration: 200 }}>
        {#each item.children ?? [] as childItem, childIndex}
          {@render navItem(childItem, [...indices, childIndex], level + 1)}
        {/each}
      </ul>
    {/if}
  </li>
{/snippet}

<div class="wrapper">
  <div class="header">
    <a class="logo" href="/" aria-label="Home" onclick={closeMenu}>
      <svelte:element this={'slot'} name="logo" />
    </a>

    <button
      class="hamburger"
      onclick={toggleMenu}
      aria-expanded={isMenuOpen}
      aria-label="Toggle navigation menu"
    >
      <div class:open={isMenuOpen}>
        <span></span>
        <span></span>
        <span></span>
      </div>
    </button>
  </div>

  {#if isMenuOpen}
    <div
      class="overlay"
      transition:fade={{ duration: 200 }}
      onclick={closeMenu}
      onkeydown={(e) => e.key === 'Enter' && closeMenu()}
      role="button"
      tabindex="0"
      aria-label="Close menu"
    >
      <div
        class="menu"
        transition:fly={{ duration: 300, x: -300 }}
        onclick={(e) => e.stopPropagation()}
        onkeydown={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-label="Navigation menu"
        tabindex="-1"
      >
        <div class="header">
          <div>
            <div class="cta">
              <svelte:element this={'slot'} name="cta" />
            </div>
          </div>
          <button class="close" onclick={closeMenu} aria-label="Close menu">
            <svg viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M15 5L5 15M5 5L15 15" />
            </svg>
          </button>
        </div>

        <!-- Main Navigation -->
        <nav class="navigation" aria-label="Main navigation">
          {#if menu}
            <ul class="menu-list">
              {#each menu.children ?? [] as item, index}
                {@render navItem(item, [index], 1)}
              {/each}
            </ul>
          {/if}
        </nav>

        {#if auxiliaryMenu && auxiliaryMenu?.children && auxiliaryMenu?.children?.length > 0}
          <div class="aux">
            {#each auxiliaryMenu.children ?? [] as item}
              <a href={item.url} class="link">{@html item.label}</a>
            {/each}
          </div>
        {/if}
      </div>
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
    width: 100%;
  }

  /* Header Bar */
  .header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    width: 100%;
    min-height: 5.5rem;
    padding: var(--spacing-sm) var(--spacing-md);
    box-shadow: 0 0 0.25rem rgba(0, 0, 0, 0.1);

    > div {
      display: flex;
      flex-direction: column;
    }

    .logo {
      flex: none;
      display: flex;
      align-items: center;
      text-decoration: none;
    }

    /* Hamburger Button */
    .hamburger {
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 0;
      background: transparent;
      border: none;
      cursor: pointer;
      transition: background-color 200ms ease-in-out;

      > div {
        position: relative;
        display: flex;
        flex-direction: column;
        justify-content: center;
        gap: 0.3rem;
        width: 2.5rem;
        padding: 0.25rem;
        aspect-ratio: 1 / 1;

        span {
          display: block;
          width: 100%;
          height: 0.2rem;
          background: var(--color-zinc-800);
        }
      }
    }

    /* Close Button */
    .close {
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 0;
      background: transparent;
      border: none;
      cursor: pointer;
      transition: background-color 200ms ease-in-out;
      width: 2.25rem;
      aspect-ratio: 1 / 1;

      svg {
        width: 2.25rem;
        height: 2.25rem;
        stroke: var(--color-zinc-800);
        stroke-width: 0.125rem;
      }
    }
  }

  /* Mobile Menu Overlay */
  .overlay {
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    background: rgba(0, 0, 0, 0.5);
    z-index: var(--z-index-overlay);

    &:focus-within {
      .menu {
        outline: none;
      }
    }

    .menu {
      position: absolute;
      top: 0;
      left: 0;
      width: min(85vw, 24rem);
      height: 100vh;
      background: white;
      box-shadow: 0.5rem 0 2rem rgba(0, 0, 0, 0.2);
      overflow-y: auto;
      overscroll-behavior: contain;
      -webkit-overflow-scrolling: touch;

      /* Mobile-specific optimizations */
      @media (max-width: 30rem) {
        width: 100vw;
      }
    }
  }

  /* Navigation */
  .navigation {
    .menu-list,
    .submenu {
      list-style: none;
      margin: 0;
      padding: 0;

      /* Submenu Animation */
      &.submenu {
        overflow: hidden;
      }
    }

    .item {
      border-bottom: 1px solid var(--color-zinc-200);

      &:first-child {
        border-top: 1px solid var(--color-zinc-200);
      }

      &:last-child:not(.level-1) {
        border-bottom: none;
      }

      .content {
        display: flex;
        align-items: center;
        justify-content: space-between;

        .link,
        .label {
          flex: 1;
          padding: var(--spacing-sm) 0 var(--spacing-sm) var(--spacing-md);
          font-family: var(--font-sans);
          font-size: 0.95rem;
          line-height: 1.4;
          color: inherit;
          text-decoration: none;
          transition:
            color 200ms ease-in-out,
            background 200ms ease-in-out;

          &:hover {
            color: var(--color-imperial-red);
            background: var(--color-white);
          }
        }

        /* Expand Button */
        .expand {
          position: absolute;
          right: var(--spacing-base);
          display: flex;
          align-items: center;
          justify-content: center;
          height: 2rem;
          aspect-ratio: 1 / 1;
          color: var(--color-zinc-800);
          background: var(--color-white);
          border: 0.125rem solid var(--color-zinc-100);
          border-radius: 0.5rem;
          cursor: pointer;
          transition: background 200ms ease-in-out;

          svg {
            transition: transform 200ms ease-in-out;

            &.expanded {
              transform: rotate(90deg);
            }
          }
        }
      }

      &.level-2 {
        .link,
        .label {
          padding-left: calc(var(--spacing-base) * 3);
          padding-right: calc(var(--spacing-base) * 3);

          background: var(--color-zinc-100);
        }
      }

      &.level-3 {
        .link,
        .label {
          padding-left: calc(var(--spacing-base) * 4);
          padding-right: calc(var(--spacing-base) * 4);
        }
      }
    }
  }

  .aux {
    margin-top: var(--spacing-sm);
    display: flex;
    flex-direction: column;
    padding-left: var(--spacing-md);
    > a {
      padding-block: var(--spacing-xs);
      color: var(--color-imperial-red);
      text-decoration: none;
      font-size: 0.95rem;
      transition: color 200ms ease-in-out;
      &:hover {
        color: var(--color-black-charcoal);
      }
    }
  }
</style>
