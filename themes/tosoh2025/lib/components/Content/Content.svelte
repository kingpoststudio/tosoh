<svelte:options customElement="tosoh-content" />

<script lang="ts">
  let {
    alignment = "start",
    gap = "base",
  }: { alignment: string; gap: string } = $props();
</script>

<div class="wrapper align-{alignment} gap-{gap}">
  <svelte:element this={"slot"} name="eyebrow" />
  <svelte:element this={"slot"} name="title" />
  <svelte:element this={"slot"} name="description" />
  <svelte:element this={"slot"} name="cta" />
</div>

<style lang="postcss">
  * {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
  }

  :host {
    display: block;
  }

  .wrapper {
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 100%;
    height: 100%;
    text-align: center;

    &.align-start {
      align-items: flex-start;
      text-align: left;
    }

    &.align-center {
      align-items: center;
      text-align: center;
    }

    &.align-end {
      align-items: flex-end;
      text-align: right;
    }

    &.gap-sm {
      gap: var(--space-sm);
    }

    &.gap-base {
      gap: var(--space);
    }

    &.gap-md {
      gap: var(--space-md);
    }

    &.gap-lg {
      gap: var(--space-lg);
    }

    &.gap-xl {
      gap: var(--space-xl);
    }

    &.gap-2xl {
      gap: var(--space-2xl);
    }

    &.gap-3xl {
      gap: var(--space-3xl);
    }

    &.gap-4xl {
      gap: var(--space-4xl);
    }
  }
</style>
