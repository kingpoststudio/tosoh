<script lang="ts">
  import type { SupportPortalItem } from '../../../types/hubdb';
  let { item, hasSiblings }: { item: SupportPortalItem; hasSiblings: boolean } = $props();

  const setupWistiaThumbnail = (url: string): string => {
    return url?.replace(
      /\.bin(\?disposition=attachment)?(?:\?video_still_time=\d+)?$/,
      (match, disposition) => {
        const baseUrl = '.jpg';
        const params = [];

        if (disposition) {
          params.push(disposition);
        }
        params.push(disposition ? '&video_still_time=10' : '?video_still_time=10');

        return baseUrl + params.join('');
      }
    ) as string;
  };

  function parseAfterHubfsRegex(url: string): string | null {
    const match = url?.match(/hubfs\/(.*)$/);
    return match ? match[1] : null;
  }

  function costructCDNUrl(url: string): string {
    if (url) {
      return `https://19644636.fs1.hubspotusercontent-na1.net/hub/19644636/hubfs/${parseAfterHubfsRegex(
        url
      )}?width=330`;
    }
    return '';
  }

  let imgSrc = $derived(
    costructCDNUrl(item?.image?.url as string) ||
      setupWistiaThumbnail(item?.wistia_video_url as string)
  );
  let family = $derived(item.product_family?.map((family) => `${family.value}`).join(', '));
  let name = $derived(item.name);
  let downloadUrl = $derived(item.document_url || item.wistia_video_url);
  let type = $derived(item.document_type?.map((type) => `${type.value}`)?.[0]);

  const handleImageError = () => {
    imgSrc = '';
  };
</script>

{#snippet pdfIcon()}
  <svg xmlns="http://www.w3.org/2000/svg" width="28" height="31" viewBox="0 0 28 31" fill="none">
    <path
      d="M3.75774 13.4352V12.403H2.72554V13.4352H3.75774ZM12.0154 13.4352V12.403H10.9832V13.4352H12.0154ZM12.0154 21.6929H10.9832V22.7251H12.0154V21.6929ZM26.4662 7.24203H27.4984V6.81469L27.197 6.51123L26.4662 7.24203ZM20.273 1.0488L21.0038 0.318005L20.7003 0.0166016H20.273V1.0488ZM3.75774 14.4674H5.82215V12.403H3.75774V14.4674ZM4.78995 22.7251V17.5641H2.72554V22.7251H4.78995ZM4.78995 17.5641V13.4352H2.72554V17.5641H4.78995ZM5.82215 16.5319H3.75774V18.5963H5.82215V16.5319ZM6.85435 15.4997C6.85435 15.7734 6.7456 16.036 6.55203 16.2295C6.35845 16.4231 6.09591 16.5319 5.82215 16.5319V18.5963C6.64342 18.5963 7.43106 18.27 8.01178 17.6893C8.59251 17.1086 8.91876 16.3209 8.91876 15.4997H6.85435ZM5.82215 14.4674C6.09591 14.4674 6.35845 14.5762 6.55203 14.7698C6.7456 14.9634 6.85435 15.2259 6.85435 15.4997H8.91876C8.91876 14.6784 8.59251 13.8907 8.01178 13.31C7.43106 12.7293 6.64342 12.403 5.82215 12.403V14.4674ZM10.9832 13.4352V21.6929H13.0476V13.4352H10.9832ZM12.0154 22.7251H14.0798V20.6607H12.0154V22.7251ZM17.1764 19.6285V15.4997H15.112V19.6285H17.1764ZM14.0798 12.403H12.0154V14.4674H14.0798V12.403ZM17.1764 15.4997C17.1764 14.6784 16.8501 13.8907 16.2694 13.31C15.6887 12.7293 14.901 12.403 14.0798 12.403V14.4674C14.3535 14.4674 14.6161 14.5762 14.8097 14.7698C15.0032 14.9634 15.112 15.2259 15.112 15.4997H17.1764ZM14.0798 22.7251C14.901 22.7251 15.6887 22.3988 16.2694 21.8181C16.8501 21.2374 17.1764 20.4497 17.1764 19.6285H15.112C15.112 19.9022 15.0032 20.1648 14.8097 20.3583C14.6161 20.5519 14.3535 20.6607 14.0798 20.6607V22.7251ZM19.2408 12.403V22.7251H21.3052V12.403H19.2408ZM20.273 14.4674H25.434V12.403H20.273V14.4674ZM20.273 18.5963H23.3696V16.5319H20.273V18.5963ZM2.72554 10.3386V3.11321H0.661133V10.3386H2.72554ZM25.434 7.24203V10.3386H27.4984V7.24203H25.434ZM3.75774 2.08101H20.273V0.0166016H3.75774V2.08101ZM19.5422 1.77961L25.7354 7.97283L27.197 6.51123L21.0038 0.318005L19.5422 1.77961ZM2.72554 3.11321C2.72554 2.83945 2.83429 2.57691 3.02787 2.38333C3.22144 2.18976 3.48399 2.08101 3.75774 2.08101V0.0166016C2.93647 0.0166016 2.14884 0.342851 1.56811 0.923578C0.987382 1.5043 0.661133 2.29194 0.661133 3.11321H2.72554ZM0.661133 24.7895V27.8861H2.72554V24.7895H0.661133ZM3.75774 30.9827H24.4018V28.9183H3.75774V30.9827ZM27.4984 27.8861V24.7895H25.434V27.8861H27.4984ZM24.4018 30.9827C25.2231 30.9827 26.0107 30.6565 26.5914 30.0757C27.1722 29.495 27.4984 28.7074 27.4984 27.8861H25.434C25.434 28.1599 25.3253 28.4224 25.1317 28.616C24.9381 28.8095 24.6756 28.9183 24.4018 28.9183V30.9827ZM0.661133 27.8861C0.661133 28.7074 0.987382 29.495 1.56811 30.0757C2.14884 30.6565 2.93647 30.9827 3.75774 30.9827V28.9183C3.48399 28.9183 3.22144 28.8095 3.02787 28.616C2.83429 28.4224 2.72554 28.1599 2.72554 27.8861H0.661133Z"
      fill="currentColor"
    />
  </svg>
{/snippet}

<div
  class={`p-sm gap-sm relative flex w-full flex-col content-around rounded-lg border border-[#DAD8D8] ${
    hasSiblings ? 'h-full' : 'h-fit'
  }`}
>
  {#if imgSrc}
    <img
      alt={item.name}
      src={imgSrc}
      loading="lazy"
      class="aspect-video w-full
 rounded-lg object-contain"
      onerror={handleImageError}
    />
  {:else}
    <div
      class="aspect-video
       rounded-lg bg-slate-200 md:h-[12rem]"
    ></div>
  {/if}

  <div class="gap-xs flex h-full w-full flex-col justify-between">
    <div>
      <span class=" text-imperial-red text-md break-all">{family}</span>
      <h3 class="text-raisin-black break-all text-lg font-bold">
        {name}
      </h3>
    </div>
    <a
      href={downloadUrl}
      class="button gap-sm flex w-full items-center justify-center text-center"
      target="_blank"
    >
      Download
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="19"
        height="18"
        viewBox="0 0 19 18"
        fill="none"
        class="h-4 w-4"
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

  <span
    class="p-xs text-md text-imperial-red top-sm right-sm absolute break-all rounded-lg bg-red-100 text-xs font-bold"
  >
    {#if type === 'PDF'}
      {@render pdfIcon()}
    {:else}
      {type}
    {/if}
  </span>
</div>
