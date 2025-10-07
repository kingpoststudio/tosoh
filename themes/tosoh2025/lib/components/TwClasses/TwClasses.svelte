<svelte:options
  customElement={{
    tag: 'tosoh-tw-classes',
    shadow: 'none',
  }}
/>

<script lang="ts">
  import {
    alignmentChoices,
    constructClasses,
    justifyChoices,
    sizeChoices,
    themeColorChoices,
    widthChoices,
  } from '../../utils/fieldUtils';
  const allClasses = [
    ...constructClasses('pt', sizeChoices),
    ...constructClasses('md:pt', sizeChoices),
    ...constructClasses('pr', sizeChoices),
    ...constructClasses('md:pr', sizeChoices),
    ...constructClasses('pb', sizeChoices),
    ...constructClasses('md:pb', sizeChoices),
    ...constructClasses('pl', sizeChoices),
    ...constructClasses('md:pl', sizeChoices),
    ...constructClasses('bg', themeColorChoices),
    ...constructClasses('text', themeColorChoices),
    ...constructClasses('gap', sizeChoices),
    ...constructClasses('justify', justifyChoices),
    ...constructClasses('w', widthChoices),
    ...constructClasses('self', alignmentChoices),
    ...constructClasses('justify-self', alignmentChoices),
    ...constructClasses('border', themeColorChoices),
    'flex-1',
    'flex-2',
    'flex-3',
    'flex-4',
    'flex-5',
    'flex-6',
    'flex-7',
    'flex-8',
    'border',
    'hidden',
    'text-left',
    'text-center',
    'text-right',
  ];
  //We construct all the classes, and then we copy paset the console log output in the div. Tailwind was not parsing values if we do that programmatically.
  console.log(allClasses.join(' '));
</script>

<div
  class={`pt-auto pt-2xs pt-xs pt-sm pt-base pt-md pt-lg pt-xl pt-2xl pt-3xl pt-4xl pt-5xl md:pt-auto md:pt-2xs md:pt-xs md:pt-sm md:pt-base md:pt-md md:pt-lg md:pt-xl md:pt-2xl md:pt-3xl md:pt-4xl md:pt-5xl pr-auto pr-2xs pr-xs pr-sm pr-base pr-md pr-lg pr-xl pr-2xl pr-3xl pr-4xl pr-5xl md:pr-auto md:pr-2xs md:pr-xs md:pr-sm md:pr-base md:pr-md md:pr-lg md:pr-xl md:pr-2xl md:pr-3xl md:pr-4xl md:pr-5xl pb-auto pb-2xs pb-xs pb-sm pb-base pb-md pb-lg pb-xl pb-2xl pb-3xl pb-4xl pb-5xl md:pb-auto md:pb-2xs md:pb-xs md:pb-sm md:pb-base md:pb-md md:pb-lg md:pb-xl md:pb-2xl md:pb-3xl md:pb-4xl md:pb-5xl pl-auto pl-2xs pl-xs pl-sm pl-base pl-md pl-lg pl-xl pl-2xl pl-3xl pl-4xl pl-5xl md:pl-auto md:pl-2xs md:pl-xs md:pl-sm md:pl-base md:pl-md md:pl-lg md:pl-xl md:pl-2xl md:pl-3xl md:pl-4xl md:pl-5xl bg-default bg-imperial-red bg-nickel bg-ghost-white bg-prussian-blue text-default text-imperial-red text-nickel text-ghost-white text-prussian-blue gap-auto gap-2xs gap-xs gap-sm gap-base gap-md gap-lg gap-xl gap-2xl gap-3xl gap-4xl gap-5xl w-2xs w-xs w-sm w-base w-md w-lg w-xl w-2xl w-3xl w-4xl w-5xl w-6xl w-7xl w-8xl w-max-page border-default border-imperial-red border-nickel border-light-silver border-ghost-white border-prussian-blue flex-2 flex-3 flex-4 flex-5 flex-6 flex-7 flex-8 bg-midnight-green text-midnight-green hidden w-0 w-auto flex-1 justify-start justify-end justify-center justify-between justify-around justify-evenly gap-0 self-start self-end self-center justify-self-start justify-self-end justify-self-center border border-transparent bg-transparent pb-0 pl-0 pr-0 pt-0 text-transparent md:pb-0 md:pl-0 md:pr-0 md:pt-0`}
></div>
