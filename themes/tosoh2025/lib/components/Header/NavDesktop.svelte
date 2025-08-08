<script lang="ts">
  import { fade } from "svelte/transition";
  import LangSelect from "../LangSelect/LangSelect.svelte";
  import type { HubSpotMenu, MainNavCTA } from "../../types/hubspot";
  import Search from "../Search/Search.svelte";
  import NavCTA from "./NavCTA.svelte";

  let menu: HubSpotMenu = $state(
    window.IQVIA?.Header?.mainNavigationMenu || {}
  );
  let navCtas: MainNavCTA[] | undefined = $state(
    window.IQVIA?.Header?.mainNavigationCTAs || []
  );
  let activeMenuItem: number | null = $state(null);
  let activeSubmenuItem: number | null = $state(null);
  let timeout: ReturnType<typeof setTimeout> | null = $state(null);

  function setActiveFirstLevelItem(idx: number) {
    if (timeout) clearTimeout(timeout);
    activeMenuItem = idx;
    activeSubmenuItem = null;
  }

  function setActiveThirdLevelItem(idx: number | null) {
    if (timeout) clearTimeout(timeout);
    activeSubmenuItem = idx;
  }

  function handleMenuMouseLeave() {
    if (timeout) clearTimeout(timeout);
    timeout = setTimeout(() => {
      activeMenuItem = null;
      activeSubmenuItem = null;
    }, 500);
  }

  function handleMenuMouseEnter() {
    if (timeout) clearTimeout(timeout);
  }

  function hasChildren(item: HubSpotMenu, i: number, k?: number) {
    if (item.children?.length) return true;
    if (typeof k === "number") {
      return navCtas?.some((cta) =>
        cta.indices?.some((idx) => idx.index === i && idx.subIndex === k)
      );
    }
    return navCtas?.some((cta) =>
      cta.indices?.some((idx) => idx.index === i && idx.subIndex == null)
    );
  }

  function getNavCtasForMenu(
    menuIndex: number,
    submenuIndex?: number
  ): MainNavCTA[] {
    return (
      navCtas?.filter((cta) =>
        cta.indices?.some(
          (idx) =>
            idx.index === menuIndex &&
            (submenuIndex !== undefined
              ? idx.subIndex === submenuIndex
              : idx.subIndex == null)
        )
      ) ?? []
    );
  }
</script>

