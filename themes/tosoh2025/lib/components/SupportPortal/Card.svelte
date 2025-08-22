<script lang="ts">
  import type { SupportPortalItem } from '../../../types/hubdb';
  import { onMount } from 'svelte';

  const setupWistiaThumbnail = (url: string): string => {
    return url.replace(
      /\.bin(\?disposition=attachment)(?:\?video_still_time=\d+)?$/,
      '.jpg$1&video_still_time=10'
    ) as string;
  };

  let { item }: { item: SupportPortalItem } = $props();

  let imgSrc = $derived(item.image?.url || setupWistiaThumbnail(item?.wistia_video_url as string));
  let family = $derived(item.product_family?.map((family) => `${family.value}`).join(', '));
  let name = $derived(item.name);
  let downloadUrl = $derived(item.document_url || item.wistia_video_url);

  const handleImageError = () => {
    imgSrc = '';
  };
</script>

<div
  class="p-sm gap-sm relative flex min-h-[24rem] w-full flex-col content-around
 rounded-lg border border-[#DAD8D8]"
>
  {#if imgSrc}
    <img
      alt={item.name}
      onerror={handleImageError}
      src={imgSrc}
      loading="lazy"
      class="h-[12rem] object-contain"
    />
  {:else}
    <div class="h-[12rem] rounded-lg bg-slate-200"></div>
  {/if}

  <div class="gap-xs flex h-[12rem] w-full flex-col">
    <span class=" text-imperial-red text-md break-all">{family}</span>
    <h3 class="text-raisin-black break-all text-lg font-bold">
      {name}
    </h3>
    <a
      href={downloadUrl}
      class="button gap-sm flex w-full items-center justify-center self-end text-center"
      target="_blank"
    >
      Download
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="19"
        height="18"
        viewBox="0 0 19 18"
        fill="none"
      >
        <path
          d="M1.34863 13.004V14C1.34863 14.7956 1.6647 15.5587 2.22731 16.1213C2.78992 16.6839 3.55298 17 4.34863 17H14.3486C15.1443 17 15.9073 16.6839 16.47 16.1213C17.0326 15.5587 17.3486 14.7956 17.3486 14V13M9.34863 1.5V12.5M9.34863 12.5L12.8486 9M9.34863 12.5L5.84863 9"
          stroke="white"
          stroke-width="1.5"
          stroke-linecap="round"
          stroke-linejoin="round"
        />
      </svg>
    </a>
  </div>
</div>
