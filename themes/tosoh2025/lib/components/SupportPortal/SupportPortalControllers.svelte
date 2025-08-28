<script lang="ts">
  import { onMount } from 'svelte';
  import { createFormManager, type FormManagerInstance } from '../../utils/FormManager';
  let { onControllerSubmit, totalItems } = $props();

  const params = new URLSearchParams(window.location.search);
  let options = [6, 12, 18];

  let formElement: HTMLFormElement | null = $state(null);
  let formManager: FormManagerInstance | null = $state(null);

  let limit = $state(parseInt(params?.get('limit') || '12'));
  let numberOfPages = $derived(Math.ceil(totalItems / limit));
  let pagesArray = $derived(Array.from({ length: numberOfPages }, (_, i) => i + 1));

  let pagination = $state(parseInt(params?.get('pagination') || '1'));
  let canGoBackward = $derived(pagination - 1 > 0);
  let canGoForward = $derived(pagination + 1 <= numberOfPages);

  const handleFormSubmit = (event: Event) => {
    if (!formElement) return;

    onControllerSubmit(event);
  };

  const moveBackward = (e: Event) => {
    const url = new URL(window.location.href);
    let pagination = url.searchParams.get('pagination');

    if (pagination && parseInt?.(pagination) - 1 > 0) {
      pagination = (parseInt?.(pagination) - 1) as any;
      url.searchParams?.set('pagination', (pagination as any)?.toString());
      window.location.href = url?.toString();
    }
  };

  const moveForward = (e: Event) => {
    const url = new URL(window.location.href);
    let pagination = url.searchParams.get('pagination');

    if (pagination && parseInt?.(pagination) + 1 <= numberOfPages) {
      pagination = (parseInt?.(pagination) + 1) as any;
      url.searchParams?.set('pagination', (pagination as any)?.toString());
      window.location.href = url?.toString();
    }
  };

  const initiateFormManager = () => {
    if (formElement && !formManager) {
      formManager = createFormManager(formElement, {
        onValueChange: (e) => {
          handleFormSubmit(e);
        },
        triggerType: 'valueChange',
      });
    }
  };

  const initControllers = () => {
    const url = new URL(window.location.href);

    if (!url.searchParams.get('pagination')) {
      url.searchParams.set('pagination', '1');
    }
    if (!url.searchParams.get('limit')) {
      url.searchParams.set('limit', '12');
    }

    window.history.pushState({}, '', url.toString().replace(/%2C/g, ','));
  };

  onMount(() => {
    initiateFormManager();
    initControllers();
  });
</script>

<form
  bind:this={formElement}
  class="lg:p-sm gap-sm mt-base flex w-full flex-col-reverse justify-center lg:flex-row lg:justify-between"
>
  <div class="gap-sm flex items-center justify-center text-[#4E4F54]">
    <p>Items per page:</p>
    <select
      bind:value={limit}
      name="limit"
      class="bg-ghost-white p-xs rounded border border-slate-200"
    >
      {#each options as option}
        <option value={option}>{option}</option>
      {/each}
    </select>
    <p>
      {(pagination - 1) * limit || 1} - {Math.min((pagination - 1) * limit + limit, totalItems)} of {totalItems}
      items
    </p>
  </div>
  <div class="gap-sm flex justify-center">
    <div class="gap-sm flex items-center text-[#4E4F54]">
      <select
        bind:value={pagination}
        name="pagination"
        class="bg-ghost-white p-xs rounded border border-slate-200"
      >
        {#each pagesArray as page}
          <option value={page}>
            {page}
          </option>
        {/each}
      </select>
      <p>
        of {numberOfPages}
        {numberOfPages === 1 ? 'page' : 'pages'}
      </p>
    </div>
    <div class="gap-sm flex">
      <button
        type="button"
        class="p-sm! outlined border-[#E1E2E3]! text-default! flex aspect-square h-[2.75rem] cursor-pointer items-center justify-center rounded-xl border disabled:cursor-not-allowed disabled:opacity-50"
        aria-label="go one page back"
        onclick={moveBackward}
        disabled={!canGoBackward}
      >
        <div class="h-[0.95rem]">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="100%"
            height="100%"
            viewBox="0 0 10 18"
            fill="none"
          >
            <path
              d="M8.39266 16.0549L1.38184 9.04403L8.39266 2.0332"
              stroke="#4E4F54"
              stroke-width="2.54939"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
          </svg>
        </div>
      </button>
      <button
        type="button"
        class="p-sm! outlined border-[#E1E2E3]! text-default! flex aspect-square h-[2.75rem] cursor-pointer items-center justify-center rounded-xl border disabled:cursor-not-allowed disabled:opacity-50"
        aria-label="go one page after"
        onclick={moveForward}
        disabled={!canGoForward}
      >
        <div class="h-[0.95rem]">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="100%"
            height="100%"
            viewBox="0 0 10 18"
            fill="none"
          >
            <path
              d="M1.64258 16.0549L8.6534 9.04403L1.64258 2.0332"
              stroke="#4E4F54"
              stroke-width="2.54939"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
          </svg>
        </div>
      </button>
    </div>
  </div>
</form>

<!-- 
Support Portal should handle throufh URL params the following: 
- Search - not yet implemented
-->
