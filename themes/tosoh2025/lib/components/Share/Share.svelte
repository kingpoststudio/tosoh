<svelte:options customElement="tosoh-share" />

<script lang="ts">
  import { fly, slide } from "svelte/transition";

  let wrapper: HTMLDivElement;
  let isOpen: boolean = $state(false);
  let isSlideOut: boolean = $state(false);

  $effect(() => {
    if (isSlideOut) {
      const timer = setTimeout(() => {
        if (wrapper && !wrapper.matches(":hover")) {
          isSlideOut = false;
        }
      }, 1000);

      return () => clearTimeout(timer);
    }
  });

  const link = window.location.href;
  const shareLinks = {
    linkedin: `https://www.linkedin.com/shareArticle?mini=true&url=${encodeURIComponent(link)}`,
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(link)}`,
    x: `https://x.com/intent/post?url=${encodeURIComponent(link)}`,
    link: `javascript:void(0)`,
  };

  function copyLink() {
    navigator.clipboard.writeText(link);
  }
</script>

{#snippet svg(icon: string)}
  {#if icon === "facebook"}
    <svg
      width="36"
      height="36"
      viewBox="0 0 36 36"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <circle
        cx="17"
        cy="16.0769"
        r="11.5"
        fill="currentColor"
        stroke="var(--color-cream)"
      />
      <path
        d="M29.003 15.2288C29.003 8.55981 23.63 3.15381 17.003 3.15381C10.373 3.15531 5 8.55981 5 15.2303C5 21.2558 9.389 26.2508 15.125 27.1568V18.7193H12.08V15.2303H15.128V12.5678C15.128 9.54231 16.9205 7.87131 19.661 7.87131C20.975 7.87131 22.3475 8.10681 22.3475 8.10681V11.0768H20.834C19.3445 11.0768 18.8795 12.0083 18.8795 12.9638V15.2288H22.2065L21.6755 18.7178H18.878V27.1553C24.614 26.2493 29.003 21.2543 29.003 15.2288Z"
        fill="var(--color-cream)"
      />
    </svg>
  {:else if icon === "x"}
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"
        fill="currentColor"
      />
    </svg>
  {:else if icon === "linkedin"}
    <svg
      width="18"
      height="18"
      viewBox="0 0 18 18"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M18 10.9962V17.6508H14.1426V11.4408C14.1426 9.88195 13.5846 8.81815 12.1878 8.81815C11.1222 8.81815 10.4868 9.53455 10.2078 10.2294C10.107 10.4778 10.08 10.8234 10.08 11.169V17.6508H6.2208C6.2208 17.6508 6.273 7.13515 6.2208 6.04615H10.08V7.68955L10.0548 7.72735H10.08V7.68955C10.593 6.89755 11.5074 5.77255 13.5576 5.77255C16.0956 5.77255 18 7.43215 18 10.9962ZM2.1834 0.449951C0.864 0.449951 0 1.31755 0 2.45515C0 3.57115 0.8388 4.46215 2.133 4.46215H2.1582C3.5046 4.46215 4.3416 3.56935 4.3416 2.45515C4.3164 1.31755 3.5046 0.449951 2.1834 0.449951ZM0.2286 17.6508H4.0878V6.04615H0.2286V17.6508Z"
        fill="currentColor"
      />
    </svg>
  {:else if icon === "link"}
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"
        stroke="currentColor"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
      <path
        d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"
        stroke="currentColor"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
    </svg>
  {/if}
{/snippet}

<div
  class="wrapper"
  bind:this={wrapper}
  onmouseenter={() => (isOpen = true)}
  onmouseleave={() => (isSlideOut = false)}
  aria-label="Share this page"
  role="button"
  tabindex="0"
>
  <div class="share">
    <span>Share</span>
    <svg
      width="16"
      height="12"
      viewBox="0 0 16 12"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M9.94322 9.47971L15.5653 5.54325C15.6977 5.46695 15.8074 5.3583 15.8837 5.22803C15.9599 5.09775 16 4.95036 16 4.80037C16 4.65038 15.9599 4.50298 15.8837 4.3727C15.8074 4.24243 15.6977 4.13379 15.5653 4.05748L9.94322 0.118623C9.8092 0.0417559 9.65671 0.00083468 9.50123 1.26343e-05C9.34576 -0.000809412 9.19282 0.0384969 9.05795 0.113942C8.92309 0.189387 8.8111 0.298285 8.73334 0.42958C8.65559 0.560876 8.61484 0.709894 8.61524 0.861509V2.39889C6.76912 2.39889 1.23075 2.39889 0 12C3.07687 6.59937 8.61524 7.19944 8.61524 7.19944V8.73682C8.61524 9.4089 9.36108 9.81455 9.94322 9.48091V9.47971Z"
        fill="currentColor"
      />
    </svg>
  </div>

  {#if isOpen}
    <div
      class="links"
      transition:slide={{ duration: 300, axis: "x" }}
      onintroend={() => (isSlideOut = true)}
    >
      {#each Object.entries(shareLinks) as [key, href], index}
        {#if isSlideOut}
          <a
            class="link"
            {...key === "link"
              ? { onclick: copyLink }
              : { href, target: "_blank", rel: "noopener" }}
            aria-label={`Share on ${key}`}
            transition:fly={{
              duration: 200,
              delay: 25 * (index + 1),
              x: "-1rem",
            }}
            onoutroend={() => (isOpen = false)}
          >
            {@render svg(key)}
          </a>
        {/if}
      {/each}
    </div>
  {/if}
</div>

<style lang="postcss">
  .wrapper {
    position: relative;
    display: inline-flex;
    align-items: center;
    height: 2.5rem;
    width: fit-content;
    padding: 0.25rem 1.25rem;
    font-size: var(--font-size-sm);
    line-height: 1.5;
    letter-spacing: 1px;
    text-decoration: none;
    text-transform: uppercase;
    color: var(--color-cream);
    background: var(--color-petrol);
    border: 1px solid var(--color-lime);
    border-radius: 4rem;
    cursor: pointer;

    > .share > span {
      margin-right: var(--space-2xs);
    }

    > .links {
      display: flex;
      align-items: center;
      width: 12rem;

      > a.link {
        height: 2.5rem;
        width: 2.5rem;
        margin-left: var(--space-xs);
        border-radius: 50%;
        background: var(--color-cream);
        color: var(--color-petrol);
        display: flex;
        align-items: center;
        justify-content: center;
        cursor: pointer;
        transition: box-shadow 0.2s ease-in-out;

        &:hover {
          box-shadow: 0 0 0.5rem rgba(145, 230, 0, 0.5);
        }
      }
    }
  }
</style>
