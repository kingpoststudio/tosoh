<script lang="ts">
  import { fade } from 'svelte/transition';

  type MenuItem = {
    label: string;
    url?: string;
    children?: MenuItem[];
  };

  type Menu = {
    children?: MenuItem[];
  };

  let menu: Menu = $state((window as any)?.Tosoh?.Header?.mainNavigationMenu || {});
  let activeMenuItem: number | null = $state(null);
  let timeout: ReturnType<typeof setTimeout> | null = $state(null);

  function setActiveFirstLevelItem(idx: number) {
    if (timeout) clearTimeout(timeout);
    activeMenuItem = idx;
  }

  function handleMenuMouseLeave() {
    if (timeout) clearTimeout(timeout);
    timeout = setTimeout(() => {
      activeMenuItem = null;
    }, 300);
  }

  function handleMenuMouseEnter() {
    if (timeout) clearTimeout(timeout);
  }

  function hasChildren(item: MenuItem): boolean {
    return !!(item.children && item.children.length > 0);
  }
</script>

{#snippet navItem(item: MenuItem)}
  {#if item.url}
    <a href={item.url}>{@html item.label}</a>
  {:else}
    <span>{@html item.label}</span>
  {/if}
{/snippet}

<div class="wrapper">
  <a class="logo" href="/" aria-label="Home">
    <svelte:element this={'slot'} name="logo" />
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
            class={activeMenuItem === i ? 'active' : undefined}
            onmouseenter={() => setActiveFirstLevelItem(i)}
          >
            {@render navItem(item)}
            {#if activeMenuItem === i && hasChildren(item)}
              <div class="dropdown" transition:fade={{ duration: 200 }}>
                <ul class="second-level">
                  {#each item.children ?? [] as secondLevel}
                    {#if secondLevel.label || !hasChildren(secondLevel)}
                      <li>
                        {@render navItem(secondLevel)}
                        {#if hasChildren(secondLevel)}
                          <ul class="third-level">
                            {#each secondLevel.children ?? [] as thirdLevel}
                              <li>
                                {@render navItem(thirdLevel)}
                              </li>
                            {/each}
                          </ul>
                        {/if}
                      </li>
                    {:else}
                      <!-- Skip this section and render its children directly -->
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

  <div class="cta">
    <svelte:element this={'slot'} name="cta" />
  </div>
</div>

<style lang="postcss">
  * {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
  }

  a {
    color: var(--color-text, #333);
    font-size: var(--font-size);
    text-decoration: none;
    transition: color 200ms ease-in-out;

    &:hover {
      color: var(--color-primary, #ed1a3b);
    }
  }

  .wrapper {
    position: relative;
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: var(--spacing-md);
    width: 100%;
    max-width: var(--page-max-width);
    padding: 0 var(--spacing-md);
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
      gap: var(--spacing-base, 1rem);

      > li {
        position: relative;
        height: 100%;

        > a,
        > span {
          position: relative;
          display: inline-flex;
          align-items: center;
          height: 100%;
          font-size: clamp(0.75rem, 1.2vw, 0.95rem);
          font-weight: 600;
          padding-inline: var(--spacing-sm, 0.75rem);
          color: var(--color-text, #333);
          text-align: center;
          letter-spacing: 0.025em;
          transition: color 200ms ease-in-out;

          &:after {
            content: '';
            display: block;
            position: absolute;
            left: 0;
            bottom: 0;
            width: 100%;
            height: 2px;
            background: var(--color-primary, #ed1a3b);
            opacity: 0;
            transform: scaleX(0);
            transition: all 200ms ease-in-out;
          }

          &:hover {
            color: var(--color-primary, #ed1a3b);
          }
        }

        &.active {
          > a,
          > span {
            color: var(--color-primary, #ed1a3b);

            &:after {
              opacity: 1;
              transform: scaleX(1);
            }
          }
        }

        /* Dropdown menu */
        > .dropdown {
          position: absolute;
          top: 100%;
          left: 0;
          z-index: 1000;
          max-width: 24rem;
          min-width: 16rem;
          max-height: min(36rem, 60vh);
          background: white;
          border-bottom-left-radius: 0.5rem;
          border-bottom-right-radius: 0.5rem;
          box-shadow: 0 0.25rem 1rem rgba(0, 0, 0, 0.2);
          overflow: hidden;

          > ul.second-level {
            display: flex;
            flex-direction: column;
            padding: 0 0 var(--spacing-sm, 0.75rem) 0;
            overflow-y: auto;
            max-height: inherit;

            > li {
              display: flex;
              flex-direction: column;
              width: 100%;

              > a,
              > span {
                display: block;
                padding: var(--spacing-sm, 0.75rem) var(--spacing-md, 2rem);
                font-size: var(--font-size);
                font-weight: 600;
                color: var(--color-text, #333);
                border-bottom: 1px solid var(--color-border, #f0f0f0);
                transition: all 200ms ease-in-out;

                &:hover {
                  color: var(--color-primary, #ed1a3b);
                }
              }

              /* Third-level menu */
              > ul.third-level {
                display: flex;
                flex-direction: column;
                background: var(--color-background-light, #f8f9fa);

                > li {
                  width: 100%;

                  > a,
                  > span {
                    display: block;
                    padding: var(--spacing-xs, 0.5rem) var(--spacing-md, 2rem)
                      var(--spacing-xs, 0.5rem) var(--spacing-lg, 3rem);
                    font-size: 0.9rem;
                    font-weight: 400;
                    color: var(--color-text-light, #666);
                    border-bottom: 1px solid var(--color-border-light, #eee);
                    transition: all 200ms ease-in-out;

                    &:hover {
                      background: white;
                      color: var(--color-primary, #ed1a3b);
                      padding-left: calc(var(--spacing-lg, 3rem) + var(--spacing-xs, 0.5rem));
                    }
                  }

                  &:last-child > a,
                  &:last-child > span {
                    border-bottom: none;
                  }
                }
              }
            }
          }
        }
      }
    }
  }

  .cta {
    display: flex;
    align-items: center;
    gap: var(--spacing-md, 2rem);
  }
</style>
