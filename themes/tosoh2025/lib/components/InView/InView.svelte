<svelte:options customElement="tosoh-in-view" />

<script lang="ts">
  import { fly } from "svelte/transition";
  import { inview, type Options } from "svelte-inview";

  let {
    duration = 500,
    delay = 0,
    x = "0rem",
    y = "0rem",
    threshold = 0.4,
  } = $props();

  let inView = $state(false);

  if (typeof duration === "string") {
    duration = parseFloat(duration);
  }

  if (typeof delay === "string") {
    delay = parseFloat(delay);
  }

  const handleChange = ({ detail }: CustomEvent<ObserverEventDetails>) =>
    (inView = detail.inView);

  const inViewOptions: Options = {
    unobserveOnEnter: true,
    threshold,
  };
</script>

<div use:inview={inViewOptions} oninview_change={handleChange}>
  {#if inView}
    <div transition:fly={{ duration, delay, x, y }}>
      <svelte:element this={"slot"} />
    </div>
  {:else}
    <svelte:element this={"slot"} style:visibility="hidden" />
  {/if}
</div>

<style lang="postcss">
  :host {
    display: contents;
  }

  div {
    width: 100%;
    height: 100%;
  }
</style>
