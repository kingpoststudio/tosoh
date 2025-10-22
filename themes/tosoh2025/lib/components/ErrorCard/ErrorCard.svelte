<script lang="ts">
  import { fade } from 'svelte/transition';
  import { onMount } from 'svelte';

  let { message, retryCallback }: { message: string; retryCallback: () => void } = $props();

  let enableReload = $state(false);
  let countdown = $state(30);

  const handleRetry = () => {
    if (retryCallback) {
      retryCallback();
    } else {
      window.location.reload();
    }
  };

  onMount(() => {
    const timer = setInterval(() => {
      countdown--;
      if (countdown <= 0) {
        enableReload = true;
        clearInterval(timer);
      }
    }, 1000);

    return () => clearInterval(timer);
  });
</script>

<div transition:fade class="p-sm w-full rounded-lg bg-red-50">
  <div class="gap-xs flex flex-col items-center">
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 640" class="h-10 w-10" fill="red">
      <path
        d="M117.4 496L320 120.8L522.6 496L117.4 496zM355.2 85C348.2 72.1 334.7 64 320 64C305.3 64 291.8 72.1 284.8 85L68.8 485C62.1 497.4 62.4 512.4 69.6 524.5C76.8 536.6 89.9 544 104 544L536 544C550.1 544 563.1 536.6 570.4 524.5C577.7 512.4 577.9 497.4 571.2 485L355.2 85zM320 232C306.7 232 296 242.7 296 256L296 368C296 381.3 306.7 392 320 392C333.3 392 344 381.3 344 368L344 256C344 242.7 333.3 232 320 232zM346.7 448C347.3 438.1 342.4 428.7 333.9 423.5C325.4 418.4 314.7 418.4 306.2 423.5C297.7 428.7 292.8 438.1 293.4 448C292.8 457.9 297.7 467.3 306.2 472.5C314.7 477.6 325.4 477.6 333.9 472.5C342.4 467.3 347.3 457.9 346.7 448z"
      />
    </svg>
    <p class="text-imperial-red text-base font-medium">{message}</p>

    <span transition:fade class="text-imperial-red text-sm">
      {#if countdown > 0}
        Reload in {countdown} seconds
      {:else}
        You can try again
      {/if}
    </span>
    {#if enableReload}
      <button transition:fade onclick={handleRetry}> Reload </button>
    {/if}
  </div>
</div>
