<script lang="ts">
  let { value = $bindable(), options, label, name, disabled } = $props();

  let activeOptions = $derived(options);
</script>

<div class="mt-md gap-sm flex flex-col">
  <div class=" gap-sm flex flex-col">
    <label for={name} class=" text-xl font-black">{label}</label>
    <div class="relative">
      <select
        id={name}
        {name}
        disabled={disabled || activeOptions?.length === 0}
        class="p-sm focus:ring-imperial-red peer w-full cursor-pointer appearance-none rounded-lg border border-slate-200 focus:outline-none focus:ring-1 focus:ring-opacity-50 disabled:cursor-not-allowed disabled:opacity-50"
        bind:value
      >
        <option value="none" selected disabled hidden class="text-imperial-red">Select</option>
        {#each activeOptions as option}
          <option value={option.value} class="text-default">{option.label}</option>
        {/each}
      </select>
      <div
        class="pointer-events-none absolute inset-y-0 right-3 flex items-center transition-transform duration-200 peer-open:rotate-180"
      >
        <svg
          class="text-imperial-red h-4 w-4"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="4" d="M19 9l-7 7-7-7"
          ></path>
        </svg>
      </div>
    </div>
  </div>
</div>
