<script lang="ts">
  import { goto } from "$app/navigation";
  import { base } from "$app/paths";
  import { getAllDays } from "$lib/index";
  import AddTriviaDateForm from "./add-trivia-date-form.svelte";

  export let days: { created_on: Date; trivia_day: string }[] = [];
  let dayz = days;
  function reloadDays() {
    return getAllDays().then((d) => (dayz = d));
  }
  let adding = false;
</script>

<div class="w-full h-[100vh] grid place-items-center relative p-5 svg-circ">
  <div class="flex flex-col gap-5 w-full max-w-sm">
    <div class="text-white">Trivia Day:</div>
    {#each dayz || days as day}
      <button
        on:click={() => {
          console.log(`${base}/day?trivia_day=${day.trivia_day}`);
          goto(`${base}/day?trivia_day=${day.trivia_day}`);
        }}
        class="border border-black p-3 bg-blue-300 text-center"
        >{day.trivia_day}</button
      >
    {/each}
    {#if adding}
      <AddTriviaDateForm
        on:cancelled={() => (adding = false)}
        on:close={() => (adding = false)}
        on:upsert-complete={() => {
          reloadDays().then(() => (adding = false));
        }}
      />
    {/if}
    <button
      class="p-2 border border-gray-200 rounded w-1/2 self-center active:bg-gray-700 text-white"
      on:click={() => (adding = true)}>+</button
    >
  </div>
</div>

<style>
  .svg-circ {
    background-image: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' version='1.1' xmlns:xlink='http://www.w3.org/1999/xlink' xmlns:svgjs='http://svgjs.dev/svgjs' width='1440' height='560' preserveAspectRatio='none' viewBox='0 0 1440 560'%3e%3cg clip-path='url(%26quot%3b%23SvgjsClipPath1032%26quot%3b)' fill='none'%3e%3crect width='1440' height='560' x='0' y='0' fill='%230e2a47'%3e%3c/rect%3e%3ccircle r='93.335' cx='21.07' cy='86' stroke='%23365aa3' stroke-opacity='0.25' stroke-width='2'%3e%3c/circle%3e%3ccircle r='93.335' cx='287.31' cy='303.52' stroke='%23365aa3' stroke-opacity='0.25' stroke-width='2'%3e%3c/circle%3e%3ccircle r='93.335' cx='700.57' cy='711.89' stroke='%23365aa3' stroke-opacity='0.25' stroke-width='2'%3e%3c/circle%3e%3ccircle r='47.585' cx='506.88' cy='286.54' stroke='%23365aa3' stroke-opacity='0.25' stroke-width='2'%3e%3c/circle%3e%3ccircle r='99.5' cx='746.6' cy='253.14' stroke='%23365aa3' stroke-opacity='0.25' stroke-width='2'%3e%3c/circle%3e%3ccircle r='159.68' cx='1354.25' cy='402.19' stroke='%23365aa3' stroke-opacity='0.25' stroke-width='2'%3e%3c/circle%3e%3ccircle r='107.765' cx='1050.03' cy='535.53' stroke='%23365aa3' stroke-opacity='0.25' stroke-width='2'%3e%3c/circle%3e%3ccircle r='170.65' cx='111.77' cy='469.71' stroke='%23365aa3' stroke-opacity='0.25' stroke-width='2'%3e%3c/circle%3e%3ccircle r='175.405' cx='16.02' cy='397.29' stroke='%23365aa3' stroke-opacity='0.25' stroke-width='2'%3e%3c/circle%3e%3ccircle r='179.53' cx='190.23' cy='38.6' stroke='%23365aa3' stroke-opacity='0.25' stroke-width='2'%3e%3c/circle%3e%3ccircle r='66.53' cx='1358.64' cy='456.64' stroke='%23365aa3' stroke-opacity='0.25' stroke-width='2'%3e%3c/circle%3e%3ccircle r='108.375' cx='606.9' cy='57.54' stroke='%23365aa3' stroke-opacity='0.25' stroke-width='2'%3e%3c/circle%3e%3c/g%3e%3cdefs%3e%3cclipPath id='SvgjsClipPath1032'%3e%3crect width='1440' height='560' x='0' y='0'%3e%3c/rect%3e%3c/clipPath%3e%3c/defs%3e%3c/svg%3e");
    background-attachment: fixed;
    background-repeat: repeat-y;
    background-size: cover;
  }
</style>
