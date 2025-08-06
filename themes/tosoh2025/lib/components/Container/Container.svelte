<svelte:options customElement="tosoh-container" />

<script lang="ts">
  let {
    z = "auto",
    w = "auto",
    h = "auto",
    mdW = "auto",
    mdH = "auto",
    px = "base",
    py = "md",
    pl = "inherit",
    pr = "inherit",
    pt = "inherit",
    pb = "inherit",
    mdPx = "2xl",
    mdPy = "xl",
    mdPl = "inherit",
    mdPr = "inherit",
    mdPt = "inherit",
    mdPb = "inherit",
    offsetX = "auto",
    offsetY = "auto",
    mdOffsetX = "auto",
    mdOffsetY = "auto",
    bgColor = "cream",
    textColor = "petrol",
  } = $props();
</script>

<div
  class="container"
  style:--w={w}
  style:--h={h}
  style:--md-w={mdW}
  style:--md-h={mdH}
  style:--px="var(--space-{px})"
  style:--py="var(--space-{py})"
  style:--pl="var(--space-{pl})"
  style:--pr="var(--space-{pr})"
  style:--pt="var(--space-{pt})"
  style:--pb="var(--space-{pb})"
  style:--md-px="var(--space-{mdPx})"
  style:--md-py="var(--space-{mdPy})"
  style:--md-pl="var(--space-{mdPl})"
  style:--md-pr="var(--space-{mdPr})"
  style:--md-pt="var(--space-{mdPt})"
  style:--md-pb="var(--space-{mdPb})"
  style:--offset-x={offsetX}
  style:--offset-y={offsetY}
  style:--md-offset-x={mdOffsetX}
  style:--md-offset-y={mdOffsetY}
  style:--z={z}
  style:--bg-color="var(--color-{bgColor})"
  style:--text-color="var(--color-{textColor})"
>
  <svelte:element this={"slot"} />
</div>

<style lang="postcss">
  * {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
  }

  .container {
    position: relative;
    z-index: var(--z);
    left: var(--offset-x);
    top: var(--offset-y);
    display: flex;
    width: var(--w);
    height: var(--h);
    padding: var(--py) var(--px);
    padding-left: var(--pl);
    padding-right: var(--pr);
    padding-top: var(--pt);
    padding-bottom: var(--pb);
    color: var(--text-color);
    background-color: var(--bg-color);
  }

  @media (min-width: 768px) {
    .container {
      left: var(--md-offset-x);
      top: var(--md-offset-y);
      width: var(--md-w);
      height: var(--md-h);
      padding: var(--md-py) var(--md-px);
      padding-left: var(--md-pl);
      padding-right: var(--md-pr);
      padding-top: var(--md-pt);
      padding-bottom: var(--md-pb);
    }
  }
</style>
