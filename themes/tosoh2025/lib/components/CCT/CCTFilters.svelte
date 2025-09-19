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
  import type { CCTComparisons, CCTComparisonColumnId } from '../../../types/hubdb';
  import { onMount } from 'svelte';
  import { filterRows, parseFilterOptions } from '../../utils/filterUtils';
  import { addCompanyNameToCompetitorInstrumentName } from '../../utils/cctFilterUtils';
  import { updateUrl } from '../../utils/urlUtils';

  const allInstruments = window?.Tosoh?.CCT?.allInstruments;
  const allComparisons = window?.Tosoh?.CCT?.allComparisons;
  const filters: CCTComparisonColumnId[] = ['tosoh_instrument_name', 'competitor_instrument_name'];
  let allAvailableFiltersWithTheirOptions: any = $state({});
  const onChange = (event: Event) => {
    // onReset();
    // updateUrl(event);
  };

  const onReset = () => {};

  //name of competitor_instrument_name should have the name of the company at the front.

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
      filterValuesForSelectsBasedOnUrl(allComparisons);
    }
  };

  const filterValuesForSelectsBasedOnUrl = (allRows: CCTComparisons) => {
    if (!allRows?.objects || allRows.objects.length === 0) {
      return;
    }

    // Add company names to competitor instrument names
    const processedRows = addCompanyNameToCompetitorInstrumentName(allRows, allInstruments);
    const filteredRows = filterRows(processedRows?.objects as any, filters as any[]);

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
        options={allAvailableFiltersWithTheirOptions[filters[0]] as any[]}
        name={filters[0]}
        disabled={false}
        label="Tosoh Instrument"
      />
    </div>
    <div class="mt-base">
      <Select
        options={allAvailableFiltersWithTheirOptions[filters[1]] as any[]}
        name={filters[1]}
        label="Competitor Instrument"
        disabled={false}
      />
    </div>
  </FilterForm>
  <button type="button" onclick={onDetails} class="mt-md w-full hover:bg-red-50"> Details</button>

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
