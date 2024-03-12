<script lang="ts">
  export let days: { created_on: Date; trivia_day: string }[] = [];
</script>

<div class="w-full h-[100vh] grid place-items-center relative p-5 bg-blue-100">
  <div class="flex flex-col gap-5 w-full max-w-sm">
    {#each days as day}
      <a
        href={`/day?trivia_day=${day.trivia_day}`}
        class="border border-black p-3 bg-blue-300 text-center"
        >{day.trivia_day}</a
      >
    {/each}
  </div>
</div>
