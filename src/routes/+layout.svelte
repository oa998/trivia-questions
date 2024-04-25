<script lang="ts">
  import { browser } from "$app/environment";
  import { goto } from "$app/navigation";
  import { getAllDays } from "$lib/index";
  import "../app.css";

  let loading = true;
  if (browser) {
    getAllDays()
      .then(() => (loading = false))
      .catch(() => goto("/"));
  }
</script>

{#if loading}
  <div>...loading</div>
{:else}
  <div style="background: #0d2a47;">
    <slot />
  </div>
{/if}
