<script lang="ts">
  import { on } from "svelte/events";
  import { fade, fly, slide } from "svelte/transition";
  import type { HubSpotMenu, MainNavCTA } from "../../../types/hubspot";

  let menu: HubSpotMenu | undefined = window.Tosoh?.mainNavigationMenu;
  let navCtas: MainNavCTA[] | undefined = window.Tosoh?.mainNavigationCTAs;

  let isMenuOpen: boolean = $state(false);
  let activeMenuItem: number | null = $state(null);
  let activeSubmenuItem: number | null = $state(null);

  function setActiveMenuItem(index: number) {
    activeMenuItem = activeMenuItem === index ? null : index;
  }

  function setActiveSubmenuItem(index: number) {
    activeSubmenuItem = activeSubmenuItem === index ? null : index;
  }

  function closeMenu() {
    isMenuOpen = false;
    activeMenuItem = null;
    activeSubmenuItem = null;
  }

  function hasChildren(item: HubSpotMenu, i: number, k?: number) {
    if (item.children?.length) return true;
    if (typeof k === "number") {
      return navCtas?.some(
        (cta) => cta.menuIndex === i && cta.submenuIndex === k
      );
    }
    return navCtas?.some(
      (cta) => cta.menuIndex === i && cta.submenuIndex == null
    );
  }

  on(window, "keydown", (e: KeyboardEvent) => {
    if (e.key === "Escape") {
      isMenuOpen = false;
    }
  });
</script>

