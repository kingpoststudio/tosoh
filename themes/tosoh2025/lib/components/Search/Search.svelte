<svelte:options customElement="tosoh-search" />

<script lang="ts">
  import { algoliasearch } from "algoliasearch";
  import { onMount, onDestroy } from "svelte";
  import { fly } from "svelte/transition";

  interface AlgoliaHit {
    objectID: string;
    url?: string;
    title?: string;
    name?: string;
    content?: string;
    description?: string;
    _highlightResult?: {
      [key: string]: {
        value: string;
        matchLevel: string;
        matchedWords: string[];
      };
    };
    _snippetResult?: {
      [key: string]: {
        value: string;
        matchLevel: string;
      };
    };
  }

  interface AlgoliaSearchResult {
    hits: AlgoliaHit[];
    nbHits: number;
    page: number;
    nbPages: number;
    hitsPerPage: number;
    exhaustiveNbHits: boolean;
    exhaustiveTypo: boolean;
    query: string;
    params: string;
    processingTimeMS: number;
  }

  interface AlgoliaSearchResponse {
    results: AlgoliaSearchResult[];
  }

  let {
    appId = "OWH8QOTAUB",
    apiKey = "1da917954609a5e05facfdae705cd55c",
    indexName = "website_prod",
  }: {
    appId?: string;
    apiKey?: string;
    indexName?: string;
    isOpen?: boolean;
  } = $props();

  // State
  let searchTerm = $state("");
  let results = $state<AlgoliaHit[]>([]);
  let totalResults = $state(0);
  let isOpen = $state(false);
  let isSearching = $state(false);
  let searchClient: any = null;
  let searchInput: HTMLInputElement | null = $state(null);
  let searchTimeout: ReturnType<typeof setTimeout>;

  // Initialize Algolia client
  onMount(() => {
    if (appId && apiKey) {
      searchClient = algoliasearch(appId, apiKey);
    }
  });

  // Handle search
  async function handleSearch() {
    if (!searchClient || !searchTerm.trim()) {
      results = [];
      totalResults = 0;
      isSearching = false;
      return;
    }

    isSearching = true;

    try {
      const response: AlgoliaSearchResponse = await searchClient.search({
        requests: [
          {
            indexName,
            query: searchTerm.trim(),
            hitsPerPage: 20,
          },
        ],
      });

      results = response.results[0]?.hits || [];
      totalResults = response.results[0]?.nbHits || 0;
    } catch (error) {
      console.error("Search error: ", error);
      results = [];
      totalResults = 0;
    } finally {
      isSearching = false;
    }
  }

  function onInput() {
    clearTimeout(searchTimeout);

    if (!searchTerm.trim()) {
      isSearching = false;
      results = [];
      totalResults = 0;
      return;
    }
    searchTimeout = setTimeout(handleSearch, 300);
  }

  // Handle close
  function handleClose() {
    isOpen = false;
    searchTerm = "";
    results = [];
    totalResults = 0;
    isSearching = false;
  }

  $effect(() => {
    if (isOpen && searchInput) {
      setTimeout(() => searchInput?.focus(), 100);
    }
  });

  function handleKeydown(event: KeyboardEvent) {
    if (event.key === "Escape") {
      handleClose();
    }
  }

  onDestroy(() => {
    if (searchTimeout) clearTimeout(searchTimeout);
  });
</script>

<svelte:window on:keydown={handleKeydown} />

<button
  class="action"
  onclick={() => (isOpen = !isOpen)}
  aria-label={isOpen ? "Close search" : "Open search"}
  aria-expanded={isOpen}
>
  <svelte:element this={"slot"} />
</button>

