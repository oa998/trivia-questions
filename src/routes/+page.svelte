<script lang="ts">
  import LoginModal from "$components/login-modal.svelte";
  import TriviaDayChoice from "$components/trivia-day-choice.svelte";
  import { getAllDays } from "$lib/index";
  let getDays = getAllDays();
</script>

{#await getDays}
  <div>...loading</div>
{:then days}
  <TriviaDayChoice {days} />
{:catch}
  <LoginModal on:login-success={() => (getDays = getAllDays())} />
{/await}
