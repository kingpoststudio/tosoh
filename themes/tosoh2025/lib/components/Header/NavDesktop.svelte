<script lang="ts">
  import { onMount } from 'svelte';
  import { fade, fly } from 'svelte/transition';
  import type { HubSpotMenu } from '../../../types/hubspot';

  const menu: HubSpotMenu | undefined = window.Tosoh?.Header?.mainNavigationMenu;
  const auxiliaryMenu: HubSpotMenu | undefined = window.Tosoh?.Header?.auxiliaryMenu;
  const hasAuxiliaryMenu =
    auxiliaryMenu && auxiliaryMenu?.children && auxiliaryMenu?.children?.length > 0;

  const menuJustification: 'center' | 'end' = window.Tosoh?.Header?.menuJustification || 'end';

  let activeMenuItem: number | null = $state(null);
  let activeSecondLevelItem: string | null = $state(null);
  let timeout: ReturnType<typeof setTimeout> | null = $state(null);
  let thirdLevelTimeout: ReturnType<typeof setTimeout> | null = $state(null);
  let ctasSlotElement: HTMLSlotElement | any = $state(null);
  let hasCTAs = $state(true);
  let thirdLevelMenuRefs = new Map<string, HTMLElement | null>();
  let thirdLevelFlipped: Map<string, boolean> = $state(new Map());

  function setActiveFirstLevelItem(idx: number) {
    if (timeout) clearTimeout(timeout);
    activeMenuItem = idx;
  }

  function handleMenuMouseLeave() {
    if (timeout) clearTimeout(timeout);
    timeout = setTimeout(() => {
      activeMenuItem = null;
      activeSecondLevelItem = null;
    }, 300);
  }

  function handleMenuMouseEnter() {
    if (timeout) clearTimeout(timeout);
  }

  function setActiveSecondLevelItem(itemId: string, event?: MouseEvent) {
    if (thirdLevelTimeout) clearTimeout(thirdLevelTimeout);
    activeSecondLevelItem = itemId;

    // Pre-calculate if the menu should be flipped based on the parent's position
    if (event?.currentTarget) {
      const target = event.currentTarget as HTMLElement;
      const rect = target.getBoundingClientRect();
      const viewportWidth = window.innerWidth;

      // Estimate if a submenu on the right would overflow
      // Assuming submenu min-width is 12rem = ~192px
      const estimatedMenuWidth = 192;
      const wouldOverflow = rect.right + estimatedMenuWidth > viewportWidth - 10;

      // Set the flipped state immediately
      const newFlipped = new Map(thirdLevelFlipped);
      newFlipped.set(itemId, wouldOverflow);
      thirdLevelFlipped = newFlipped;
    }
  }

  function handleSecondLevelMouseLeave(itemId: string) {
    if (thirdLevelTimeout) clearTimeout(thirdLevelTimeout);
    thirdLevelTimeout = setTimeout(() => {
      // Only hide if we're still showing this specific item's menu
      if (activeSecondLevelItem === itemId) {
        activeSecondLevelItem = null;
      }
    }, 150);
  }

  function handleThirdLevelMouseEnter(itemId: string) {
    if (thirdLevelTimeout) clearTimeout(thirdLevelTimeout);
    // Ensure the menu stays active when hovering the submenu
    activeSecondLevelItem = itemId;
  }

  function hasChildren(item: HubSpotMenu): boolean {
    return !!(item.children && item.children.length > 0);
  }

  function checkPositionAction(node: HTMLElement, itemId: string) {
    thirdLevelMenuRefs.set(itemId, node);

    // Check position as early as possible
    const checkPosition = () => {
      const rect = node.getBoundingClientRect();
      const viewportWidth = window.innerWidth;

      // Check if menu extends beyond the right edge of the viewport
      // Add a small buffer to account for padding/margins
      const isOutOfBounds = rect.right > viewportWidth - 10;

      // Only update if the state has changed to avoid unnecessary re-renders
      const currentState = thirdLevelFlipped.get(itemId);
      if (currentState !== isOutOfBounds) {
        const newFlipped = new Map(thirdLevelFlipped);
        newFlipped.set(itemId, isOutOfBounds);
        thirdLevelFlipped = newFlipped;
      }
    };

    // Check synchronously first, then again after layout
    checkPosition();
    requestAnimationFrame(checkPosition);

    return {
      destroy() {
        thirdLevelMenuRefs.delete(itemId);
      },
    };
  }

  onMount(() => {
    hasCTAs = ctasSlotElement?.assignedNodes()?.length > 0 || false;
  });
</script>

