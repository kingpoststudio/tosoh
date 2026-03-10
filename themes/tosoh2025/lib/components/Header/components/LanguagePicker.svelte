<script lang="ts">
  import { getLanguage } from '../../../utils/utils';

  const translatedContent = window.Tosoh?.TranslatedContent;
  const variants = translatedContent?.variants ?? [];
  const currentLanguage = translatedContent?.currentLanguage;

  let open = $state(false);
  let pickerRef: HTMLDivElement | undefined = $state();

  function select(url: string) {
    open = false;
    window.location.href = url;
  }

  function handleClickOutside(e: MouseEvent) {
    if (pickerRef && !pickerRef.contains(e.target as Node)) {
      open = false;
    }
  }

  function toggle(e: MouseEvent) {
    e.stopPropagation();
    open = !open;
  }
</script>

<svelte:document onclick={handleClickOutside} />

{#if variants}
  <div class="language-picker" bind:this={pickerRef}>
    <button
      type="button"
      class="language-trigger"
      aria-expanded={open}
      aria-haspopup="listbox"
      onclick={toggle}
    >
      <svg
        class="globe"
        width="14"
        height="14"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="1.8"
        stroke-linecap="round"
        stroke-linejoin="round"
      >
        <circle cx="12" cy="12" r="10" />
        <path d="M2 12h20" />
        <path
          d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"
        />
      </svg>
      {currentLanguage}
      <svg width="10" height="6" viewBox="0 0 10 6" fill="none" class="chevron" class:open>
        <path
          d="M1 1L5 5L9 1"
          stroke="currentColor"
          stroke-width="1.5"
          stroke-linecap="round"
          stroke-linejoin="round"
        />
      </svg>
    </button>

    {#if open}
      <ul class="language-options" role="listbox">
        {#each variants as item}
          <li role="option" aria-selected={item.language === currentLanguage}>
            <button type="button" onclick={() => select(item.absoluteUrl)}>
              {getLanguage(item.language)}
            </button>
          </li>
        {/each}
      </ul>
    {/if}
  </div>
{/if}

<style lang="postcss">
  .language-picker {
    position: relative;
    width: fit-content;
  }

  .language-trigger {
    appearance: none;
    background: transparent;
    border: 1px solid var(--color-slate-200);
    border-radius: 0.25rem;
    padding: 0.25rem 0.5rem;
    font-size: var(--spacing-base);
    color: var(--color-imperial-red);
    cursor: pointer;
    width: fit-content;
    display: inline-flex;
    align-items: center;
    gap: 0.35rem;
    transition:
      border-color 200ms ease-in-out,
      color 200ms ease-in-out;

    &:hover {
      border-color: var(--color-imperial-red);
      color: var(--color-raisin-black);
    }

    &:focus {
      outline: none;
      border-color: var(--color-imperial-red);
      color: var(--color-raisin-black);
    }

    @media (min-width: 768px) {
      margin-top: 0;
    }
  }

  .globe {
    flex-shrink: 0;
  }

  .chevron {
    transition: transform 200ms ease-in-out;

    &.open {
      transform: rotate(180deg);
    }
  }

  .language-options {
    position: absolute;
    top: 100%;
    left: 0;
    margin-top: 0.25rem;
    padding: 0.25rem 0;
    background: white;
    border: 1px solid var(--color-slate-200);
    border-radius: 0.25rem;
    list-style: none;
    width: 100%;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
    z-index: 100;

    li button {
      all: unset;
      display: block;
      width: 100%;
      padding: 0.35rem 0.65rem;
      font-size: var(--spacing-base);
      color: var(--color-zinc-900);
      cursor: pointer;
      white-space: nowrap;
      box-sizing: border-box;

      &:hover {
        background: var(--color-slate-100);
      }
    }
  }
</style>
