<script lang="ts">
  import type { HemoglobinVariantsLibraryItem } from '../../../types/hubdb';
  import { constructCDNUrl, onTagClick } from '../../utils/utils';
  let { item }: { item: HemoglobinVariantsLibraryItem } = $props();

  const {
    aka,
    variant_image,
    variant_name,
    mutation,
    window,
    rt_min,
    rt_max,
    area_under_peak,
    hgvs_name,
    instrument,
    heterozygote_clinical_presentation,
    heterozygote_laboratory_findings,
    homozygote_clinical_presentation,
    homozygote_laboratory_findings,
    homozygote_comments,
    ethnicity,
    comments,
    references,
    mutation_description,
    heterozygote_comments,
    document_url,
  } = item?.values;

  const schema = [
    { label: 'Variant Name', value: variant_name },
    { label: 'HGVS Name', value: hgvs_name },
    { label: 'Mutation', value: mutation.label },
    { label: 'Mutation Description', value: mutation_description },
    { label: 'Heterozygote Clinical Presentation', value: heterozygote_clinical_presentation },
    { label: 'Heterozygote Laboratory Findings', value: heterozygote_laboratory_findings },
    { label: 'Heterozygote Comments', value: heterozygote_comments },
    { label: 'Homozygote Clinical Presentation', value: homozygote_clinical_presentation },
    { label: 'Homozygote Laboratory Findings', value: homozygote_laboratory_findings },
    { label: 'Homozygote Comments', value: homozygote_comments },
    { label: 'Ethnicity', value: ethnicity },
    { label: 'Additional Comments', value: comments },
    { label: 'Instrument', value: instrument.label },
    { label: '% Min-Max', value: area_under_peak },
    { label: 'RT Min', value: rt_min },
    { label: 'RT Max', value: rt_max },
    { label: 'Migration in window', value: window.label },
    { label: 'References', value: references },
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
      class="max-h-[12rem] min-h-[12rem] w-full object-contain"
    />
  {:else}
    <div
      class="aspect-square
         rounded-full bg-slate-200 md:h-[16rem]"
    ></div>
  {/if}

  <div class="gap-sm flex h-full w-full flex-col justify-between">
    <div class="gap-sm flex-col items-center">
      <h5 class="break-word text-raisin-black mt-base font-sans-narrow font-semibold">
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
          onclick={() => onTagClick('window', window?.name)}
          class="plain p-xs! text-md text-default rounded-2xl! font-bold! bg-gray-100 text-center md:text-left"
        >
          {window?.label}
        </button>
        <button
          onclick={() => onTagClick('instrument', instrument?.name)}
          class="plain p-xs! text-md text-default rounded-2xl! font-bold! bg-gray-100 text-center md:text-left"
        >
          {instrument?.label}
        </button>
      </div>

      <button
        class="plain px-sm! py-xs! text-default font-bold! rounded-2xl! absolute right-[1.25rem] top-[1.25rem] bg-gray-100 uppercase"
        onclick={() => onTagClick('mutation', mutation?.name)}
      >
        {mutation?.label}
      </button>
      <tosoh-modal variant="action" modalId={variant_name}>
        <button class="gap-sm w-full! mt-sm flex items-center justify-center text-center">
          View Details
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="12"
            height="14"
            viewBox="0 0 12 14"
            fill="none"
            class="h-3 w-3 min-w-[1rem]"
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
          <a href={document_url} class="button" target="_blank">DOWNLOAD PDF</a>
        </div>
        <div slot="content">
          <div class="flex flex-col space-y-8">
            <h2 class="text-4xl">{variant_name}</h2>
            <div
              class="mx-au to w-full overflow-hidden rounded-lg border border-zinc-200 p-2 shadow-lg"
            >
              <img
                src={constructCDNUrl(variant_image.url, 1450)}
                alt={variant_name}
                class="w-full object-contain"
              />
            </div>
            <br />
            <div class="italic"><span class="font-bold">Also known as:</span> {@html aka}</div>
            <div class="space-y-2">
              <div><span class="font-bold">Mutation Type:</span> {mutation.label}</div>
              <div>
                <span class="font-bold">Mutation Description:</span>
                {@html mutation_description}
              </div>
              <div><span class="font-bold">Migration Zone:</span> {window.label}</div>
            </div>
            <hr />

            <div class="relative overflow-auto">
              <h3 class="text-2xl">Variant Details</h3>
              <div class="my-8 overflow-hidden rounded-t-lg">
                <table class="w-full table-auto border-collapse text-sm">
                  <thead>
                    <tr class="bg-zinc-700 text-white">
                      <th class="border-b p-4 text-left font-bold">Property</th>
                      <th class="border-b p-4 text-left font-bold">Value</th>
                    </tr>
                  </thead>
                  <tbody class="bg-white">
                    {#each schema as col}
                      <tr class="border-b border-zinc-200">
                        <td class="p-4">{col.label}</td>
                        <td class="p-4">{@html col.value}</td>
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
