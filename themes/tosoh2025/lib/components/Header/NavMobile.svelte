<script lang="ts">
  import { fade, slide, fly } from 'svelte/transition';
  import { onMount } from 'svelte';

  type MenuItem = {
    label: string;
    url?: string;
    children?: MenuItem[];
  };

  type Menu = {
    children?: MenuItem[];
  };

  let menu: Menu = $state((window as any)?.Tosoh?.Header?.mainNavigationMenu || {});
  let isMenuOpen = $state(false);
  let expandedItems: Set<string> = $state(new Set());

  onMount(() => {
    function handleKeydown(event: KeyboardEvent) {
      if (event.key === 'Escape' && isMenuOpen) {
        closeMenu();
      }
    }
    window.addEventListener('keydown', handleKeydown);
    return () => window.removeEventListener('keydown', handleKeydown);
  });

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

  function hasChildren(item: MenuItem): boolean {
    return !!(item.children && item.children.length > 0);
  }

  function handleLinkClick() {
    closeMenu();
  }

  function getItemPath(indices: number[]): string {
    return indices.join('-');
  }
</script>

{#snippet navItem(item: MenuItem, indices: number[] = [], level: number = 1)}
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
            class="icon"
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
            <div class="aux">
              <svelte:element this={'slot'} name="aux" />
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
      </div>
    </div>
  {/if}
</div>

<style lang="postcss">
  * {
    box-sizing: border-box;
  }

  /* Global focus styles - very light */
  button:focus,
  a:focus {
    outline: 1px solid rgba(237, 26, 59, 0.1);
    outline-offset: 1px;
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
    border-bottom: 1px solid var(--color-off-white);

    > div {
      display: flex;
      flex-direction: column;
    }

    .logo {
      display: flex;
      align-items: center;
      text-decoration: none;
    }

    .aux {
      margin-top: var(--spacing-sm);
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
          background: var(--color-stone-gray);
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
      width: 2.5rem;
      aspect-ratio: 1 / 1;

      svg {
        width: 2.5rem;
        height: 2.5rem;
        stroke: var(--color-stone-gray);
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
    z-index: 9999;

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
      @media (max-width: 480px) {
        width: 100vw;
      }
    }
  }

  /* Navigation */
  .navigation {
    padding: var(--spacing-sm) 0;

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
      border-bottom: 1px solid var(--color-off-white);

      &:last-child {
        border-bottom: none;
      }

      .content {
        display: flex;
        align-items: center;
        justify-content: space-between;
        min-height: 3rem;
        padding: 0 var(--spacing-md);

        .link,
        .label {
          flex: 1;
          display: block;
          padding: var(--spacing-sm) 0;
          color: var(--color-text, #333);
          text-decoration: none;
          font-family: var(--font-sans);
          line-height: 1.4;
          transition: all 200ms ease-in-out;

          &:hover {
            color: var(--color-imperial-red);
            background: var(--color-off-white);
          }
        }

        .label {
          font-weight: 500;
        }

        /* Expand Button */
        .expand {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 2rem;
          height: 2rem;
          color: white;
          background: var(--color-imperial-red);
          border: none;
          border-radius: 0.5rem;
          cursor: pointer;
          transition: all 200ms ease-in-out;

          &:hover {
            box-shadow: inset 0 0 0 1px rgba(0, 0, 0, 0.1);
            background: color-mix(in srgb, var(--color-imperial-red) 85%, black);
          }

          &:focus {
            outline: 1px solid rgba(237, 26, 59, 0.1);
            outline-offset: -1px;
          }

          .icon {
            transition: transform 200ms var(--ease-tosoh);

            &.expanded {
              transform: rotate(90deg);
            }
          }
        }
      }

      /* Level-specific styling */
      &.level-1 {
        .link,
        .label {
          font-size: 1rem;
          font-weight: 500;
        }
      }

      &.level-2 {
        background: var(--color-light-gray);

        .link,
        .label {
          padding-left: calc(var(--spacing-base) * 2);
          font-size: 0.95rem;
          font-weight: 400;
        }
      }

      &.level-3 {
        background: var(--color-off-white);

        .link,
        .label {
          padding-left: calc(var(--spacing-base) * 3);
          font-size: 0.9rem;
          font-weight: 400;
          color: #666;

          &:hover {
            color: var(--color-imperial-red);
            padding-left: calc(var(--spacing-base) * 3 + 0.25rem);
          }
        }
      }
    }
  }
</style>
