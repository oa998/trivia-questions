<script lang="ts">
  import { goto } from "$app/navigation";
  import { getAllDays } from "$lib/index";
  import "../app.css";
  let success = false;
  let getDays = getAllDays()
    .then(() => (success = true))
    .catch(() => goto("/"));
</script>

{#await getDays}
  <div>...loading</div>
{:then}
  <div style="background: #0d2a47;">
    <slot />
  </div>
{/await}
