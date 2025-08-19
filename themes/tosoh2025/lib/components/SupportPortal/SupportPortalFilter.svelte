<svelte:options
  customElement={{
    shadow: 'none',
  }}
/>

<script>
  import { onMount } from 'svelte';
  let formElement = $state(null);
  let { onFormSubmit } = $props();

  const setFormValuesFromUrl = () => {
    const params = new URLSearchParams(window.location.search);

    for (const [key, value] of params) {
      console.log(key, value);
    }
    Array.from(formElement.elements).forEach((element) => {
      const name = element.getAttribute('name');
      if (!name) return;

      const values = params.getAll(name).flatMap((value) => value.split(','));

      if (values.length) {
        if (element.tagName === 'SELECT') {
          const select = element;
          Array.from(select.options).forEach((option) => {
            option.selected = values.includes(option.value);
          });
        } else if (element.tagName === 'INPUT' && element.type === 'checkbox') {
          const checkbox = element;
          checkbox.checked = values.includes(checkbox.value);
        } else if (element.tagName === 'INPUT' && element.type === 'radio') {
          const radio = element;
          radio.checked = values.includes(radio.value);
        } else {
          element.value = values.join(',');
        }
      }
    });
  };

  const setFormValuesToParams = (resetForm = false) => {
    if (!formElement) return;

    const formData = new FormData(formElement);
    const url = new URL(window.location.href);

    const formValues = Array.from(formElement.elements).reduce((acc, element) => {
      const name = element.getAttribute('name');
      if (!name) return acc;

      if (!acc[name]) {
        acc[name] = Array.from(formData.getAll(name));
      }

      acc[name] = acc[name]?.filter((value) => value) || [];

      return acc;
    }, {});

    Object.keys(formValues).forEach((name) => {
      const values = formValues[name];

      if (resetForm || !values.length || (values.length === 1 && !values[0])) {
        url.searchParams.delete(name);
      } else if (values.length === 1) {
        url.searchParams.set(name, values[0]);
      } else {
        url.searchParams.set(name, values.join(','));
      }
    });

    if (resetForm) {
      formElement.reset();
    }

    window.history.pushState({ filterGroupId: 'support-portal-filter', params: formValues }, '');
  };

  const getFilterOptions = async () => {
    const response = await fetch(
      'https://145184808.hs-sites-eu1.com/hs/serverless/get-support-portal-filter-options'
    );
    const data = await response.json();
    console.log(data.data.HUBDB.support_portal_collection.items?.length, 'dataFilter');
  };

  const handleFormSubmit = (event) => {
    event.preventDefault();
    setFormValuesToParams(false);
    const formData = new FormData(formElement);
    onFormSubmit(formData);
  };

  onMount(() => {
    setFormValuesFromUrl();
    getFilterOptions();
  });
</script>

{#snippet searchInput()}
  <div class="mt-md relative w-full rounded-lg border border-slate-200">
    <input
      name="search"
      class=" p-sm placeholder:text-default focus:outline-imperial-red h-full w-full rounded-md"
      placeholder="Search here..."
    />
    <div class="right-sm absolute top-[50%] max-h-[1.45rem] max-w-[1.45rem] -translate-y-1/2">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="100%"
        height="100%"
        viewBox="0 0 23 23"
        fill="none"
      >
        <path
          d="M17.3528 17.8152L21.1977 21.6601M19.9831 11.0491C19.9831 13.5323 18.9966 15.9137 17.2408 17.6695C15.485 19.4254 13.1036 20.4118 10.6204 20.4118C8.13731 20.4118 5.75589 19.4254 4.00006 17.6695C2.24423 15.9137 1.25781 13.5323 1.25781 11.0491C1.25781 8.56603 2.24423 6.18461 4.00006 4.42877C5.75589 2.67294 8.13731 1.68652 10.6204 1.68652C13.1036 1.68652 15.485 2.67294 17.2408 4.42877C18.9966 6.18461 19.9831 8.56603 19.9831 11.0491Z"
          stroke="#ED1A3A"
          stroke-width="1.87252"
          stroke-linecap="round"
          stroke-linejoin="round"
        />
      </svg>
    </div>
  </div>
{/snippet}

{#snippet dropDownSelection(title, options, name)}
  <div class="mt-md gap-sm flex flex-col">
    <label for={name} class="font-arial text-xl font-black">{title}</label>
    <select
      id={name}
      {name}
      placeholder="Select"
      class="p-2xl text-red p-sm rounded-lg border border-slate-200"
    >
      <option value="none" selected disabled hidden>Select</option>
      {#each options as option}
        <option value={option.value}>{option.label}</option>
      {/each}
    </select>
  </div>{/snippet}

<div class="wrapper bg-ghost-white p-md rounded-lg">
  <div class="gap-5xl flex items-center">
    <p class="font-sans-narrow text-2xl font-semibold">Filter</p>
    <div class="max-h-[1.375rem] max-w-[1rem]">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="100%"
        height="100%"
        viewBox="0 0 22 16"
        fill="none"
      >
        <path
          d="M0.295898 1.60442C0.295898 1.34881 0.397441 1.10366 0.578189 0.922915C0.758936 0.742168 1.00408 0.640625 1.2597 0.640625H20.5357C20.7913 0.640625 21.0364 0.742168 21.2172 0.922915C21.3979 1.10366 21.4995 1.34881 21.4995 1.60442C21.4995 1.86004 21.3979 2.10519 21.2172 2.28593C21.0364 2.46668 20.7913 2.56822 20.5357 2.56822H1.2597C1.00408 2.56822 0.758936 2.46668 0.578189 2.28593C0.397441 2.10519 0.295898 1.86004 0.295898 1.60442ZM3.50856 8.02975C3.50856 7.77414 3.61011 7.52899 3.79085 7.34825C3.9716 7.1675 4.21675 7.06596 4.47236 7.06596H17.323C17.5786 7.06596 17.8238 7.1675 18.0045 7.34825C18.1853 7.52899 18.2868 7.77414 18.2868 8.02975C18.2868 8.28537 18.1853 8.53052 18.0045 8.71126C17.8238 8.89201 17.5786 8.99355 17.323 8.99355H4.47236C4.21675 8.99355 3.9716 8.89201 3.79085 8.71126C3.61011 8.53052 3.50856 8.28537 3.50856 8.02975ZM7.36376 14.4551C7.36376 14.1995 7.46531 13.9543 7.64605 13.7736C7.8268 13.5928 8.07195 13.4913 8.32756 13.4913H13.4678C13.7234 13.4913 13.9686 13.5928 14.1493 13.7736C14.3301 13.9543 14.4316 14.1995 14.4316 14.4551C14.4316 14.7107 14.3301 14.9558 14.1493 15.1366C13.9686 15.3173 13.7234 15.4189 13.4678 15.4189H8.32756C8.07195 15.4189 7.8268 15.3173 7.64605 15.1366C7.46531 14.9558 7.36376 14.7107 7.36376 14.4551Z"
          fill="#E4032D"
        />
      </svg>
    </div>
  </div>
  <form bind:this={formElement} on:submit={handleFormSubmit}>
    {@render searchInput()}
    {@render dropDownSelection(
      'Product Family',
      [
        { value: '1', label: '1' },
        { value: '2', label: '2' },
      ],
      'product_family'
    )}
    {@render dropDownSelection(
      'Product type',
      [
        { value: '1', label: '1' },
        { value: '2', label: '2' },
      ],
      'product_type'
    )}

    <button type="submit" class="bg-imperial-red p-sm rounded-lg text-white"> Submit </button>
  </form>
</div>
