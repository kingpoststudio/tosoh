<svelte:options customElement="tosoh-footer" />

<script lang="ts">
  import type { HubSpotMenu } from "../../../types/hubspot";
  const menu: HubSpotMenu | undefined = window.Tosoh?.footerNavigationMenu;
</script>

{#snippet navItem(item: HubSpotMenu)}
  {#if item.url}
    <a href={item.url} target={item.linkTarget || "_self"}>{item.label}</a>
  {:else}
    <span>{item.label}</span>
  {/if}
{/snippet}

<footer>
  <svelte:element this={"slot"} name="logo" />
  <div class="menu">
    {#if menu}
      <ul>
        {#each menu.children ?? [] as item}
          <li>
            {@render navItem(item)}

            {#if item.children?.length}
              <ul>
                {#each item.children ?? [] as secondLevel}
                  <li>
                    {@render navItem(secondLevel)}
                  </li>
                {/each}
              </ul>
            {/if}
          </li>
        {/each}
      </ul>
    {/if}
  </div>
  <div class="socials">
    <svelte:element this={"slot"} name="socials" />
  </div>
  <div class="decoration"></div>
  <div class="legal">
    <svelte:element this={"slot"} name="copyright" />
    <svelte:element this={"slot"} name="privacy" />
    <svelte:element this={"slot"} name="terms" />
  </div>
</footer>

<style lang="postcss">
  * {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
  }

  footer {
    position: relative;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: space-between;
    gap: var(--space-lg);
    width: 100%;
    max-width: var(--page-max-width);
    padding: var(--space-lg);
    margin: 0 auto;
    background: var(--color-petrol);

    @media (min-width: 768px) {
      padding: var(--space-lg) var(--space-2xl);
    }

    > .menu {
      display: none;
      justify-content: center;
      width: 100%;

      @media (min-width: 768px) {
        display: flex;
      }

      ul {
        list-style: none;

        > li {
          a,
          span {
            font-size: var(--font-size-sm);
            color: var(--color-cream);
            text-decoration: none;
          }
        }
      }

      > ul {
        display: flex;
        flex-direction: column;
        gap: var(--space-lg);

        @media (min-width: 768px) {
          flex-direction: row;
          gap: var(--space-2xl);
        }

        > li {
          > a,
          > span {
            font-weight: 500;
            text-transform: uppercase;
            letter-spacing: 1.4px;
          }

          > ul {
            display: flex;
            flex-direction: column;
            gap: var(--space-sm);
            margin-top: 1.25rem;

            > li {
              > a,
              > span {
                font-weight: 400;
                text-transform: none;
                letter-spacing: 0.75px;
              }
            }
          }
        }
      }
    }

    > .socials {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 3rem;
    }

    > .decoration {
      position: relative;
      left: calc(-1 * var(--space-lg));
      width: calc(100% + var(--space-lg) * 2);
      height: 1px;
      background: var(--color-cream);
      opacity: 0.5;

      @media (min-width: 768px) {
        left: 0;
        width: calc(100% + var(--space-2xl) * 2);
      }
    }

    > .legal {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      gap: var(--space-sm);
      width: 100%;

      @media (min-width: 768px) {
        flex-direction: row;
        gap: var(--space);
      }
    }
  }
</style>
