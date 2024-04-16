<script lang="ts">
  import { browser } from "$app/environment";
  import { goto } from "$app/navigation";
  import { getAllDays } from "$lib/index";
  import { onMount } from "svelte";
  import "../app.css";

  let loading = true;
  onMount(() => {
    if (browser && location.pathname.startsWith("/songs")) {
      loading = false;
    }
    getAllDays()
      .then(() => (loading = false))
      .catch(() => goto("/"));
  });
</script>

{#if loading}
  <div>...loading</div>
{:else}
  <div style="background: #0d2a47;">
    <slot />
  </div>
{/if}
