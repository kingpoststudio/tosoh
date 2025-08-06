<script lang="ts">
  import { fade } from "svelte/transition";
  import type { HubSpotMenu, MainNavCTA } from "../../../types/hubspot";
  import { tagField } from "hs-fieldkit";

  const menu: HubSpotMenu | undefined = window.Tosoh?.mainNavigationMenu;
  const navCtas: MainNavCTA[] | undefined = window.Tosoh?.mainNavigationCTAs;

  let activeMenuItem: number | null = $state(null);
  let activeThirdLevelSubmenu: number | null = $state(null);
  let timeout: ReturnType<typeof setTimeout> | null = $state(null);

  function setActiveFirstLevelItem(idx: number) {
    if (timeout) clearTimeout(timeout);
    activeMenuItem = idx;
    activeThirdLevelSubmenu = null;
  }

  function setActiveThirdLevelItem(idx: number | null) {
    if (timeout) clearTimeout(timeout);
    activeThirdLevelSubmenu = idx;
  }

  function handleMenuMouseLeave() {
    if (timeout) clearTimeout(timeout);
    timeout = setTimeout(() => {
      activeMenuItem = null;
      activeThirdLevelSubmenu = null;
    }, 500);
  }

  function handleMenuMouseEnter() {
    if (timeout) clearTimeout(timeout);
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
</script>

{#snippet navCta(cta: MainNavCTA)}
  <tosoh-content class={`bg-${cta.bgColor}`}>
    {#if cta.image?.src}
      <div
        class={[
          cta.imageVariant,
          !cta.title &&
            !cta.description &&
            !cta.link &&
            !cta.linkLabel &&
            "large",
        ]}
        slot="eyebrow"
      >
        <img src={cta.image.src} alt={cta.image.alt || cta.title} />
      </div>
    {/if}
    {#if cta.title}
      <h4 slot="title">{cta.title}</h4>
    {/if}
    {#if cta.description}
      <p slot="description">{cta.description}</p>
    {/if}
    {#if cta.link?.url?.href && cta.linkLabel}
      <a
        slot="cta"
        href={cta.link.url.href}
        target={cta.link.open_in_new_tab ? "_blank" : "_self"}
      >
        {cta.linkLabel}
      </a>
    {/if}
  </tosoh-content>
{/snippet}

{#snippet navItem(item: HubSpotMenu)}
  {#if item.url}
    <a href={item.url} target={item.linkTarget || "_self"}>{item.label}</a>
  {:else}
    <span>{item.label}</span>
  {/if}
{/snippet}

<a class="logo" href="/" aria-label="Home">
  <svelte:element this={"slot"} name="logo" />
</a>

<nav aria-label="Main navigation">
  {#if menu}
    <ul onmouseleave={handleMenuMouseLeave} onmouseenter={handleMenuMouseEnter}>
      {#each menu.children ?? [] as item, i}
        <li onmouseenter={() => setActiveFirstLevelItem(i)}>
          {@render navItem(item)}

          {#if activeMenuItem === i && hasChildren(item, i)}
            <div transition:fade={{ duration: 200 }}>
              <ul>
                {#each item.children ?? [] as secondLevel, j}
                  <li>
                    {@render navItem(secondLevel)}
                    {#if hasChildren(secondLevel, i)}
                      {#if j === 0}
                        <ul>
                          {#each secondLevel.children ?? [] as thirdLevel, k}
                            <li
                              onmouseenter={() => setActiveThirdLevelItem(k)}
                              onmouseleave={() => setActiveThirdLevelItem(null)}
                              class:has-children={hasChildren(
                                thirdLevel as HubSpotMenu,
                                i,
                                k
                              )}
                            >
                              {@render navItem(thirdLevel as HubSpotMenu)}
                              {#if activeThirdLevelSubmenu === k && hasChildren(thirdLevel as HubSpotMenu, i, k)}
                                <div
                                  in:fade={{ duration: 200 }}
                                  out:fade={{ duration: 200, delay: 200 }}
                                >
                                  <ul
                                    transition:fade={{
                                      duration: 200,
                                      delay: 300,
                                    }}
                                  >
                                    {#each (thirdLevel as HubSpotMenu).children ?? [] as fourthLevel}
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
                                </div>
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
            </div>
          {/if}
        </li>
      {/each}
    </ul>
  {/if}
</nav>

<div class="actions">
  <svelte:element this={"slot"} name="cta" />
  <svelte:element this={"slot"} name="search" />
</div>

<style lang="postcss">
  * {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
  }

  a.logo {
    display: flex;
    width: 8rem;
  }

  nav {
    height: 100%;
    color: var(--color-petrol);

    a {
      text-decoration: none;
    }

    ul {
      list-style: none;
    }

    /* Navigation CTAs */
    tosoh-content {
      width: 100%;
      padding: var(--space-md) var(--space-md) var(--space-xl);

      &.bg-petrol {
        background: var(--color-petrol);
        color: var(--color-white);

        > a[slot="cta"]:after {
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

      > div[slot="eyebrow"] {
        width: 6rem;
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

      > h4[slot="title"] {
        font-size: var(--font-size-s);
        font-weight: 600;
        text-transform: uppercase;
        letter-spacing: 1.4px;
      }

      > p[slot="description"] {
        line-height: 1.5;
      }

      > a[slot="cta"] {
        display: inline-flex;
        color: var(--color-text);

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

    /* First-level menu */
    > ul {
      display: flex;
      flex-direction: row;
      align-items: center;
      height: 100%;
      gap: var(--space-md);

      > li {
        position: relative;
        display: flex;
        align-items: center;
        height: 100%;
        padding: var(--space-sm) 0;

        > a,
        > span {
          color: var(--color-cream);
          font-weight: 450;
          text-align: center;
          line-height: 1;
          user-select: none;
          text-decoration: none;
          background: linear-gradient(
            to right,
            var(--color-lime) 0%,
            var(--color-lime) 50%,
            var(--color-cream) 50%,
            var(--color-cream) 100%
          );
          background-size: 200% 100%;
          background-position: 100% 0;
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          text-fill-color: transparent;
          transition: background-position 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          will-change: background-position;
        }

        &:after {
          content: "";
          display: block;
          position: absolute;
          left: 0;
          bottom: 2.5rem;
          width: 0;
          height: 1px;
          background: var(--color-lime);
          transition: width 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          pointer-events: none;
        }

        &:hover {
          > a,
          > span {
            background-position: 0 0;
          }

          &:after {
            width: 100%;
          }
        }

        /* Submenu */
        > div {
          position: fixed;
          top: 8rem;
          left: 50%;
          transform: translateX(-50%);
          display: grid;
          width: 100%;
          max-width: var(--page-max-width);
          min-height: 20rem;
          background: var(--color-cream);

          &:after {
            content: "";
            position: fixed;
            top: 100%;
            left: 0;
            width: 100%;
            height: 100vh;
            background: var(--color-petrol);
            opacity: 0.375;
            pointer-events: none;
          }

          /* Second-level menu */
          > ul {
            position: relative;
            display: flex;
            width: 100%;
            max-width: var(--page-max-width);
            padding-left: var(--space-2xl);
            margin: 0 auto;

            > li {
              width: 100%;
              padding-block: var(--space-md);

              &:first-child {
                flex: none;
                width: 18rem;
              }

              > a,
              > span {
                color: var(--color-petrol);
                font-weight: 600;
                letter-spacing: 1.4px;
                font-size: var(--font-size-xs);
                text-transform: uppercase;
              }

              /* Third-level menu */
              > ul {
                display: flex;
                flex-direction: column;
                width: 100%;
                margin-top: var(--space-sm);

                > li {
                  width: 100%;
                  background: transparent;
                  border-top-left-radius: 9999px;
                  border-bottom-left-radius: 9999px;
                  border-top-right-radius: 0;
                  border-bottom-right-radius: 0;
                  overflow: hidden;
                  transition:
                    color 200ms,
                    transform 200ms,
                    background 200ms;

                  > a,
                  > span {
                    position: relative;
                    display: inline-flex;
                    width: 100%;
                    padding: var(--space-sm) 0;
                    color: var(--color-petrol);
                    font-size: var(--font-size-sm);
                    font-weight: 450;
                    transition: padding-left 200ms;
                  }

                  &:not(.has-children) {
                    > a,
                    > span {
                      text-decoration: underline;
                      text-decoration-color: transparent;
                      text-underline-offset: 0.25rem;
                      transition:
                        padding-left 200ms,
                        text-decoration-color 200ms;

                      &:hover {
                        text-decoration-color: var(--color-petrol);
                      }
                    }
                  }

                  &.has-children {
                    > a,
                    > span {
                      &:after {
                        content: "";
                        position: relative;
                        display: block;
                        top: 0.45rem;
                        left: 0.45rem;
                        width: 0.45rem;
                        height: 0.45rem;
                        border-right: 1px solid var(--color-petrol);
                        border-bottom: 1px solid var(--color-petrol);
                        transform: translateY(-50%) rotate(-45deg);
                        pointer-events: none;
                      }
                    }

                    &:hover {
                      background: var(--color-sand);

                      > a,
                      > span {
                        padding-left: var(--space-sm);
                      }
                    }

                    /* Fourth-level menu */
                    > div {
                      position: absolute;
                      z-index: 2;
                      top: 0;
                      left: 24rem;
                      display: grid;
                      width: calc(100% - 24rem);
                      height: 100%;
                      background: var(--color-sand);

                      > ul {
                        display: flex;
                        width: 100%;

                        > li {
                          width: 100%;
                          padding-block: var(--space-md);

                          &:first-child {
                            padding-left: var(--space-md);
                          }

                          > a,
                          > span {
                            color: var(--color-petrol);
                            font-weight: 600;
                            letter-spacing: 1.4px;
                            font-size: var(--font-size-xs);
                            text-transform: uppercase;
                          }

                          > ul {
                            display: flex;
                            flex-direction: column;
                            gap: var(--space-sm);
                            width: 100%;
                            margin-top: var(--space-sm);

                            > li {
                              width: 100%;

                              > a,
                              > span {
                                color: var(--color-petrol);
                                font-size: var(--font-size-sm);
                                font-weight: 450;
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
        }
      }
    }
  }

  .actions {
    display: flex;
    align-items: center;
    gap: var(--space);
  }
</style>