{#snippet navCta(cta: MainNavCTA)}
  <div class={["nav-cta", `bg-${cta.bgColor}`]}>
    {#if cta.image?.src}
      <div
        class={[
          "eyebrow",
          cta.imageVariant,
          !cta.title &&
            !cta.description &&
            !cta.link &&
            !cta.linkLabel &&
            "large",
        ]}
      >
        <img src={cta.image.src} alt={cta.image.alt || cta.title} />
      </div>
    {/if}
    {#if cta.title}
      <h4>{cta.title}</h4>
    {/if}
    {#if cta.description}
      <p>{cta.description}</p>
    {/if}
    {#if cta.link && cta.linkLabel}
      <a
        href={cta.link.url.href}
        target={cta.link.open_in_new_tab ? "_blank" : "_self"}
        >{cta.linkLabel}</a
      >
    {/if}
  </div>
{/snippet}

{#snippet navItem(item: HubSpotMenu)}
  {#if item.url}
    <a href={item.url} target={item.linkTarget || "_self"}>{item.label}</a>
  {:else}
    <span>{item.label}</span>
  {/if}
{/snippet}

{#if menu}
  {#if !isMenuOpen}
    <div class="actions" transition:fly={{ duration: 300, x: "-8rem" }}>
      <button onclick={() => (isMenuOpen = !isMenuOpen)} aria-label="Open menu">
        <svg
          width="3rem"
          viewBox="0 0 52 28"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <rect x="2" y="3" width="48" height="2" fill="currentColor" />
          <rect x="2" y="13" width="40" height="2" fill="currentColor" />
          <rect x="2" y="23" width="32" height="2" fill="currentColor" />
        </svg>
      </button>
      <svelte:element this={"slot"} name="search" />
    </div>
  {:else if menu.children && activeMenuItem !== null}
    <div class="actions" transition:fly={{ duration: 300, x: "-8rem" }}>
      <button
        onclick={() => (activeMenuItem = null)}
        aria-label="Close submenu"
      >
        <svg
          width="0.75rem"
          viewBox="0 0 10 16"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M9 1L1 8L9 15"
            stroke="currentColor"
            stroke-linecap="square"
          />
        </svg>
        {menu.children[activeMenuItem].label}
      </button>
    </div>
  {/if}
{/if}

{#if !isMenuOpen}
  <a
    class="logo"
    href="/"
    aria-label="Home"
    transition:fade={{ duration: 200 }}
  >
    <svelte:element this={"slot"} name="logo" />
  </a>
{/if}

{#if menu && isMenuOpen}
  <nav
    transition:fly={{ duration: 300, x: "-100vw", opacity: 1 }}
    aria-label="Main navigation"
  >
    <ul transition:fade={{ duration: 200, delay: 300 }}>
      {#each menu.children ?? [] as item, i}
        <li class:has-children={hasChildren(item, i)}>
          {#if hasChildren(item, i)}
            <button onclick={() => setActiveMenuItem(i)}>
              {@render navItem(item)}
            </button>
          {:else}
            {@render navItem(item)}
          {/if}

          {#if activeMenuItem === i && hasChildren(item, i)}
            <ul transition:fly={{ duration: 300, x: "100vw", opacity: 1 }}>
              {#each item.children ?? [] as secondLevel, j}
                <li>
                  {@render navItem(secondLevel)}
                  {#if secondLevel.children && secondLevel.children.length}
                    {#if j === 0}
                      <ul>
                        {#each secondLevel.children as thirdLevel, k}
                          <li
                            class={[
                              hasChildren(thirdLevel, i, k) && "has-children",
                              activeSubmenuItem === k && "active",
                            ]}
                          >
                            {#if hasChildren(thirdLevel, i, k)}
                              <button onclick={() => setActiveSubmenuItem(k)}>
                                <span>{thirdLevel.label}</span>
                              </button>
                            {:else}
                              {@render navItem(thirdLevel)}
                            {/if}
                            {#if activeSubmenuItem === k}
                              <ul
                                transition:slide={{
                                  duration: 300,
                                }}
                              >
                                {#if hasChildren(thirdLevel, i, k)}
                                  <li>
                                    {@render navItem(thirdLevel)}
                                  </li>
                                {/if}
                                {#each thirdLevel.children ?? [] as fourthLevel}
                                  <li>
                                    {@render navItem(fourthLevel)}
                                    {#if fourthLevel.children?.length}
                                      <ul>
                                        {#each fourthLevel.children as fifthLevel}
                                          <li>
                                            {@render navItem(fifthLevel)}
                                          </li>
                                        {/each}
                                      </ul>
                                    {/if}
                                  </li>
                                {/each}
                                {#each navCtas?.filter((cta) => cta.menuIndex === i && cta.submenuIndex === k) ?? [] as cta}
                                  {@render navCta(cta)}
                                {/each}
                              </ul>
                            {/if}
                          </li>
                        {/each}
                      </ul>
                    {/if}
                  {/if}
                </li>
              {/each}
              {#if navCtas}
                {#each navCtas.filter((cta) => cta.menuIndex === i && cta.submenuIndex == null) as cta}
                  {@render navCta(cta)}
                {/each}
              {/if}
            </ul>
          {/if}
        </li>
      {/each}
    </ul>
    <svelte:element this={"slot"} name="cta" />
  </nav>
{/if}

{#if isMenuOpen}
  <div class="close" transition:fly={{ duration: 300, x: "8rem" }}>
    <button onclick={closeMenu} aria-label="Close menu">
      <svg
        width="2rem"
        viewBox="0 0 28 28"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          fill-rule="evenodd"
          clip-rule="evenodd"
          d="M20.8286 7.17135C20.883 7.22553 20.9261 7.2899 20.9555 7.36076C20.9849 7.43162 21 7.50758 21 7.5843C21 7.66102 20.9849 7.73699 20.9555 7.80785C20.9261 7.87871 20.883 7.94307 20.8286 7.99725L7.99723 20.829C7.88771 20.9385 7.73917 21 7.58429 21C7.42941 21 7.28087 20.9385 7.17135 20.829C7.06183 20.7194 7.00031 20.5709 7.00031 20.416C7.00031 20.2611 7.06183 20.1126 7.17135 20.0031L20.0028 7.17135C20.057 7.11704 20.1213 7.07394 20.1922 7.04454C20.263 7.01514 20.339 7 20.4157 7C20.4924 7 20.5684 7.01514 20.6392 7.04454C20.7101 7.07394 20.7745 7.11704 20.8286 7.17135Z"
          fill="#FEFFE3"
        />
        <path
          fill-rule="evenodd"
          clip-rule="evenodd"
          d="M7.17135 7.17135C7.11703 7.22553 7.07394 7.2899 7.04454 7.36076C7.01514 7.43162 7 7.50758 7 7.5843C7 7.66102 7.01514 7.73699 7.04454 7.80785C7.07394 7.87871 7.11703 7.94307 7.17135 7.99725L20.0028 20.829C20.1123 20.9385 20.2608 21 20.4157 21C20.5706 21 20.7191 20.9385 20.8286 20.829C20.9382 20.7194 20.9997 20.5709 20.9997 20.416C20.9997 20.2611 20.9382 20.1126 20.8286 20.0031L7.99723 7.17135C7.94305 7.11704 7.87869 7.07394 7.80783 7.04454C7.73697 7.01514 7.66101 7 7.58429 7C7.50757 7 7.43161 7.01514 7.36075 7.04454C7.28989 7.07394 7.22553 7.11704 7.17135 7.17135Z"
          fill="#FEFFE3"
        />
      </svg>
    </button>
  </div>
{/if}

<style lang="postcss">
  * {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
  }

  button {
    all: unset;
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: var(--space-sm);
    width: 100%;
    color: var(--color-cream);
    cursor: pointer;
  }

  .actions,
  .close {
    position: absolute;
    display: flex;
    align-items: center;
    gap: var(--space);
    will-change: opacity, transform;
  }

  .actions {
    left: var(--space-md);
  }

  .close {
    right: var(--space-md);
  }

  a.logo {
    display: flex;
    width: 7rem;
  }

  nav {
    position: fixed;
    top: 4.5rem;
    right: 0;
    z-index: 1000;
    display: flex;
    flex-direction: column;
    gap: var(--space-lg);
    width: 100vw;
    height: calc(100vh - 4.5rem);
    background: var(--color-cream);
    padding: var(--space-md) var(--space-lg);
    overflow-y: auto;
    color: var(--color-petrol);
    will-change: opacity, transform;

    a {
      text-decoration: none;
    }

    ul {
      list-style: none;
      will-change: opacity, transform;
    }

    /* Navigation CTAs */
    .nav-cta {
      display: flex;
      flex-direction: column;
      gap: var(--space);
      width: 100%;
      padding: var(--space-md) var(--space-md) var(--space-xl);

      &.bg-petrol {
        background: var(--color-petrol);
        color: var(--color-white);

        > a:after {
          border-right: 1px solid var(--color-white);
          border-bottom: 1px solid var(--color-white);
        }
      }

      &.bg-cream {
        background: var(--color-cream);
      }

      &.bg-lime {
        background: var(--color-lime);
      }

      &.bg-sand {
        background: var(--color-sand);
      }

      &.bg-teal {
        background: var(--color-teal);
      }

      &.bg-rust {
        background: var(--color-rust);
      }

      &.bg-gray {
        background: var(--color-gray);
      }

      > .eyebrow {
        width: 6rem;
        margin-bottom: var(--space);
        aspect-ratio: 1;
        overflow: hidden;

        &.circle {
          border-radius: 50%;
        }

        &.pill {
          position: relative;
          right: -2rem;
          width: calc(100% - 4rem);
          max-width: 20rem;
          height: 6rem;
          margin-left: auto;
          border-top-left-radius: 9999px;
          border-bottom-left-radius: 9999px;
          border-top-right-radius: 0;
          border-bottom-right-radius: 0;
          aspect-ratio: initial;
        }

        &.large {
          width: 15rem;
        }

        img {
          width: 100%;
          height: auto;
          object-fit: cover;
        }
      }

      > h4 {
        font-weight: 600;
        text-transform: uppercase;
        letter-spacing: 1.4px;
      }

      > p {
        line-height: 1.5;
      }

      > a {
        display: inline-flex;
        color: inherit;

        &:after {
          content: "";
          position: relative;
          display: block;
          top: 0.55rem;
          left: 0.45rem;
          width: 0.45rem;
          height: 0.45rem;
          border-right: 1px solid var(--color-petrol);
          border-bottom: 1px solid var(--color-petrol);
          transform: translateY(-50%) rotate(-45deg);
          pointer-events: none;
        }
      }
    }

    /* First-level */
    > ul {
      display: flex;
      flex-direction: column;

      > li {
        a,
        span,
        button > a,
        button > span {
          display: block;
          padding-block: var(--space-sm);
          font-size: var(--font-size-md);
          color: var(--color-petrol);
        }

        &.has-children {
          > button {
            all: unset;
            display: flex;
            align-items: center;
            justify-content: space-between;
            width: 100%;
            cursor: pointer;

            &:after {
              content: "";
              position: relative;
              display: block;
              top: 0.25rem;
              width: 0.5rem;
              height: 0.5rem;
              border-right: 1px solid var(--color-petrol);
              border-bottom: 1px solid var(--color-petrol);
              transform: translateY(-50%) rotate(-45deg);
              pointer-events: none;
            }
          }

          /* Second-level */
          > ul {
            position: fixed;
            top: calc(-1 * var(--space-md));
            left: calc(-1 * var(--space-lg));
            z-index: 1;
            display: flex;
            flex-direction: column;
            gap: var(--space);
            width: 100vw;
            height: calc(100vh - 4.5rem);
            background: var(--color-cream);
            padding: var(--space-md) var(--space-lg);
            overflow-y: auto;
            will-change: opacity, transform;

            > li {
              width: 100%;

              > a,
              > span {
                font-weight: 600;
                letter-spacing: 1.4px;
                text-transform: uppercase;
              }

              /* Third-level */
              > ul {
                position: relative;
                display: flex;
                flex-direction: column;
                width: 100%;

                > li {
                  position: relative;
                  left: calc(-1 * var(--space-lg));
                  width: calc(100% + var(--space-lg) * 2);
                  padding-inline: var(--space-lg);

                  &.has-children {
                    padding-top: var(--space-xs);
                    transition: background 300ms;

                    > button {
                      &:before,
                      &:after {
                        content: "";
                        position: absolute;
                        background: var(--color-petrol);
                        transition: rotate 300ms;
                      }
                      &::before {
                        right: var(--space-md);
                        width: 0.9rem;
                        height: 0.1rem;
                      }

                      &::after {
                        right: calc(var(--space-md) + 0.4rem);
                        width: 0.1rem;
                        height: 0.9rem;
                      }
                    }

                    &.active {
                      background: var(--color-sand);

                      > button:before {
                        rotate: 180deg;
                      }

                      > button:after {
                        rotate: 90deg;
                      }
                    }

                    /* Fourth-level */
                    > ul {
                      &:last-child {
                        margin-bottom: var(--space);
                      }

                      /* Fifth-level */
                      > li > ul {
                        margin-left: var(--space);
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }
    }
  }
</style>
