<script lang="ts">
  import { fade, slide } from 'svelte/transition';
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
      <div class="hamburger-icon" class:open={isMenuOpen}>
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
        transition:slide={{ duration: 300, axis: 'x' }}
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
            <svg
              width="20"
              height="20"
              viewBox="0 0 20 20"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M15 5L5 15M5 5L15 15"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
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
    padding: var(--spacing-xs) var(--spacing-base);
    background: white;
    border-bottom: 1px solid var(--color-off-white);

    > div {
      display: flex;
      flex-direction: column;
    }
  }

  .logo {
    display: flex;
    align-items: center;
    text-decoration: none;
  }

  /* Hamburger Button */
  .hamburger {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 3rem;
    height: 3rem;
    padding: 0;
    background: transparent;
    border: none;
    cursor: pointer;
    border-radius: 0.25rem;
    transition: background-color 200ms ease-in-out;

    &:hover {
      background: var(--color-off-white);
    }

    &:focus {
      outline: 2px solid var(--color-imperial-red);
      outline-offset: 2px;
    }
  }

  .hamburger-icon {
    display: flex;
    flex-direction: column;
    width: 2rem;
    height: 1.5rem;
    position: relative;

    span {
      display: block;
      width: 100%;
      height: 3px;
      background: var(--color-imperial-red);
      border-radius: 1.5px;
      transition: all 300ms var(--ease-tosoh);
      transform-origin: center;

      &:nth-child(1) {
        margin-bottom: 0.375rem;
      }

      &:nth-child(2) {
        margin-bottom: 0.375rem;
      }
    }

    &.open {
      span:nth-child(1) {
        transform: translateY(0.5rem) rotate(45deg);
      }

      span:nth-child(2) {
        opacity: 0;
        transform: scaleX(0);
      }

      span:nth-child(3) {
        transform: translateY(-0.5rem) rotate(-45deg);
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
    backdrop-filter: blur(2px);
  }

  .menu {
    position: absolute;
    top: 0;
    right: 0;
    width: min(85vw, 24rem);
    height: 100vh;
    background: white;
    box-shadow: -0.5rem 0 2rem rgba(0, 0, 0, 0.2);
    overflow-y: auto;
    overscroll-behavior: contain;
  }

  /* Menu Header */
  .header {
    padding: var(--spacing-base);
    border-bottom: 1px solid var(--color-off-white);
    background: var(--color-light-gray);
  }

  .cta {
    margin-bottom: var(--spacing-sm);
  }

  .aux {
    display: flex;
    justify-content: flex-end;
  }

  /* Navigation */
  .navigation {
    padding: var(--spacing-sm) 0;
  }

  .menu-list,
  .submenu {
    list-style: none;
    margin: 0;
    padding: 0;
  }

  .item {
    border-bottom: 1px solid var(--color-off-white);

    &:last-child {
      border-bottom: none;
    }
  }

  .content {
    display: flex;
    align-items: center;
    justify-content: space-between;
    min-height: 3rem;
  }

  .link,
  .label {
    flex: 1;
    display: block;
    padding: var(--spacing-sm) var(--spacing-base);
    color: var(--color-text, #333);
    text-decoration: none;
    font-size: var(--font-size-base);
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

  /* Level-specific styling */
  .level-1 {
    .link,
    .label {
      font-size: 1rem;
      font-weight: 500;
    }
  }

  .level-2 {
    background: var(--color-light-gray);

    .link,
    .label {
      padding-left: calc(var(--spacing-base) * 2);
      font-size: 0.95rem;
      font-weight: 400;
    }
  }

  .level-3 {
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

  /* Expand Button */
  .expand {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 3rem;
    height: 3rem;
    background: transparent;
    border: none;
    cursor: pointer;
    color: var(--color-imperial-red);
    transition: all 200ms ease-in-out;

    &:hover {
      background: var(--color-off-white);
    }

    &:focus {
      outline: 2px solid var(--color-imperial-red);
      outline-offset: -2px;
    }
  }

  .icon {
    transition: transform 200ms var(--ease-tosoh);

    &.expanded {
      transform: rotate(90deg);
    }
  }

  /* Submenu Animation */
  .submenu {
    overflow: hidden;
  }

  /* Mobile-specific optimizations */
  @media (max-width: 480px) {
    .menu {
      width: 100vw;
    }
  }

  /* Ensure proper scrolling on iOS */
  .menu {
    -webkit-overflow-scrolling: touch;
  }

  /* Focus management */
  .overlay:focus-within {
    .menu {
      outline: none;
    }
  }
</style>
