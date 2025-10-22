<svelte:options customElement={{ tag: 'tosoh-active-product-image', shadow: 'none' }} />

<script lang="ts">
  import { onDestroy, onMount } from 'svelte';
  import { on } from 'svelte/events';
  import { fade } from 'svelte/transition';

  let { src }: { src: string } = $props();
  let mainImage = $state(src);

  const mainImageHandler = on(window, 'TosohSetActiveProductImage', (e: Event) => {
    const { detail } = e as CustomEvent;
    mainImage = detail.src;

    changeBorderColor(detail.index);
  });

  const changeBorderColor = (index: string) => {
    document.querySelectorAll('.product_image_slide').forEach((slide) => {
      let slideIndex = slide?.getAttribute('index');

      if (!slideIndex) return;

      if (parseInt(slideIndex) === parseInt(index)) {
        slide.classList.add('border-imperial-red');
        slide.classList.remove('border-border');
      } else {
        slide.classList.remove('border-imperial-red');
        slide.classList.add('border-border');
      }
    });
  };

  const assignOnClick = () => {
    document.querySelectorAll('.product_image_slide').forEach((slide) => {
      const slideIndex = slide?.getAttribute('index');
      slide.addEventListener('click', () => {
        window.dispatchEvent(
          new CustomEvent('TosohSetActiveProductImage', {
            detail: { src: slide.querySelector('img')?.src, index: slideIndex },
            bubbles: true,
          })
        );
      });
    });
  };

  const destoryPlaceholder = () => {
    document.querySelectorAll('.active-product-image-placeholder').forEach((placeholder) => {
      placeholder.remove();
    });
  };

  onMount(() => {
    assignOnClick();
    destoryPlaceholder();
  });
  onDestroy(() => mainImageHandler());
</script>

<div
  in:fade={{ duration: 300 }}
  out:fade={{ duration: 200 }}
  class="border-imperial-red aspect-square h-full w-full overflow-hidden rounded-2xl border"
>
  {#key mainImage}
    <img
      src={mainImage}
      loading="eager"
      alt={mainImage}
      class="h-full w-full object-contain"
      in:fade={{ duration: 400 }}
      out:fade={{ duration: 200 }}
    />
  {/key}
</div>
