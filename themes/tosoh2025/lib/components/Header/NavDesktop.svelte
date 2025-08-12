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

<header>
  <a class="logo" href="/" aria-label="Home">
    <svelte:element this={'slot'} name="logo" />
  </a>

  <nav aria-label="Main navigation">
    {#if menu}
      <ul class="level-1" onmouseleave={handleMenuMouseLeave} onmouseenter={handleMenuMouseEnter}>
        {#each menu.children ?? [] as item, i}
          <li
            class={activeMenuItem === i ? 'active' : undefined}
            onmouseenter={() => setActiveFirstLevelItem(i)}
          >
            {@render navItem(item)}
            {#if activeMenuItem === i && hasChildren(item)}
              <div class="dropdown" in:fade={{ duration: 100 }}>
                <ul class="level-2">
                  {#each item.children ?? [] as secondLevel}
                    {#if secondLevel.label || !hasChildren(secondLevel)}
                      <li>
                        {@render navItem(secondLevel)}
                        {#if hasChildren(secondLevel)}
                          <ul class="level-3">
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
    <svelte:element this={'slot'} name="aux" />
  </div>

  <div class="cta">
    <svelte:element this={'slot'} name="cta" />
  </div>
</header>

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

  header {
    position: relative;
    display: flex;
    align-items: flex-end;
    gap: var(--spacing-md);
    width: 100%;
    max-width: var(--container-8xl);
    padding: var(--spacing-base) var(--spacing-md);
    margin: 0 auto;
    box-shadow: 0 0 0.25rem rgba(0, 0, 0, 0.1);
  }

  nav {
    height: 100%;
    margin-left: auto;

    ul {
      list-style: none;
    }

    /* First-level menu */
    > ul.level-1 {
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
          font-size: 0.95rem;
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
          max-width: 24rem;
          min-width: 12rem;
          max-height: min(36rem, 60vh);
          font-size: 0.9rem;
          background: var(--color-white);
          border: 1px solid var(--color-zinc-300);
          border-radius: 0.5rem;
          box-shadow: 0 0.25rem 1rem rgba(0, 0, 0, 0.2);
          overflow: hidden;

          /* Second-level menu */
          > ul.level-2 {
            display: flex;
            flex-direction: column;
            padding: var(--spacing-xs) 0 var(--spacing-sm) 0;
            overflow-y: auto;
            max-height: inherit;

            > li {
              display: flex;
              flex-direction: column;
              width: 100%;

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

              /* Third-level menu */
              > ul.level-3 {
                display: flex;
                flex-direction: column;
                background: var(--color-zinc-100);

                > li {
                  width: 100%;

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
                      background: white;
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
  }

  .cta {
    display: flex;
    align-items: center;
    gap: var(--spacing-md, 2rem);
  }
</style>
