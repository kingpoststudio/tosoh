<svelte:options
  customElement={{
    tag: 'tosoh-support-portal',
    shadow: 'none',
  }}
/>

<script>
  import SupportPortalFilter from './SupportPortalFilter.svelte';
</script>

<div class="wrapper mt-lg flex">
  <SupportPortalFilter></SupportPortalFilter>
</div>
