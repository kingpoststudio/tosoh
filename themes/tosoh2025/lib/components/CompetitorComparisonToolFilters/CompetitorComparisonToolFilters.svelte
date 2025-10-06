<svelte:options
  customElement={{
    tag: 'tosoh-competitor-comparison-tool-filters',
    shadow: 'none',
  }}
/>

<script lang="ts">
  import FilterForm from '../FiltersForm/FiltersForm.svelte';
  import Select from '../Select/Select.svelte';

  import Checkbox from '../CheckboxGroup/CheckboxGroup.svelte';
  import { deleteMultipleSearchParams, getUrlParam, updateUrl } from '../../utils/urlUtils';

  const allProductLines = window?.Tosoh?.CCT?.allProductLines || [];
  const activeCompetitorInstruments = window?.Tosoh?.CCT?.activeCompetitorInstruments || [];
  const instrumentsBasedOnProductLine = window?.Tosoh?.CCT?.instrumentsBasedOnProductLine || [];

  const formId = 'cct-filters';
  const printFormId = 'cct-print-filters';

  const isTosohInstrumentSelected = !!getUrlParam('tosoh_instrument_name');
  const isCompetitorInstrumentSelected = !!getUrlParam('competitor_instrument_name');

  const clearOnProductLineChange = () => {
    deleteMultipleSearchParams(['tosoh_instrument_name', 'competitor_instrument_name']);
  };

  const clearOnTosohInstrumentChange = () => {
    deleteMultipleSearchParams(['competitor_instrument_name']);
  };

  const clearOnProductLineReset = () => {
    deleteMultipleSearchParams([
      'product_line',
      'tosoh_instrument_name',
      'competitor_instrument_name',
    ]);

    window.location.search = window.location.search;
  };

  const clearOnTosohInstrumentReset = () => {
    deleteMultipleSearchParams(['tosoh_instrument_name', 'competitor_instrument_name']);
    window.location.search = window.location.search;
  };

  const clearOnCompetitorInstrumentReset = () => {
    deleteMultipleSearchParams(['competitor_instrument_name']);
    window.location.search = window.location.search;
  };

  const onChange = (event: Event) => {
    let name = (event?.target as HTMLSelectElement)?.name;

    if (name === 'product_line') {
      clearOnProductLineChange();
    }

    if (name === 'tosoh_instrument_name') {
      clearOnTosohInstrumentChange();
    }

    updateUrl(event);
  };

  const onDetails = () => {
    const tosohInstrumentName = (
      document.querySelector('select[name="tosoh_instrument_name"]') as HTMLSelectElement
    )?.value;

    const competitorInstrumentName = (
      document.querySelector('select[name="competitor_instrument_name"]') as HTMLSelectElement
    )?.value;

    const url = `/cct-comparison?tosoh_instrument_name=${tosohInstrumentName}&competitor_instrument_name=${competitorInstrumentName}`;
    window.open(url);
  };

  const onPrint = () => {};

  const splitCompetitorInstruments = (instruments: any[]) => {
    let withSufficientData = [];
    let withoutSufficientData = [];

    withSufficientData =
      instruments?.filter(
        (instrument) => instrument?.sufficient_data_status === 'sufficient_data'
      ) || [];
    withoutSufficientData =
      instruments?.filter(
        (instrument) => instrument?.sufficient_data_status === 'non_sufficient_data'
      ) || [];

    return [...withSufficientData, ...withoutSufficientData];
  };

  const customDisabledOption = (option: any) => {
    return option.sufficient_data_status === 'non_sufficient_data';
  };
</script>

<div
  class={`bg-ghost-white p-md h-fit rounded-lg transition-all duration-100 lg:sticky lg:top-[6rem] lg:z-10 lg:min-w-[16rem] xl:min-w-[20rem]`}
>
  <div class="flex w-full items-center justify-between">
    <p class="font-sans-narrow text-2xl font-semibold">Select</p>
  </div>
  <FilterForm trigger="change" {onChange} {formId}>
    <div class="mt-base">
      <Select
        options={allProductLines}
        placeholder="All Product Lines"
        name="product_line"
        label="Product Line"
        customClearFilter={clearOnProductLineReset}
      />
    </div>
    <div class="mt-base">
      <Select
        options={instrumentsBasedOnProductLine
          ? instrumentsBasedOnProductLine?.map((instrument) => ({
              label: instrument,
              name: instrument,
            }))
          : []}
        name="tosoh_instrument_name"
        label="Tosoh Instrument"
        customClearFilter={clearOnTosohInstrumentReset}
      />
    </div>
    <div class="mt-base">
      <Select
        options={splitCompetitorInstruments(activeCompetitorInstruments)}
        name="competitor_instrument_name"
        label="Competitor Instrument"
        disabled={!isTosohInstrumentSelected}
        {customDisabledOption}
        customClearFilter={clearOnCompetitorInstrumentReset}
      />
    </div>
  </FilterForm>

  <FilterForm trigger="submit" onSubmit={onPrint} formId={printFormId}>
    <div class="mt-base">
      <Checkbox
        options={[
          { label: 'Lab Manager', name: 'lab_manager' },
          { label: 'Lab Technician', name: 'lab_technician' },
          { label: 'Procurement Manager', name: 'procurement_manager' },
          { label: 'Clinician', name: 'clinician' },
          { label: 'Proof', name: 'proof' },
          { label: 'Competitor', name: 'competitor' },
          { label: 'Tosoh Counter Argumentation', name: 'tosoh_counter_argumentation' },
        ]}
        name="option_to_print"
        label="For Who (Option to print)"
        disabled={false}
      />
    </div>
    <button type="button" onclick={onPrint} class="outlined mt-md w-full hover:bg-red-50">
      Print</button
    >
    <button
      type="button"
      onclick={onDetails}
      disabled={!isTosohInstrumentSelected || !isCompetitorInstrumentSelected}
      class="mt-sm w-full hover:bg-red-50"
    >
      Details</button
    >
  </FilterForm>

  <a
    href="/cct-submit-a-suggestion"
    target="_blank"
    class="button mt-md dark block w-full text-center hover:bg-red-50"
  >
    Submit a Suggestion
  </a>
</div>
