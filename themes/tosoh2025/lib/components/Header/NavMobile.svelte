<script lang="ts">
  import { onDestroy } from "svelte";
  import { on } from "svelte/events";
  import { fade, fly } from "svelte/transition";
  import Search from "../Search/Search.svelte";
  import NavCTA from "./NavCTA.svelte";
  import type { HubSpotMenu, MainNavCTA } from "../../types/hubspot";

  let menu: HubSpotMenu = $state(
    window.IQVIA?.Header?.mainNavigationMenu || {}
  );
  let navCtas: MainNavCTA[] | undefined = $state(
    window.IQVIA?.Header?.mainNavigationCTAs || []
  );

  let isMenuOpen: boolean = $state(false);
  let activeMenuItem: number | null = $state(null);
  let activeFirstLevelItem: number | null = $state(null);
  let activeThirdLevelItem: {
    secondLevelIndex: number;
    thirdLevelIndex: number;
  } | null = $state(null);

  function setActiveMenuItem(index: number | null) {
    activeMenuItem = activeMenuItem === index ? null : index;
    activeFirstLevelItem = null;
    activeThirdLevelItem = null;
  }

  function setActiveSubmenuItem(index: number | null) {
    activeFirstLevelItem = activeFirstLevelItem === index ? null : index;
    activeThirdLevelItem = null;
  }

  function setActiveThirdLevelItem(
    secondLevelIndex: number,
    thirdLevelIndex: number
  ) {
    const currentKey = activeThirdLevelItem
      ? `${activeThirdLevelItem.secondLevelIndex}-${activeThirdLevelItem.thirdLevelIndex}`
      : null;
    const newKey = `${secondLevelIndex}-${thirdLevelIndex}`;

    activeThirdLevelItem =
      currentKey === newKey ? null : { secondLevelIndex, thirdLevelIndex };
  }

  function openMenu() {
    isMenuOpen = true;

    window.dispatchEvent(
      new CustomEvent("MenuOpen", {
        bubbles: true,
      })
    );
  }

  function closeMenu() {
    isMenuOpen = false;
    activeMenuItem = null;
    activeFirstLevelItem = null;
    activeThirdLevelItem = null;
  }

  function hasChildren(item: HubSpotMenu): boolean {
    return Boolean(item.children?.length);
  }

  function hasChildrenWithCTA(
    item: HubSpotMenu,
    i: number,
    k?: number
  ): boolean {
    if (item.children?.length) return true;
    if (typeof k === "number") {
      return Boolean(
        navCtas?.some((cta) =>
          cta.indices?.some((idx) => idx.index === i && idx.subIndex === k)
        )
      );
    }
    return false;
  }

  function getNavCtasForThirdLevel(
    menuIndex: number,
    submenuIndex: number
  ): MainNavCTA[] {
    return (
      navCtas?.filter((cta) =>
        cta.indices?.some(
          (idx) => idx.index === menuIndex && idx.subIndex === submenuIndex
        )
      ) ?? []
    );
  }

  const searchOpenHandler = on(window, "SearchOpen", closeMenu);
  const keydownHandler = on(window, "keydown", (e: KeyboardEvent) => {
    if (e.key === "Escape") {
      if (activeThirdLevelItem !== null) activeThirdLevelItem = null;
      else if (activeFirstLevelItem !== null) setActiveSubmenuItem(null);
      else if (activeMenuItem !== null) setActiveMenuItem(null);
      else closeMenu();
    }
  });

  onDestroy(() => {
    searchOpenHandler?.();
    keydownHandler?.();
  });
</script>