{#snippet navItem(item: HubSpotMenu)}
  {#if item.url}
    <a href={item.url} target={item?.linkTarget || '_self'}>{@html item.label}</a>
  {:else}
    <span>{@html item.label}</span>
  {/if}
{/snippet}

<div class="wrapper">
  <header class:has-auxiliary-menu={hasAuxiliaryMenu}>
    <svelte:element this={'slot'} name="logo" />

    <nav aria-label="Main navigation" class={`justify-${menuJustification}`}>
      {#if menu}
        <ul
          class="first-level"
          onmouseleave={handleMenuMouseLeave}
          onmouseenter={handleMenuMouseEnter}
        >
          {#each menu.children ?? [] as item, i}
            <li
              class={activeMenuItem === i ? 'active' : undefined}
              onmouseenter={() => setActiveFirstLevelItem(i)}
            >
              {@render navItem(item)}
              {#if activeMenuItem === i && hasChildren(item)}
                <div class="dropdown" in:fade={{ duration: 100 }}>
                  <ul class="second-level">
                    {#each item.children ?? [] as secondLevel, j}
                      {#if secondLevel.label || !hasChildren(secondLevel)}
                        {@const itemId = `${i}-${j}`}
                        <li
                          class:has-submenu={hasChildren(secondLevel)}
                          onmouseenter={(e) => setActiveSecondLevelItem(itemId, e)}
                          onmouseleave={() => handleSecondLevelMouseLeave(itemId)}
                          class:active={activeSecondLevelItem === `${itemId}`}
                        >
                          {@render navItem(secondLevel)}
                          {#if hasChildren(secondLevel) && activeSecondLevelItem === itemId}
                            {@const isFlipped = thirdLevelFlipped.get(itemId)}
                            <ul
                              class="third-level"
                              class:flipped={isFlipped}
                              use:checkPositionAction={itemId}
                              in:fly={{ x: isFlipped ? 10 : -10, duration: 200 }}
                              onmouseenter={() => handleThirdLevelMouseEnter(itemId)}
                            >
                              {#each secondLevel.children ?? [] as thirdLevel}
                                <li>
                                  {@render navItem(thirdLevel)}
                                </li>
                              {/each}
                            </ul>
                          {/if}
                        </li>
                      {:else}
                        {#each secondLevel.children ?? [] as thirdLevel}
                          <li>
                            {@render navItem(thirdLevel)}
                          </li>
                        {/each}
                      {/if}
                    {/each}
                  </ul>
                </div>
              {/if}
            </li>
          {/each}
        </ul>
      {/if}
    </nav>

    <div class="aux">
      {#if auxiliaryMenu}
        {#each auxiliaryMenu.children ?? [] as item}
          {@render navItem(item)}
        {/each}
      {/if}
    </div>

    {#if hasCTAs}
      <div class="cta">
        <svelte:element this={'slot'} name="cta" bind:this={ctasSlotElement} />
      </div>
    {/if}
  </header>
</div>

<style lang="postcss">
  * {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
  }

  a {
    color: var(--color-zinc-900);
    font-size: var(--font-size);
    text-decoration: none;
    transition: color 200ms ease-in-out;

    &:hover {
      color: var(--color-imperial-red);
    }
  }

  .wrapper {
    position: relative;
    width: 100%;
    box-shadow: 0 0 0.25rem rgba(0, 0, 0, 0.1);
  }

  header {
    position: relative;
    display: flex;
    align-items: center;
    gap: var(--spacing-sm);
    width: 100%;
    max-width: var(--container-max-page);
    padding: var(--spacing-base) var(--spacing-md);
    margin: 0 auto;
    min-height: var(--spacing-header-height-desktop);

    > nav {
      margin-top: var(--spacing-sm);
    }

    &.has-auxiliary-menu {
      align-items: flex-end;
      > nav {
        margin-top: 0;
      }
    }
  }

  nav {
    height: 100%;
    width: 100%;
    min-height: 100%;
    display: flex;

    &.justify-center {
      justify-content: center;
    }

    &.justify-end {
      justify-content: flex-end;
    }

    ul {
      list-style: none;
    }

    /* First-level menu */
    > ul.first-level {
      display: flex;
      flex-direction: row;
      align-items: center;
      height: 100%;

      > li {
        position: relative;
        height: 100%;

        > a,
        > span {
          position: relative;
          display: inline-flex;
          align-items: center;
          height: 100%;
          font-size: var(--spacing-base);
          font-weight: 400;
          color: inherit;
          padding-inline: var(--spacing-sm);
          padding-bottom: var(--spacing-sm);
          text-align: center;
          transition: color 200ms ease-in-out;

          &:after {
            content: '';
            display: block;
            position: absolute;
            left: 0;
            bottom: 0;
            width: 100%;
            height: 0.125rem;
            background: var(--color-imperial-red);
            opacity: 0;
            transform: scaleX(0);
            transition:
              opacity 200ms ease-in-out,
              transform 200ms ease-in-out;
          }

          &:hover {
            color: var(--color-imperial-red);
          }
        }

        &.active {
          > a,
          > span {
            color: var(--color-imperial-red);

            &:after {
              opacity: 1;
              transform: scaleX(1);
            }
          }
        }

        /* Dropdown menu */
        > .dropdown {
          position: absolute;
          top: calc(100% + 1px);
          left: -1rem;
          z-index: var(--z-index-dropdown);
          max-width: fit-content;
          min-width: 12rem;
          font-size: 0.9rem;
          background: var(--color-white);
          border: 1px solid var(--color-zinc-300);
          border-radius: 0.5rem;
          box-shadow: 0 0.25rem 1rem rgba(0, 0, 0, 0.2);

          /* Second-level menu */
          > ul.second-level {
            display: flex;
            flex-direction: column;
            padding: var(--spacing-xs) 0 var(--spacing-sm) 0;

            > li {
              position: relative;
              display: flex;
              flex-direction: column;
              width: 100%;

              &.active {
                > a,
                > span {
                  color: var(--color-imperial-red);
                }
              }

              &:first-child {
                > a,
                > span {
                  border-top: 1px solid var(--color-zinc-200);
                }
              }

              > a,
              > span {
                display: block;
                padding: var(--spacing-xs) var(--spacing-sm);
                border-bottom: 1px solid var(--color-zinc-200);
                transition: color 200ms ease-in-out;

                &:hover {
                  color: var(--color-imperial-red);
                }
              }

              /* Add visual indicator for items with third-level children */
              &.has-submenu {
                > a,
                > span {
                  padding-right: calc(var(--spacing-base) + 1rem);

                  &:after {
                    content: '';
                    position: absolute;
                    right: var(--spacing-sm);
                    top: 50%;
                    transform: translateY(-50%);
                    width: 1rem;
                    height: 1rem;
                    background-image: url("data:image/svg+xml,%3Csvg width='16' height='16' viewBox='0 0 16 16' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M6 12L10 8L6 4' stroke='currentColor' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E");
                    background-size: contain;
                    background-repeat: no-repeat;
                    background-position: center;
                    opacity: 0.5;
                  }
                }
              }

              /* Third-level menu */
              > ul.third-level {
                display: flex;
                position: absolute;
                left: 100%;
                top: 0;
                flex-direction: column;
                background: var(--color-white);
                border: 1px solid var(--color-zinc-300);
                border-radius: 0.5rem;
                box-shadow: 0 0.25rem 1rem rgba(0, 0, 0, 0.2);
                min-width: 12rem;
                max-width: fit-content;
                max-height: min(36rem, 60vh);
                overflow-y: auto;
                padding: var(--spacing-xs) 0 var(--spacing-sm) 0;
                margin-left: -0.5rem;
                z-index: calc(var(--z-index-dropdown) + 1);

                /* When flipped, position to the left instead of right */
                &.flipped {
                  left: auto;
                  right: 100%;
                  margin-left: 0;
                  margin-right: -0.5rem;
                }

                > li {
                  width: 100%;

                  &:first-child {
                    > a,
                    span {
                      border-top: 1px solid var(--color-zinc-200);
                    }
                  }

                  > a,
                  > span {
                    display: block;
                    padding: var(--spacing-xs) var(--spacing-base);
                    font-size: 0.9rem;
                    font-weight: 400;
                    border-bottom: 1px solid var(--color-zinc-200);
                    transition:
                      background 200ms ease-in-out,
                      color 200ms ease-in-out,
                      padding-left 200ms ease-in-out;

                    &:hover {
                      background: var(--color-zinc-50);
                      color: var(--color-imperial-red);
                      padding-left: calc(var(--spacing-base) + 0.25rem);
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

  .aux {
    position: absolute;
    top: var(--spacing-sm);
    right: var(--spacing-md);
    display: flex;
    gap: var(--spacing-sm);
    color: var(--color-imperial-red);

    > a:last-child,
    > span:last-child {
      @media (min-width: 768px) {
        margin-right: var(--spacing-sm);
      }
    }
    > a {
      position: relative;
      color: inherit;
      transition: color 200ms ease-in-out;

      &:hover {
        color: var(--color-black-charcoal);
      }
    }
  }

  .cta {
    display: flex;
    align-items: center;
    gap: var(--spacing-sm);
    margin-right: var(--spacing-sm);
  }
</style>
