<svelte:options
  customElement={{
    tag: 'tosoh-cct-filters',
    shadow: 'none',
  }}
/>

<script lang="ts">
  import FilterForm from '../FiltersForm/FiltersForm.svelte';
  import Select from '../Select/Select.svelte';
  import { deleteMultipleSearchParams, getUrlParam, updateUrl } from '../../utils/urlUtils';
  import { generateCCTDocument } from '../../utils/cctDocument/generateCCTDocument';

  const allProductLines = window?.Tosoh?.CCT?.allProductLines || [];
  const activeCompetitorInstruments = window?.Tosoh?.CCT?.activeCompetitorInstruments || [];
  const instrumentsBasedOnProductLine = window?.Tosoh?.CCT?.instrumentsBasedOnProductLine || [];
  const tosohInstrument = window?.Tosoh?.CCT?.tosohInstrument;
  const competitorInstrument = window?.Tosoh?.CCT?.competitorInstrument;
  const cctDetailsPath = window?.Tosoh?.CCT?.cctDetailsPath;
  const submitASuggestionPath = window?.Tosoh?.CCT?.submitASuggestionPath;
  const filtersSidebarTitle = window?.Tosoh?.CCT?.filtersSidebarTitle;
  const productLineTitle = window?.Tosoh?.CCT?.productLineTitle;
  const tosohInstrumentTitle = window?.Tosoh?.CCT?.tosohInstrumentTitle;
  const competitorInstrumentTitle = window?.Tosoh?.CCT?.competitorInstrumentTitle;
  const printColumnsTitle = window?.Tosoh?.CCT?.printColumnsTitle;
  const printButtonLabel = window?.Tosoh?.CCT?.printButtonLabel;
  const detailsButtonLabel = window?.Tosoh?.CCT?.detailsButtonLabel;
  const submitASuggestionButtonLabel = window?.Tosoh?.CCT?.submitASuggestionButtonLabel;

  const _rawComparisonRows = window?.Tosoh?.CCT?.comparisonRows;
  const comparisonRows = Array.isArray(_rawComparisonRows)
    ? _rawComparisonRows
    : _rawComparisonRows?.objects || [];

  const formId = 'cct-filters';

  const isTosohInstrumentSelected = !!getUrlParam('tosoh_instrument_name');
  const isCompetitorInstrumentSelected = !!getUrlParam('competitor_instrument_name');

  const selectedTosohInstrument = (
    isTosohInstrumentSelected ? getUrlParam('tosoh_instrument_name') : 'none'
  ) as string;
  const selectedCompetitorInstrument = (
    isCompetitorInstrumentSelected ? getUrlParam('competitor_instrument_name') : 'none'
  ) as string;

  let tosohInstrumentSelectValue: string = $state(selectedTosohInstrument);
  let competitorInstrumentSelectValue: string = $state(selectedCompetitorInstrument);

  const printColumnOptions = [
    { label: 'Lab Manager', name: 'lab_manager' },
    { label: 'Lab Technician', name: 'lab_technician' },
    { label: 'Procurement Manager', name: 'procurement_manager' },
    { label: 'Clinician', name: 'clinician' },
  ];
  let selectedPrintColumns: string[] = $state([]);

  const handlePrintColumnChange = (event: Event) => {
    const target = event.target as HTMLInputElement;
    const value = target.value;
    const checked = target.checked;

    if (checked) {
      selectedPrintColumns = [...selectedPrintColumns, value];
    } else {
      selectedPrintColumns = selectedPrintColumns.filter((col) => col !== value);
    }
  };

  const clearOnProductLineChange = () => {
    deleteMultipleSearchParams(['tosoh_instrument_name', 'competitor_instrument_name']);
  };

  const clearOnTosohInstrumentChange = () => {
    deleteMultipleSearchParams(['competitor_instrument_name']);
  };

  const clearAndReload = (params: string[]) => {
    deleteMultipleSearchParams(params);
    window.location.reload();
  };

  const clearOnProductLineReset = () =>
    clearAndReload(['product_line', 'tosoh_instrument_name', 'competitor_instrument_name']);

  const clearOnTosohInstrumentReset = () =>
    clearAndReload(['tosoh_instrument_name', 'competitor_instrument_name']);

  const clearOnCompetitorInstrumentReset = () => clearAndReload(['competitor_instrument_name']);

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

  const onPrint = async () => {
    const docxLogo = window?.Tosoh?.CCT?.docxLogo;
    if (!tosohInstrument && !competitorInstrument) {
      console.warn('No instruments selected');
      return;
    }

    if (selectedPrintColumns.length === 0) {
      alert('Please select at least one column to include in the document.');
      return;
    }

    await generateCCTDocument(
      { src: docxLogo?.src || '', alt: docxLogo?.alt || '' },
      tosohInstrument,
      competitorInstrument,
      comparisonRows,
      selectedPrintColumns
    );
  };

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
  class="bg-ghost-white p-md h-fit rounded-lg transition-all duration-100 lg:sticky lg:top-[8rem] lg:z-10 lg:min-w-[16rem] xl:min-w-[20rem]"
