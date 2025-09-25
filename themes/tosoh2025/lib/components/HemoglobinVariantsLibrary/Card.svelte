<script lang="ts">
  import type { HemoglobinVariantsLibraryItem } from '../../../types/hubdb';

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
  } = item?.values;
</script>

<div
  class={`border-border relative flex h-full w-full flex-col content-around gap-[1.25rem] rounded-2xl border p-[1.25rem]`}
>
  {#if variant_image?.url}
    <img
      alt={item.name}
      src={variant_image?.url}
      loading="lazy"
      class="aspect-square max-h-[16rem] w-full rounded-full object-contain"
    />
  {:else}
    <div
      class="aspect-square
         rounded-full bg-slate-200 md:h-[16rem]"
    ></div>
  {/if}

  <div class="flex h-full w-full flex-col justify-between gap-[1.25rem]">
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

    <div class="gap-xs flex items-center">
      <span class="p-xs text-md text-default bg-ghost-white rounded-full font-bold">
        {window?.label}
      </span>
      <span class="p-xs text-md text-default bg-ghost-white rounded-full font-bold">
        {instrument?.label}
      </span>
    </div>

    <button class="gap-sm w-full! flex items-center justify-center text-center">
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
  </div>

  <span
    class="px-sm py-xs text-default bg-ghost-white absolute right-[1.25rem] top-[1.25rem] break-all rounded-2xl font-bold uppercase"
  >
    {mutation?.label}
  </span>
</div>