{#snippet navItem(item: HubSpotMenu, level = 1, parentIndex?: number)}
  {#if level === 1 && hasChildren(item)}
    <button onclick={() => setActiveMenuItem(parentIndex ?? 0)}>
      <span>{@html item.label}</span>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="16"
        height="16"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
      >
        <polyline points="9,18 15,12 9,6"></polyline>
      </svg>
    </button>
  {:else if item.url}
    <a href={item.url}><span>{@html item.label}</span></a>
  {:else}
    <span>{@html item.label}</span>
  {/if}
{/snippet}

{#snippet submenuContent(item: HubSpotMenu, parentIndex: number)}
  <div class="breadcrumbs">
    <button onclick={() => setActiveMenuItem(null)} class="back">
      <span>Main</span>
    </button>
    <span>/</span>
    <span>{@html item.label}</span>
    {#if item.url}
      <a
        href={item.url}
        class="breadcrumb-link"
        aria-label="Visit {item.label} page"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="12"
          height="12"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
        >
          <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"
          ></path>
          <polyline points="15,3 21,3 21,9"></polyline>
          <line x1="10" y1="14" x2="21" y2="3"></line>
        </svg>
      </a>
    {/if}
  </div>

  <div class="content">
    {#if item.children?.length}
      <ul>
        {#each item.children as secondLevel, j}
          <li>
            {@render navItem(secondLevel, 2)}
            {#if secondLevel.children?.length}
              <ul class="third-level">
                {#each secondLevel.children as thirdLevel, k}
                  <li
                    class:has-children={hasChildrenWithCTA(
                      thirdLevel as HubSpotMenu,
                      parentIndex,
                      k
                    )}
                  >
                    {#if hasChildrenWithCTA(thirdLevel as HubSpotMenu, parentIndex, k)}
                      <button onclick={() => setActiveThirdLevelItem(j, k)}>
                        <span>
                          {@html (thirdLevel as HubSpotMenu).label}
                        </span>
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="16"
                          height="16"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          stroke-width="2"
                          stroke-linecap="round"
                          stroke-linejoin="round"
                        >
                          <polyline points="9,18 15,12 9,6"></polyline>
                        </svg>
                      </button>
                    {:else}
                      {@render navItem(thirdLevel as HubSpotMenu, 3)}
                    {/if}
                  </li>
                {/each}
              </ul>
            {/if}
          </li>
        {/each}
      </ul>
    {/if}
  </div>
{/snippet}

{#snippet thirdLevelSubmenuContent(item: HubSpotMenu, parentItem: HubSpotMenu)}
  <div class="breadcrumbs">
    <button onclick={() => (activeThirdLevelItem = null)} class="back">
      <span>{@html parentItem.label}</span>
    </button>
    <span>/</span>
    <span>{@html item.label}</span>
    {#if item.url}
      <a
        href={item.url}
        class="breadcrumb-link"
        aria-label="Visit {item.label} page"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="12"
          height="12"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
        >
          <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"
          ></path>
          <polyline points="15,3 21,3 21,9"></polyline>
          <line x1="10" y1="14" x2="21" y2="3"></line>
        </svg>
      </a>
    {/if}
  </div>

  <div class="content">
    {#if activeMenuItem !== null && activeThirdLevelItem?.thirdLevelIndex !== undefined && getNavCtasForThirdLevel(activeMenuItem, activeThirdLevelItem.thirdLevelIndex).length}
      <div class="nav-ctas">
        {#each getNavCtasForThirdLevel(activeMenuItem, activeThirdLevelItem.thirdLevelIndex) as cta}
          <NavCTA {cta} isMobile={true} />
        {/each}
      </div>
    {/if}
    {#if item.children?.length}
      <ul>
        {#each item.children as fourthLevel}
          <li>
            {@render navItem(fourthLevel, 4)}
            {#if fourthLevel.children?.length}
              <ul class="fifth-level">
                {#each fourthLevel.children as fifthLevel}
                  <li>
                    {@render navItem(fifthLevel, 5)}
                  </li>
                {/each}
              </ul>
            {/if}
          </li>
        {/each}
      </ul>
    {/if}
  </div>
{/snippet}

<div class="wrapper">
  <a class="logo" href="/" aria-label="Home">
    <svelte:element this={"slot"} name="logo" />
  </a>

  <div class="actions">
    <Search />
    <div class="divider"></div>
    <div class="menu">
      {#if !isMenuOpen}
        <button
          transition:fly={{ duration: 300, x: "-1.5rem" }}
          onclick={openMenu}
          aria-label="Open menu"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 100 67"
            fill="currentColor"
          >
            <rect width="100" height="8" />
            <rect y="59" width="100" height="8" />
            <rect y="29.5" width="100" height="8" />
          </svg>
        </button>
      {:else}
        <button
          onclick={closeMenu}
          aria-label="Close menu"
          transition:fly={{ duration: 300, x: "-1.5rem" }}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="100%"
            height="100%"
            viewBox="0 0 100 100"
          >
            <line
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="8"
              stroke="currentColor"
              x1="20"
              y1="20"
              x2="80"
              y2="80"
            ></line>
            <line
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="8"
              stroke="currentColor"
              x1="80"
              y1="20"
              x2="20"
              y2="80"
            ></line>
          </svg>
        </button>
      {/if}
    </div>
  </div>
</div>

{#if menu && isMenuOpen}
  <nav
    aria-label="Main navigation"
    transition:fly={{ x: "2rem", duration: 300 }}
  >
    <svelte:element this={"slot"} name="cta" />
    <hr />
    <ul transition:fade={{ duration: 200, delay: 200 }}>
      {#each menu.children ?? [] as item, i}
        <li>
          {@render navItem(item, 1, i)}
        </li>
      {/each}
    </ul>
  </nav>
{/if}

{#if menu && isMenuOpen && activeMenuItem !== null}
  <aside
    class="first-level-submenu"
    transition:fly={{ x: "2rem", duration: 300 }}
    aria-label="Submenu navigation"
  >
    {@render submenuContent(
      menu.children?.[activeMenuItem] as HubSpotMenu,
      activeMenuItem
    )}
  </aside>
{/if}

{#if menu && isMenuOpen && activeMenuItem !== null && activeThirdLevelItem !== null}
  <aside
    class="third-level-submenu"
    transition:fly={{ x: "2rem", duration: 300 }}
    aria-label="Third level submenu navigation"
  >
    {@render thirdLevelSubmenuContent(
      (menu.children?.[activeMenuItem] as HubSpotMenu).children?.[
        activeThirdLevelItem.secondLevelIndex
      ]?.children?.[activeThirdLevelItem.thirdLevelIndex] as HubSpotMenu,
      menu.children?.[activeMenuItem] as HubSpotMenu
    )}
  </aside>
{/if}

<style lang="postcss">
  * {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
  }

  button {
    all: unset;
    color: var(--color-cream);
    cursor: pointer;
    outline: none;
    -webkit-tap-highlight-color: transparent;
    -webkit-touch-callout: none;
    -webkit-user-select: none;
    user-select: none;
  }

  .wrapper {
    position: relative;
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: var(--space);
    width: 100%;
    max-width: var(--page-max-width);
    height: var(--iqvia-header-height);
    padding: var(--space-sm) var(--space-md);
    margin: 0 auto;
  }

  .actions {
    flex: none;
    display: flex;
    align-items: center;
    gap: var(--space-md);
    color: var(--color-white);

    > div.divider {
      width: 1px;
      height: 3rem;
      background: var(--color-iqvia-light-blue);
    }

    > div.menu {
      position: relative;
      width: 3rem;
      height: 3rem;

      > button {
        position: absolute;
        top: 50%;
        left: 40%;
        transform: translate(-50%, -50%);
        margin-top: 0.1rem;

        > svg {
          width: 2rem;
          height: 2rem;
        }
      }
    }
  }

  a.logo {
    display: flex;
    width: 10rem;
  }

  nav {
    position: absolute;
    top: var(--iqvia-header-height);
    right: 0;
    z-index: 1000;
    display: flex;
    flex-direction: column;
    gap: var(--space-md);
    width: 36rem;
    max-width: 100%;
    height: 36rem;
    background: var(--color-iqvia-white);
    padding-top: var(--space-md);
    overflow-y: auto;
    will-change: opacity, transform;

    slot[name="cta"]::slotted(*) {
      width: calc(100% - var(--space-xl)) !important;
      margin: 0 auto !important;
    }

    hr {
      border: none;
      border-top: 1px solid var(--color-iqvia-light-gray);
    }

    a {
      text-decoration: none;
    }

    ul {
      height: 100%;
      padding: 0 var(--space-lg) var(--space-lg);
      list-style: none;
    }

    /* First-level navigation items */
    > ul > li {
      > a,
      > span,
      > button {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: var(--space);
        width: 100%;
        padding-block: var(--space-sm);
        font-size: var(--font-size-md);
        color: var(--color-iqvia-blue);
        border: none;
        background: none;
        text-align: left;
        cursor: pointer;

        > svg {
          flex-shrink: 0;
          opacity: 0.6;
        }
      }

      > button:hover {
        color: var(--color-iqvia-blue);
      }
    }
  }

  /* Shared link styles for submenus */
  .first-level-submenu,
  .third-level-submenu {
    position: absolute;
    top: var(--iqvia-header-height);
    right: 0;
    display: flex;
    flex-direction: column;
    width: 36rem;
    max-width: 100%;
    height: 36rem;
    overflow-y: auto;
    will-change: opacity, transform;

    a {
      text-decoration: none;
    }

    > .content {
      padding: 0 var(--space-lg) var(--space-md);
      overflow-y: auto;

      > ul {
        display: flex;
        flex-direction: column;
        gap: var(--space);
        list-style: none;

        > li {
          color: var(--color-text);

          a,
          span {
            color: inherit;
          }

          > a,
          > span {
            display: block;
            margin-bottom: var(--space-sm);
            font-size: var(--font-size-md);
            font-weight: 600;
            text-transform: uppercase;
          }
        }
      }
    }

    /* Shared nested list link styles */
    ul.third-level,
    ul.fifth-level {
      display: flex;
      flex-direction: column;
      gap: var(--space-sm);
      list-style: none;

      > li {
        > a,
        > span {
          font-size: var(--font-size);
          border-bottom: none;
        }

        > a {
          color: var(--color-iqvia-light-blue);
          text-decoration: underline;
          text-decoration-color: transparent;
          transition:
            color 0.2s ease,
            text-decoration-color 0.2s ease;

          &:hover {
            color: var(--color-iqvia-blue);
            text-decoration-color: var(--color-iqvia-blue);
          }
        }

        &.has-children > a,
        &.has-children > span,
        &.has-children > button {
          cursor: pointer;
          color: var(--color-text);

          &:hover {
            color: var(--color-text);
          }
        }

        &.has-children > button {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: var(--space);
          background: none;
          border: none;
          width: 100%;
          text-align: left;
          font-size: var(--font-size);
          font-weight: 500;
          color: var(--color-text);
          cursor: pointer;

          > svg {
            flex-shrink: 0;
            opacity: 0.6;
          }

          &:hover {
            color: var(--color-text);
          }
        }
      }
    }

    /* Shared breadcrumb styles */
    .breadcrumbs {
      display: flex;
      gap: var(--space-xs);
      padding: var(--space-md) var(--space-lg);

      .back {
        display: flex;
        align-items: center;
        background: none;
        border: none;
        color: var(--color-iqvia-blue);
      }

      .breadcrumb-link {
        display: flex;
        align-items: center;
        color: var(--color-iqvia-blue);
        opacity: 0.7;
        transition: opacity 0.2s ease;

        &:hover {
          opacity: 1;
        }

        svg {
          width: 12px;
          height: 12px;
        }
      }

      span {
        font-size: var(--font-size-xs);
        text-transform: uppercase;
        font-weight: 600;
      }
    }
  }

  /* First Level Submenu - specific styles */
  .first-level-submenu {
    z-index: 1001;
    background: var(--color-iqvia-white);

    .breadcrumbs {
      align-items: center;
    }
  }

  /* Third Level Submenu - specific styles */
  .third-level-submenu {
    z-index: 1002;
    background: var(--color-iqvia-white);

    .breadcrumbs {
      align-items: flex-start;
      flex-wrap: wrap;

      .back {
        flex-shrink: 0;
      }

      > span {
        line-height: 1.4;
        word-break: break-word;
        flex: 1;
        min-width: 0;
      }

      > span:first-of-type {
        flex: none;
      }
    }
  }

  /* NavCTA Styles */
  .nav-ctas {
    display: flex;
    flex-direction: column;
    gap: var(--space-md);
    margin-bottom: var(--space-md);
  }
</style>