>
  <div class="flex w-full items-center justify-between">
    <p class="font-sans-narrow text-2xl font-semibold">{filtersSidebarTitle}</p>
  </div>
  <FilterForm trigger="change" {onChange} {formId}>
    <div class="mt-base">
      <Select
        excludeAllOption={true}
        options={allProductLines}
        placeholder="All Product Lines"
        name="product_line"
        label={productLineTitle}
        customClearFilter={clearOnProductLineReset}
      />
    </div>
    <div class="mt-base">
      <Select
        excludeAllOption={true}
        options={instrumentsBasedOnProductLine
          ? instrumentsBasedOnProductLine?.map((instrument) => ({
              label: instrument,
              name: instrument,
            }))
          : []}
        name="tosoh_instrument_name"
        label={tosohInstrumentTitle}
        customClearFilter={clearOnTosohInstrumentReset}
        bind:value={tosohInstrumentSelectValue}
      />
    </div>
    <div class="mt-base">
      <Select
        excludeAllOption={true}
        options={splitCompetitorInstruments(activeCompetitorInstruments)}
        name="competitor_instrument_name"
        label={competitorInstrumentTitle}
        disabled={!isTosohInstrumentSelected}
        {customDisabledOption}
        customClearFilter={clearOnCompetitorInstrumentReset}
        bind:value={competitorInstrumentSelectValue}
      />
    </div>
  </FilterForm>

  <div class="mt-base">
    <div class="gap-sm flex flex-col">
      <div class="text-lg font-semibold">{printColumnsTitle}</div>
      <div class="gap-sm flex flex-col">
        {#each printColumnOptions as option (option.name)}
          <label
            class="gap-sm hover:text-imperial-red flex cursor-pointer items-center transition-colors duration-200"
          >
            <input
              type="checkbox"
              name="print_column"
              value={option.name}
              checked={selectedPrintColumns.includes(option.name)}
              onchange={handlePrintColumnChange}
              class="checkbox-custom focus:ring-imperial-red text-imperial-red h-base w-base focus:ring-opacity-50 cursor-pointer rounded border-slate-200 focus:ring-1 focus:outline-none"
            />
            <span class="text-default select-none">{option.label}</span>
          </label>
        {/each}
      </div>
    </div>
    <button
      type="button"
      onclick={onPrint}
      disabled={!isTosohInstrumentSelected ||
        !isCompetitorInstrumentSelected ||
        selectedPrintColumns?.length === 0}
      class="outlined mt-md w-full hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-50"
    >
      {printButtonLabel}
    </button>
    <a
      href={`${cctDetailsPath?.url?.href || ''}?tosoh_instrument_name=${tosohInstrumentSelectValue}&competitor_instrument_name=${competitorInstrumentSelectValue}`}
      target={cctDetailsPath?.open_in_new_tab ? '_blank' : '_self'}
      rel={cctDetailsPath?.no_follow ? 'nofollow' : ''}
      class={`button mt-sm! block w-full! text-center hover:bg-red-50 ${!isTosohInstrumentSelected || !isCompetitorInstrumentSelected ? 'cursor-not-allowed opacity-50' : ''}`}
    >
      {detailsButtonLabel}
    </a>
  </div>

  <a
    href={submitASuggestionPath?.url?.href || ''}
    target={submitASuggestionPath?.open_in_new_tab ? '_blank' : '_self'}
    rel={submitASuggestionPath?.no_follow ? 'nofollow' : ''}
    class="button mt-md dark block w-full text-center hover:bg-red-50"
  >
    {submitASuggestionButtonLabel}
  </a>
</div>

<style>
  .checkbox-custom {
    appearance: none;
    background-color: transparent;
    border: 1px solid var(--color-border);
    transition: all 0.2s ease-in-out;
    position: relative;
  }

  .checkbox-custom:checked {
    background-color: var(--color-imperial-red);
    border-color: var(--color-imperial-red);
  }

  .checkbox-custom:checked::after {
    content: '';
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 0.375rem;
    height: 0.625rem;
    border: solid white;
    border-width: 0 2px 2px 0;
    transform: translate(-50%, -60%) rotate(45deg);
  }

  .checkbox-custom:hover:not(:disabled) {
    border-color: var(--color-imperial-red);
  }

  .checkbox-custom:disabled {
    opacity: 0.7;
  }

  .checkbox-custom:focus {
    box-shadow: 0 0 0 1px var(--color-imperial-red);
  }

  label:hover .checkbox-custom:not(:disabled) {
    border-color: var(--color-imperial-red);
  }
</style>
