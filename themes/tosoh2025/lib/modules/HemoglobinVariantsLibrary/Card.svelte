<script lang="ts">
  import type { HemoglobinVariantsLibraryItem } from '../../../types/hemoglobinVariantsLibrary';
  import { constructCDNUrl, onTagClick } from '../../utils/utils';

  let { item }: { item: HemoglobinVariantsLibraryItem } = $props();

  const {
    aka,
    area_under_peak,
    comments,
    document_url,
    ethnicity,
    heterozygote_clinical_presentation,
    heterozygote_comments,
    heterozygote_laboratory_findings,
    hgvs_name,
    homozygote_clinical_presentation,
    homozygote_comments,
    homozygote_laboratory_findings,
    instrument,
    mutation,
    mutation_description,
    references,
    rt_max,
    rt_min,
    variant_image,
    variant_name,
    window: windowType,
  } = item?.values;

  const hemoglobinVariantsLibraryContent = window?.Tosoh?.HemoglobinVariantsLibraryContent;
  const viewDetailsLabel =
    hemoglobinVariantsLibraryContent?.card_configuration?.view_details_label || 'View Details';
  const cardConfiguration = hemoglobinVariantsLibraryContent?.card_configuration;

  const downloadLabel = cardConfiguration?.download_label || 'Download PDF';
  const alsoKnownAsLabel = cardConfiguration?.also_known_as_label || 'Also known as:';
  const mutationTypeLabel = cardConfiguration?.mutation_type_label || 'Mutation Type:';
  const mutationDescriptionLabel =
    cardConfiguration?.mutation_description_label || 'Mutation Description:';
  const migrationZoneLabel = cardConfiguration?.migration_zone_label || 'Migration Zone:';
  const variantDetailsLabel = cardConfiguration?.variant_details_label || 'Variant Details:';
  const propertyLabel = cardConfiguration?.property_label || 'Property:';
  const valueLabel = cardConfiguration?.value_label || 'Value:';

  const schemaConfiguration = cardConfiguration?.schema_configuration;
  const variantNameLabel = schemaConfiguration?.variant_name_label || 'Variant Name';
  const hgvsNameLabel = schemaConfiguration?.hgvs_name_label || 'HGVS Name';
  const mutationLabel = schemaConfiguration?.mutation_label || 'Mutation';
  const mutationDescriptionSchemaLabel =
    schemaConfiguration?.mutation_description_label || 'Mutation Description';
  const heterozygoteClinicalPresentationLabel =
    schemaConfiguration?.heterozygote_clinical_presentation_label ||
    'Heterozygote Clinical Presentation';
  const heterozygoteLaboratoryFindingsLabel =
    schemaConfiguration?.heterozygote_laboratory_findings_label ||
    'Heterozygote Laboratory Findings';
  const heterozygoteCommentsLabel =
    schemaConfiguration?.heterozygote_comments_label || 'Heterozygote Comments';
  const homozygoteClinicalPresentationLabel =
    schemaConfiguration?.homozygote_clinical_presentation_label ||
    'Homozygote Clinical Presentation';
  const homozygoteLaboratoryFindingsLabel =
    schemaConfiguration?.homozygote_laboratory_findings_label || 'Homozygote Laboratory Findings';
  const homozygoteCommentsLabel =
    schemaConfiguration?.homozygote_comments_label || 'Homozygote Comments';
  const ethnicityLabel = schemaConfiguration?.ethnicity_label || 'Ethnicity';
  const additionalCommentsLabel =
    schemaConfiguration?.additional_comments_label || 'Additional Comments';
  const instrumentLabel = schemaConfiguration?.instrument_label || 'Instrument';
  const percentMinMaxLabel = schemaConfiguration?.percent_min_max_label || '% Min-Max';
  const rtMinLabel = schemaConfiguration?.rt_min_label || 'RT Min';
  const rtMaxLabel = schemaConfiguration?.rt_max_label || 'RT Max';
  const migrationInWindowLabel =
    schemaConfiguration?.migration_in_window_label || 'Migration in window';
  const referencesLabel = schemaConfiguration?.references_label || 'References';

  const schema = [
    { label: variantNameLabel, value: variant_name },
    { label: hgvsNameLabel, value: hgvs_name },
    { label: mutationLabel, value: mutation.label },
    { label: mutationDescriptionSchemaLabel, value: mutation_description },
    { label: heterozygoteClinicalPresentationLabel, value: heterozygote_clinical_presentation },
    { label: heterozygoteLaboratoryFindingsLabel, value: heterozygote_laboratory_findings },
    { label: heterozygoteCommentsLabel, value: heterozygote_comments },
    { label: homozygoteClinicalPresentationLabel, value: homozygote_clinical_presentation },
    { label: homozygoteLaboratoryFindingsLabel, value: homozygote_laboratory_findings },
    { label: homozygoteCommentsLabel, value: homozygote_comments },
    { label: ethnicityLabel, value: ethnicity },
    { label: additionalCommentsLabel, value: comments },
    { label: instrumentLabel, value: instrument.label },
    { label: percentMinMaxLabel, value: area_under_peak },
    { label: rtMinLabel, value: rt_min },
    { label: rtMaxLabel, value: rt_max },
    { label: migrationInWindowLabel, value: windowType?.label },
    { label: referencesLabel, value: references },
  ];
</script>

<div
  class={`border-border relative flex h-full w-full flex-col content-around gap-[1.25rem] rounded-2xl border p-[1.25rem]`}
