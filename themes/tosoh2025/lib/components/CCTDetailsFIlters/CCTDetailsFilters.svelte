<svelte:options
  customElement={{
    tag: 'tosoh-cct-details-filters',
    shadow: 'none',
  }}
/>

<script lang="ts">
  import { fade } from 'svelte/transition';
  import FilterForm from '../FilterForm/FilterForm.svelte';
  import Select from '../Select/Select.svelte';
  import type { FilterWithOptions, ColumnId } from '../../../types/hubdb';

  const onChange = (event: Event) => {
    onReset();

    // updateUrl(event);
  };

  const onReset = () => {};
</script>

{#snippet magnifier()}
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
{/snippet}

<FilterForm trigger="change" {onChange} {onReset} customClasses="w-full">
  <div
    transition:fade={{ duration: 100 }}
    class="gap-base p-sm flex w-full flex-col items-center justify-end md:flex-row"
  >
    <div class="w-full min-w-[16rem] md:w-fit">
      <Select
        disableReset={true}
        placeholder={'Select Category'}
        displayLabel={false}
        options={[
          { name: 'Basic Specifications', label: 'Basic Specifications' },
          { name: 'Application Range', label: 'Application Range' },
          { name: 'Measurement Modes', label: 'Measurement Modes' },
          { name: 'Throughput Capacity', label: 'Throughput Capacity' },
          { name: 'Sample Range', label: 'Sample Range' },
          { name: 'Variant Mode Results', label: 'Variant Mode Results' },
          { name: 'Standard Mode Results', label: 'Standard Mode Results' },
        ]}
        name={'category'}
        disabled={false}
      />
    </div>

    <div class={`relative w-full min-w-[16rem] rounded-lg  border border-slate-200 md:w-fit`}>
      <input
        oninput={() => {}}
        name={'search'}
        data-debounce="500"
        class=" p-base placeholder:text-default focus:outline-imperial-red h-full w-full rounded-md pr-8"
        placeholder={'Search here...'}
      />
      <div
        class="right-sm absolute top-[50%] flex max-h-[1.45rem] max-w-[1.45rem] -translate-y-1/2 items-center"
      >
        {@render magnifier()}
      </div>
    </div>

    <button type="button" data-type="reset" class="w-full md:w-fit"> Reset Filters </button>
  </div>
</FilterForm>
