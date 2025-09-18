<svelte:options
  customElement={{
    tag: 'tosoh-cct-filters',
    shadow: 'none',
  }}
/>

<script lang="ts">
  import FilterForm from '../FilterForm/FilterForm.svelte';
  import Checkbox from '../Checkbox/Checkbox.svelte';
  import Select from '../Select/Select.svelte';
  import type {
    CCTComparison,
    CCTComparisons,
    CCTInstrument,
    FilterWithOptions,
  } from '../../../types/hubdb';
  import type { ColumnId } from '../../../types/hubdb';
  import { onMount } from 'svelte';
  import { filterRows, parseFilterOptions } from '../../utils/filterUtils';

  const allInstruments = window?.Tosoh?.CCT?.allInstruments;
  const allComparisons = window?.Tosoh?.CCT?.allComparisons;
  const filters = ['tosoh_instrument_name', 'competitor_instrument_name'];
  let allAvailableFiltersWithTheirOptions: FilterWithOptions | {} = $state({});

  // Create a function which unifies the data from allComparisons into allInstruments

  const onChange = (event: Event) => {};

  const onReset = () => {};

  const populateIdWithLabel = (id: string) => {
    //Find all the instruments in allInstruments that have the id
    //Take the name of the instrument
  };

  const onSubmit = (event: Event) => {
    event.preventDefault();
    console.log('onSubmit');
  };

  const onDetails = () => {
    console.log('onDetails');
  };

  const submitSuggestion = () => {
    console.log('submitSuggestion');
  };

  const parseOptions = () => {
    if (allComparisons?.objects?.length > 0) {
      filterValuesForSelectsBasedOnUrl(allComparisons?.objects);
    }
  };

  const filterValuesForSelectsBasedOnUrl = (allRows: any) => {
    if (!allRows || allRows.length === 0) {
      return;
    }

    const filteredRows = filterRows(allRows, filters as ColumnId[]);

    console.log(filteredRows, 'filteredRows');
    allAvailableFiltersWithTheirOptions = parseFilterOptions(filteredRows);
  };

  onMount(() => {
    parseOptions();
  });
</script>

<div
  class={`bg-ghost-white p-md h-fit rounded-lg transition-all duration-100 lg:sticky lg:top-[6rem] lg:z-10 lg:min-w-[16rem] xl:min-w-[20rem]`}
>
  <div class="flex w-full items-center justify-between">
    <p class="font-sans-narrow text-2xl font-semibold">Select</p>
  </div>
  <FilterForm trigger="change" {onChange} {onReset}>
    <div class="mt-base">
      <Select
        options={(allAvailableFiltersWithTheirOptions as FilterWithOptions)[
          filters[0] as ColumnId
        ] as any[]}
        name={filters[0]}
        disabled={false}
        label="Tosoh Instrument"
      />
    </div>
    <div class="mt-base">
      <Select
        options={(allAvailableFiltersWithTheirOptions as FilterWithOptions)[
          filters[1] as ColumnId
        ] as any[]}
        name={filters[1]}
        label="Competitor Instrument"
        disabled={false}
      />
    </div>
  </FilterForm>

  <!-- <FilterForm trigger="submit" {onSubmit} {onReset}>
    <div class="mt-base">
      <Checkbox
        options={personas}
        name="persona"
        label="For Who (Option to print)"
        disabled={false}
      />
    </div>
    <div class="gap-sm mt-md flex w-full flex-row lg:flex-col">
      <button type="submit" data-type="reset" class="outlined w-full hover:bg-red-50">
        Print</button
      >
      <button type="button" onclick={onDetails} class=" w-full hover:bg-red-50"> Details</button>
      <button type="button" onclick={submitSuggestion} class="mt-md dark w-full hover:bg-red-50">
        Submit A Suggestion
      </button>
    </div>
  </FilterForm> -->
</div>