{#if isOpen}
  <div class="overlay" transition:fly={{ y: 16, duration: 200 }}>
    <div class="wrapper">
      <button
        class="close"
        onclick={handleClose}
        aria-label="Close search"
        onkeydown={(e) => e.key === "Enter" && handleClose()}
        tabindex="0"
      >
        <svg
          width="2rem"
          height="2rem"
          viewBox="0 0 32 32"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            fill-rule="evenodd"
            clip-rule="evenodd"
            d="M23.8042 8.19583C23.8662 8.25775 23.9155 8.33131 23.9491 8.41229C23.9827 8.49328 24 8.5801 24 8.66777C24 8.75545 23.9827 8.84227 23.9491 8.92325C23.9155 9.00424 23.8662 9.07779 23.8042 9.13971L9.13969 23.8045C9.01453 23.9297 8.84477 24 8.66776 24C8.49075 24 8.32099 23.9297 8.19583 23.8045C8.07067 23.6794 8.00035 23.5096 8.00035 23.3326C8.00035 23.1556 8.07067 22.9858 8.19583 22.8606L22.8603 8.19583C22.9222 8.13376 22.9958 8.08451 23.0768 8.0509C23.1578 8.0173 23.2446 8 23.3322 8C23.4199 8 23.5067 8.0173 23.5877 8.0509C23.6687 8.08451 23.7423 8.13376 23.8042 8.19583Z"
            fill="currentColor"
          />
          <path
            fill-rule="evenodd"
            clip-rule="evenodd"
            d="M8.19583 8.19583C8.13375 8.25775 8.0845 8.33131 8.0509 8.41229C8.0173 8.49328 8 8.5801 8 8.66777C8 8.75545 8.0173 8.84227 8.0509 8.92325C8.0845 9.00424 8.13375 9.07779 8.19583 9.13971L22.8603 23.8045C22.9855 23.9297 23.1552 24 23.3322 24C23.5092 24 23.679 23.9297 23.8042 23.8045C23.9293 23.6794 23.9997 23.5096 23.9997 23.3326C23.9997 23.1556 23.9293 22.9858 23.8042 22.8606L9.13969 8.19583C9.07777 8.13376 9.00421 8.08451 8.92323 8.0509C8.84225 8.0173 8.75544 8 8.66776 8C8.58008 8 8.49327 8.0173 8.41229 8.0509C8.3313 8.08451 8.25775 8.13376 8.19583 8.19583Z"
            fill="currentColor"
          />
        </svg>
      </button>

      <div class="search">
        <input
          bind:this={searchInput}
          bind:value={searchTerm}
          oninput={onInput}
          type="text"
          placeholder="Search..."
          aria-label="Search"
        />
        {#if isSearching}
          <svg
            class="spinner"
            width="1rem"
            height="1rem"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <circle
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-dasharray="31.416"
              stroke-dashoffset="31.416"
            >
              <animate
                attributeName="stroke-dasharray"
                dur="2s"
                values="0 31.416;15.708 15.708;0 31.416;0 31.416"
                repeatCount="indefinite"
              />
              <animate
                attributeName="stroke-dashoffset"
                dur="2s"
                values="0;-15.708;-31.416;-31.416"
                repeatCount="indefinite"
              />
            </circle>
          </svg>
        {:else}
          <svg
            width="1rem"
            height="1rem"
            viewBox="0 0 22 22"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M20.6464 21.3536C20.8417 21.5488 21.1583 21.5488 21.3536 21.3536C21.5488 21.1583 21.5488 20.8417 21.3536 20.6464L20.6464 21.3536ZM18.1429 9.57143H17.6429C17.6429 14.0292 14.0292 17.6429 9.57143 17.6429V18.1429V18.6429C14.5814 18.6429 18.6429 14.5814 18.6429 9.57143H18.1429ZM9.57143 18.1429V17.6429C5.1137 17.6429 1.5 14.0292 1.5 9.57143H1H0.5C0.5 14.5814 4.56142 18.6429 9.57143 18.6429V18.1429ZM1 9.57143H1.5C1.5 5.1137 5.1137 1.5 9.57143 1.5V1V0.5C4.56142 0.5 0.5 4.56142 0.5 9.57143H1ZM9.57143 1V1.5C14.0292 1.5 17.6429 5.1137 17.6429 9.57143H18.1429H18.6429C18.6429 4.56142 14.5814 0.5 9.57143 0.5V1ZM15.6323 15.6323L15.2788 15.9859L20.6464 21.3536L21 21L21.3536 20.6464L15.9859 15.2788L15.6323 15.6323Z"
              fill="currentColor"
            />
          </svg>
        {/if}
      </div>

      {#if searchTerm && totalResults > 0}
        <p class="count">
          {totalResults} results for <strong>{searchTerm}</strong>
        </p>
      {/if}

      <div class="results">
        <ul>
          {#each results as result}
            <li>
              <a href={result.url || "#"}>
                <h4>
                  {result.title || result.name || "Untitled"}
                </h4>
                {#if result.content || result.description}
                  <p>{result.content || result.description}</p>
                {/if}
              </a>
            </li>
          {/each}
        </ul>
      </div>
    </div>
  </div>
{/if}

<style lang="postcss">
  * {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
  }

  :host {
    display: block;
  }

  button {
    &.action {
      all: unset;
      display: flex;
      padding: var(--space-sm);
      cursor: pointer;
    }

    &.close {
      position: absolute;
      top: 0;
      right: var(--space-md);
      z-index: 10;
      padding: var(--space-xs);
      color: var(--color-cream);
      background: none;
      border: none;
      cursor: pointer;
      transition: color 200ms;

      @media (min-width: 768px) {
        top: 2.5rem;
        right: var(--space-2xl);
      }

      &:hover {
        color: var(--color-lime);
      }
    }
  }

  .overlay {
    position: fixed;
    top: 0;
    left: -2rem;
    width: calc(100vw - 1rem);
    height: 100vh;
    background: var(--color-petrol);
    z-index: 1001;
    display: flex;
    flex-direction: column;

    @media (min-width: 768px) {
      left: 0;
      width: 100%;
    }

    .wrapper {
      position: relative;
      display: flex;
      flex-direction: column;
      gap: var(--space-sm);
      width: 100%;
      max-width: var(--page-max-width);
      height: 100%;
      margin: 0 auto;
      padding-top: 0.25rem;
      line-height: 1.5;
      letter-spacing: 0.75px;

      @media (min-width: 768px) {
        gap: var(--space-md);
        padding-top: var(--space-2xl);
      }

      > .search {
        position: relative;
        display: flex;
        flex-direction: row;
        align-items: center;
        width: 100%;
        max-width: 40rem;
        margin: 0 auto;
        padding: 0 var(--space-md);

        @media (min-width: 768px) {
          padding: 0;
          justify-content: center;
        }

        input {
          position: relative;
          width: calc(100% - 4rem);
          height: 2.5rem;
          padding: 0 3rem 0 var(--space-md);
          border: 2px solid transparent;
          border-radius: 9999px;
          background: var(--color-white);
          color: var(--color-petrol);
          font-family: var(--font-family);
          font-size: var(--font-size-base);
          outline: none;
          transition: border-color 0.2s ease;

          @media (min-width: 768px) {
            width: 100%;
            padding: 0 4rem 0 var(--space-lg);
          }

          &::placeholder {
            color: var(--color-gray);
          }
        }

        svg {
          position: absolute;
          left: 2.75rem;
          color: var(--color-petrol);
          pointer-events: none;

          @media (min-width: 768px) {
            left: var(--space);
          }

          &.spinner {
            color: var(--color-petrol);
            animation: spin 1s linear infinite;
          }
        }
      }

      > .count {
        width: 100%;
        max-width: 40rem;
        margin: 0 auto;
        padding: 0 var(--space-md);
        color: var(--color-cream);
        text-align: center;

        @media (min-width: 768px) {
          padding: 0;
          text-align: left;
        }
      }

      > .results {
        height: 100%;
        padding: 0 0 var(--space-md);
        overflow-y: auto;
        background: var(--color-cream);

        @media (min-width: 768px) {
          height: calc(100vh - var(--space-2xl));
          padding: 0 var(--space-2xl) var(--space-2xl);
        }

        > ul {
          display: flex;
          flex-direction: column;
          max-width: 40rem;
          list-style: none;
          margin: 0 auto;
          padding: var(--space-sm) var(--space-md);

          @media (min-width: 768px) {
            padding: var(--space) 0;
          }

          > li {
            padding: var(--space-sm) 0;
            border-bottom: 1px solid var(--color-sand);

            @media (min-width: 768px) {
              padding: var(--space) 0;
            }

            > a {
              display: flex;
              flex-direction: column;
              text-decoration: none;
              color: var(--color-petrol);

              > h4 {
                margin-bottom: var(--space-xs);
                font-size: var(--font-size-sm);
                font-weight: 600;
                transition: color 200ms;
                line-height: 1.3;

                @media (min-width: 768px) {
                  margin-bottom: var(--space-sm);
                  font-size: var(--font-size-base);
                }
              }

              > p {
                font-size: var(--font-size-xs);
                line-height: 1.4;

                @media (min-width: 768px) {
                  font-size: var(--font-size-sm);
                }
              }

              &:hover > h4 {
                color: var(--color-petrol-light);
              }
            }
          }
        }
      }
    }
  }

  @keyframes spin {
    from {
      transform: rotate(0deg);
    }
    to {
      transform: rotate(360deg);
    }
  }
</style>