{#snippet navItem(item: HubSpotMenu)}
  {#if item.url}
    <a href={item.url}>{@html item.label}</a>
  {:else}
    <span>{@html item.label}</span>
  {/if}
{/snippet}

<div class="wrapper">
  <a class="logo" href="/" aria-label="Home">
    <svelte:element this={"slot"} name="logo" />
  </a>

  <nav aria-label="Main navigation">
    {#if menu}
      <ul
        class="first-level"
        onmouseleave={handleMenuMouseLeave}
        onmouseenter={handleMenuMouseEnter}
      >
        {#each menu.children ?? [] as item, i}
          <li
            class={activeMenuItem === i ? "active" : undefined}
            onmouseenter={() => setActiveFirstLevelItem(i)}
          >
            {@render navItem(item)}
            {#if activeMenuItem === i && hasChildren(item, i)}
              <div out:fade={{ duration: 200 }}>
                <ul class="second-level">
                  {#each item.children ?? [] as secondLevel, j}
                    <li>
                      {@render navItem(secondLevel)}
                      {#if hasChildren(secondLevel, i)}
                        <ul class="third-level">
                          {#each secondLevel.children ?? [] as thirdLevel, k}
                            {@const hasChildrenThirdLevel = hasChildren(
                              thirdLevel as HubSpotMenu,
                              i,
                              k
                            )}
                            <li
                              onmouseenter={() => setActiveThirdLevelItem(k)}
                              onmouseleave={() => setActiveThirdLevelItem(null)}
                              class:has-children={hasChildrenThirdLevel}
                            >
                              {@render navItem(thirdLevel as HubSpotMenu)}
                              {#if hasChildrenThirdLevel}
                                <svg
                                  width="0.5rem"
                                  height="0.75rem"
                                  viewBox="0 0 8 12"
                                  fill="none"
                                  xmlns="http://www.w3.org/2000/svg"
                                >
                                  <path
                                    d="M1 1L6 6L1 11"
                                    stroke="currentColor"
                                    stroke-width="1.5"
                                    stroke-linecap="round"
                                    stroke-linejoin="round"
                                  />
                                </svg>
                              {/if}
                              {#if activeSubmenuItem === k && hasChildren(thirdLevel as HubSpotMenu, i, k)}
                                {@const fifthLevelCount =
                                  (thirdLevel as HubSpotMenu).children?.reduce(
                                    (count, fourthLevel) =>
                                      count +
                                      (fourthLevel.children?.length ?? 0),
                                    0
                                  ) ?? 0}
                                {@const fifthLvlTwoCol = fifthLevelCount > 8}

                                <div class:fifth-lvl-two-col={fifthLvlTwoCol}>
                                  {#if getNavCtasForMenu(i, k).length}
                                    <div class="nav-ctas">
                                      {#each getNavCtasForMenu(i, k) as cta}
                                        <NavCTA {cta} isSubmenu={true} />
                                      {/each}
                                    </div>
                                  {/if}
                                  {#if (thirdLevel as HubSpotMenu).children?.length}
                                    <ul class="fourth-level">
                                      {#each (thirdLevel as HubSpotMenu).children ?? [] as fourthLevel}
                                        <li>
                                          {@render navItem(fourthLevel)}
                                          {#if fourthLevel.children?.length}
                                            <ul class="fifth-level">
                                              {#each fourthLevel.children as fifthLevel}
                                                <li>
                                                  {@render navItem(fifthLevel)}
                                                </li>
                                              {/each}
                                            </ul>
                                          {/if}
                                        </li>
                                      {/each}
                                    </ul>
                                  {/if}
                                </div>
                              {/if}
                            </li>
                          {/each}
                        </ul>
                      {/if}
                    </li>
                  {/each}
                  {#if getNavCtasForMenu(i).length}
                    <div
                      class="nav-ctas gradient"
                      class:multiple={getNavCtasForMenu(i).length > 1}
                      style:margin-left="auto"
                    >
                      {#each getNavCtasForMenu(i) as cta}
                        <NavCTA {cta} />
                      {/each}
                    </div>
                  {/if}
                </ul>
              </div>
            {/if}
          </li>
        {/each}
      </ul>
    {/if}
  </nav>

  <div class="cta">
    <svelte:element this={"slot"} name="cta" />
  </div>

  <div class="actions">
    <LangSelect />
    <Search />
  </div>
</div>

<style lang="postcss">
  * {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
  }

  a {
    color: var(--color-text);
    font-size: 0.95rem;
    text-decoration: none;
    transition: color 200ms ease-in-out;

    &:hover {
      color: var(--color-iqvia-blue);
    }
  }

  a.logo {
    display: flex;
    width: 10rem;
    padding-bottom: var(--space);
  }

  .wrapper {
    position: relative;
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: var(--space-md);
    width: 100%;
    max-width: var(--page-max-width);
    height: var(--iqvia-header-height);
    padding: var(--space-md) var(--space-lg) 0;
    margin: 0 auto;
  }

  nav {
    height: 100%;

    ul {
      list-style: none;
    }

    /* First-level menu */
    > ul.first-level {
      display: flex;
      flex-direction: row;
      align-items: center;
      height: 100%;
      gap: var(--space);

      > li {
        height: 100%;

        > a,
        > span {
          position: relative;
          display: inline-flex;
          align-items: center;
          height: 100%;
          font-size: clamp(0.875rem, 1.5vw, 1.125rem);
          padding-inline: var(--space-xs);
          color: var(--color-white);
          text-align: center;

          &:after {
            content: "";
            display: block;
            position: absolute;
            left: var(--space-sm);
            bottom: var(--space);
            width: calc(100% - (var(--space-sm) * 2));
            height: 0.15rem;
            background: var(--color-white);
            opacity: 0;
            transition: opacity 200ms ease-in-out;
          }
        }

        &.active {
          > a,
          > span {
            color: var(--color-white);

            &:after {
              opacity: 1;
            }
          }
        }

        /* Second-level menu */
        > div {
          position: absolute;
          top: var(--iqvia-header-height);
          left: 50%;
          transform: translateX(-50%);
          display: grid;
          width: 100%;
          min-height: 20rem;
          background: var(--color-white);
          box-shadow: 0 0.25rem 0.5rem rgba(0, 0, 0, 0.1);

          &:before {
            content: "";
            position: absolute;
            top: 0;
            right: 100%;
            display: block;
            width: 100%;
            height: 100%;
            background: var(--color-white);
          }

          &:after {
            content: "";
            position: absolute;
            top: 0;
            left: 100%;
            display: block;
            width: 100%;
            height: 100%;
            background: var(--color-white);
          }

          > ul.second-level {
            position: relative;
            display: flex;
            width: 100%;
            max-width: var(--page-max-width);
            margin: 0 auto;

            > li {
              width: 100%;
              padding: 1.5rem 0.75rem;

              &:first-child {
                flex: none;
                width: 20rem;
                padding-left: var(--space-xl);
                padding-right: 0;

                > a,
                > span {
                  display: inline-block;
                  padding-right: var(--space-md);
                }
              }

              &:last-child:not(:first-child) {
                padding-right: var(--space-xl);
              }

              > a,
              > span {
                font-size: 1.125rem;
                font-weight: 700;
                text-transform: uppercase;
              }

              > ul.third-level {
                display: flex;
                flex-direction: column;
                width: 100%;
                margin-top: 0.75rem;

                > li {
                  display: flex;
                  align-items: center;
                  gap: 2rem;
                  width: 100%;
                  background: transparent;
                  overflow: hidden;
                  transition:
                    color 200ms,
                    background 200ms;

                  > a,
                  > span {
                    position: relative;
                    left: 0;
                    display: inline-block;
                    padding: var(--space-xs) var(--space-xs) var(--space-xs) 0;
                    font-weight: 450;
                  }

                  &:not(.has-children) {
                    > a {
                      text-decoration: underline;
                      text-decoration-color: transparent;
                      text-underline-offset: 0.25rem;
                      transition: text-decoration-color 200ms;

                      &:hover {
                        text-decoration-color: var(--color-iqvia-blue);
                      }
                    }
                  }

                  &.has-children {
                    > a,
                    > span {
                      transition: left 200ms;
                    }

                    > svg {
                      position: relative;
                      right: 1.5rem;
                      flex-shrink: 0;
                      color: var(--color-iqvia-blue);
                      transition: right 200ms;
                    }

                    &:hover {
                      background: var(--color-iqvia-white);

                      > a,
                      > span {
                        left: var(--space-sm);
                      }

                      > svg {
                        right: 0.75rem;
                      }
                    }

                    /* Third-level menu */
                    > div {
                      position: absolute;
                      z-index: 2;
                      top: 0;
                      left: calc(20rem - 1px);
                      display: flex;
                      width: calc(100% - 21rem);
                      min-height: calc(100% + 1rem);
                      background: var(--color-iqvia-white);
                      border-bottom-left-radius: 0.5rem;
                      border-bottom-right-radius: 0.5rem;
                      box-shadow: 0 0.125rem 0.75rem rgba(0, 0, 0, 0.2);

                      > div.nav-ctas {
                        flex: 2;
                        justify-content: center;
                        max-width: 70%;
                        padding: var(--space-md);
                      }

                      > ul.fourth-level {
                        flex: 5;
                        display: flex;
                        width: 100%;
                        border-left: 1px solid var(--color-iqvia-light-gray);

                        > li {
                          display: flex;
                          flex-direction: column;
                          width: 100%;
                          height: 100%;
                          gap: var(--space);
                          padding: var(--space-md);

                          > a,
                          > span {
                            font-size: 1.1rem;
                            font-weight: 700;
                          }

                          > ul.fifth-level {
                            display: flex;
                            flex-direction: column;
                            column-gap: var(--space-sm);
                            row-gap: var(--space);

                            > li {
                              width: 100%;

                              > a,
                              > span {
                                font-size: 0.95rem;
                              }
                            }
                          }
                        }
                      }

                      &.fifth-lvl-two-col {
                        > ul.fourth-level {
                          ul.fifth-level {
                            display: flex;
                            flex-direction: column;
                            align-content: flex-start;
                            flex-wrap: wrap;
                            max-height: 24rem;

                            > li {
                              max-width: calc(50% - var(--space-sm));
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
    position: absolute;
    top: var(--space);
    right: var(--space-xl);
    display: flex;
    align-items: center;
    gap: var(--space);
  }

  .nav-ctas {
    position: relative;
    display: flex;
    justify-content: flex-end;
    gap: var(--space-md);
    width: 100%;
    padding: var(--space-md) var(--space-xl) var(--space-md) var(--space-md);

    &.gradient {
      background: linear-gradient(
        to right,
        var(--color-iqvia-blue) 0%,
        var(--color-iqvia-light-blue) 100%
      );

      &:after {
        content: "";
        position: absolute;
        top: 0;
        left: calc(100% - 1rem);
        z-index: 1;
        display: block;
        height: 100%;
        width: 50vw;
        background: var(--color-iqvia-light-blue);
      }

      :global(.nav-cta) {
        color: var(--color-white);

        :global(a) {
          color: var(--color-white);

          &:after {
            border-color: var(--color-white);
          }
        }
      }
    }
  }
</style>
