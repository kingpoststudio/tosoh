<script lang="ts">
  interface WebinarCardProps {
    title: string;
    date: string;
    time: string;
    timezone: string;
    speakers: string[];
    location: string;
    status?: 'upcoming' | 'live' | 'past';
    onRegister?: () => void;
  }

  let {
    title,
    date,
    time,
    timezone,
    speakers,
    location,
    status = 'upcoming',
    onRegister,
  }: WebinarCardProps = $props();
</script>

<div class="mx-auto overflow-hidden rounded-2xl bg-white shadow-lg">
  <!-- Top Section with Dark Blue Background -->
  <div class="relative bg-slate-800 p-6 text-white">
    <!-- Decorative Elements -->
    <div class="absolute inset-0 overflow-hidden">
      <div class="absolute left-8 top-2 h-2 w-2 rounded-full bg-blue-300 opacity-60"></div>
      <div class="absolute right-12 top-4 h-1 w-1 rounded-full bg-blue-300 opacity-40"></div>
      <div class="absolute left-16 top-8 h-1.5 w-1.5 rounded-full bg-blue-300 opacity-50"></div>
      <div class="absolute right-8 top-12 h-1 w-1 rounded-full bg-blue-300 opacity-30"></div>
      <div class="absolute left-12 top-16 h-2 w-2 rounded-full bg-blue-300 opacity-40"></div>

      <!-- Wavy lines -->
      <div class="absolute right-16 top-6 h-0.5 w-8 rounded-full bg-blue-300 opacity-30"></div>
      <div class="absolute left-20 top-10 h-0.5 w-6 rounded-full bg-blue-300 opacity-20"></div>
    </div>

    <!-- Status Badge -->
    <div class="relative z-10">
      <span
        class="mb-4 inline-block rounded-lg bg-blue-400 px-3 py-1 text-sm font-medium text-white"
      >
        {status === 'upcoming' ? 'Upcoming' : status === 'live' ? 'Live' : 'Past'}
      </span>
    </div>

    <!-- Date Banner -->
    <div class="absolute right-4 top-4 rounded-lg bg-blue-400 px-3 py-2 text-black">
      <div class="text-2xl font-bold leading-none">{date?.split(',')[0]}</div>
      <div class="text-sm font-medium">{date?.split(',')[1]?.trim()}</div>
    </div>

    <!-- Time and Timezone -->
    <div class="relative z-10 mb-4">
      <div class="text-lg font-medium">{time}</div>
      <div class="text-sm opacity-90">{timezone}</div>
    </div>

    <!-- Title -->
    <h3 class="relative z-10 text-xl font-bold leading-tight">
      {title}
    </h3>
  </div>

  <!-- Bottom Section with White Background -->
  <div class="p-6">
    <!-- Speakers Section -->
    <div class="mb-4 flex items-center">
      <!-- Speaker Avatars -->
      <div class="mr-3 flex -space-x-2">
        {#each speakers?.slice(0, 3) as _, index}
          <div
            class="flex h-8 w-8 items-center justify-center rounded-full border-2 border-white bg-gray-300 text-xs font-medium text-gray-600"
          >
            {index + 1}
          </div>
        {/each}
        {#if speakers?.length > 3}
          <div
            class="flex h-8 w-8 items-center justify-center rounded-full border-2 border-white bg-gray-200 text-xs font-medium text-gray-500"
          >
            +{speakers?.length - 3}
          </div>
        {/if}
      </div>

      <!-- Speaker Names -->
      <div class="flex-1">
        <div class="font-semibold text-gray-900">
          {speakers?.slice(0, 2)?.join(', ')}
          {#if speakers?.length > 2}
            & {speakers?.length - 2} Others
          {/if}
        </div>
        <div class="text-sm text-gray-600">{location}</div>
      </div>
    </div>

    <!-- Register Button -->
    <button
      class="w-full rounded-lg bg-red-600 px-4 py-3 font-medium text-white transition-colors duration-200 hover:bg-red-700"
    >
      Register
    </button>
  </div>
</div>