>
  {#if variant_image?.url}
    <img
      alt={item.name}
      src={constructCDNUrl(variant_image?.url, 350)}
      loading="lazy"
      class="max-h-3xl min-h-3xl w-full object-contain"
    />
  {:else}
    <div
      class="h-4xl
         aspect-square rounded-2xl bg-slate-200"
    ></div>
  {/if}

  <div class="gap-sm flex h-full w-full flex-col justify-between">
    <div class="gap-sm flex-col items-center">
      <h5 class="break-word text-raisin-black font-sans-narrow font-semibold">
        {@html variant_name}
      </h5>
      <span class="gap-xs flex items-center text-lg font-bold text-[#029F53]">
        {area_under_peak}%
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="14"
          height="9"
          viewBox="0 0 14 9"
          fill="none"
        >
          <path d="M9.5 1H13.5V5" stroke="#029F53" stroke-linecap="round" stroke-linejoin="round" />
          <path
            d="M13.5 1L7.85 6.65C7.75654 6.74161 7.63088 6.79293 7.5 6.79293C7.36912 6.79293 7.24346 6.74161 7.15 6.65L4.85 4.35C4.75654 4.25839 4.63088 4.20707 4.5 4.20707C4.36912 4.20707 4.24346 4.25839 4.15 4.35L0.5 8"
            stroke="#029F53"
            stroke-width="1.5"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
        </svg>
      </span>
    </div>
    <div>
      {@html aka}
    </div>

    <div class="flex flex-col">
      <div class="gap-xs align-start flex flex-row flex-wrap">
        <button
          onclick={() => onTagClick('window', windowType?.name)}
          class="plain p-xs! text-md text-default rounded-2xl! bg-gray-100 text-center font-bold! md:text-left"
        >
          {windowType?.label}
        </button>
        <button
          onclick={() => onTagClick('instrument', instrument?.name)}
          class="plain p-xs! text-md text-default rounded-2xl! bg-gray-100 text-center font-bold! md:text-left"
        >
          {instrument?.label}
        </button>
      </div>

      <button
        class="plain px-sm! py-xs! text-default absolute top-[1.25rem] right-[1.25rem] rounded-2xl! bg-gray-100 font-bold! uppercase"
        onclick={() => onTagClick('mutation', mutation?.name)}
      >
        {mutation?.label}
      </button>
      <tosoh-modal variant="action" modalId={variant_name}>
        <button class="gap-sm mt-sm flex w-full! items-center justify-center text-center">
          {viewDetailsLabel}
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="12"
            height="14"
            viewBox="0 0 12 14"
            fill="none"
            class="h-sm min-w-base w-sm"
          >
            <path
              d="M0.629487 12.2917C0.363957 12.6236 0.417771 13.1079 0.749684 13.3734C1.0816 13.639 1.56592 13.5852 1.83145 13.2532L1.23047 12.7725L0.629487 12.2917ZM11.231 1.14299C11.184 0.720533 10.8035 0.416117 10.3811 0.463057L3.49674 1.22798C3.07428 1.27492 2.76987 1.65544 2.81681 2.0779C2.86375 2.50035 3.24427 2.80477 3.66672 2.75783L9.78612 2.0779L10.4661 8.19729C10.513 8.61975 10.8935 8.92417 11.316 8.87723C11.7384 8.83029 12.0428 8.44977 11.9959 8.02731L11.231 1.14299ZM1.23047 12.7725L1.83145 13.2532L11.067 1.70877L10.4661 1.22798L9.86507 0.747196L0.629487 12.2917L1.23047 12.7725Z"
              fill="white"
            />
          </svg>
        </button>
      </tosoh-modal>

      <tosoh-modal variant="modal" modalId={variant_name}>
        <div slot="title" class="w-full">
          <a href={document_url} class="button" target="_blank">{downloadLabel}</a>
        </div>
        <div slot="content">
          <div class="space-y-md flex flex-col">
            <h2 class="text-4xl">{variant_name}</h2>
            <div
              class="mx-au to p-xs w-full overflow-hidden rounded-lg border border-zinc-200 shadow-lg"
            >
              <img
                src={constructCDNUrl(variant_image?.url, 1450)}
                alt={variant_name}
                class="w-full object-contain"
              />
            </div>
            <br />
            <div class="italic"><span class="font-bold">{alsoKnownAsLabel}</span> {@html aka}</div>
            <div class="space-y-xs">
              <div><span class="font-bold">{mutationTypeLabel}</span> {mutation.label}</div>
              <div>
                <span class="font-bold">{mutationDescriptionLabel}</span>
                {@html mutation_description}
              </div>
              <div><span class="font-bold">{migrationZoneLabel}</span> {windowType?.label}</div>
            </div>
            <hr />

            <div class="relative overflow-auto">
              <h3 class="text-2xl">{variantDetailsLabel}</h3>
              <div class="my-md overflow-hidden rounded-t-lg">
                <table class="w-full table-auto border-collapse text-sm">
                  <thead>
                    <tr class="bg-zinc-700 text-white">
                      <th class="p-base border-b text-left font-bold">{propertyLabel}</th>
                      <th class="p-base border-b text-left font-bold">{valueLabel}</th>
                    </tr>
                  </thead>
                  <tbody class="bg-white">
                    {#each schema as col}
                      <tr class="border-b border-zinc-200">
                        <td class="p-base">{col.label}</td>
                        <td class="p-base">{@html col.value}</td>
                      </tr>
                    {/each}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </tosoh-modal>
    </div>
  </div>
</div>
