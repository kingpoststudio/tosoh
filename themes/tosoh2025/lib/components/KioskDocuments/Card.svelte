<script lang="ts">
  import { constructCDNUrl, onTagClick } from '../../utils/utils';

  let { item }: { item: any } = $props();

  const { path } = item;
  const { image, title, document_type } = item?.values;
</script>

<div
  class={`border-border relative flex h-full w-full flex-col content-around gap-[1.25rem] rounded-2xl border p-[1.25rem]`}
>
  {#if image?.url}
    <img
      alt={item.name}
      src={constructCDNUrl(image?.url)}
      loading="lazy"
      class="aspect-square max-h-[16rem] w-full rounded-lg object-contain"
    />
  {:else}
    <div
      class="aspect-square
       rounded-lg bg-slate-200 md:h-[16rem]"
    ></div>
  {/if}

  <div class="flex h-full w-full flex-col justify-between gap-[1.25rem]">
    <div>
      <h5 class="break-word text-raisin-black mt-base font-sans-narrow font-semibold">
        {@html title}
      </h5>
    </div>

    <a
      href={`kiosk-documents/${path}`}
      class="button gap-sm w-full! flex items-center justify-center text-center"
      target="_blank"
    >
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
    </a>
  </div>

  <button
    onclick={() => onTagClick('document_type', document_type?.name)}
    class="plain p-xs! text-md text-default bg-ghost-white font-bold! absolute right-[1.25rem] top-[1.25rem] break-all rounded-lg text-xs hover:bg-gray-100"
  >
    {document_type?.label}
  </button>
</div>
