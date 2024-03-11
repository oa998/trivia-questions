<script lang="ts">
  import { onMount } from "svelte";

  let dialogRef: HTMLDialogElement;

  onMount(() => {
    dialogRef.addEventListener("click", (e) => {
      const dialogDimensions = dialogRef.getBoundingClientRect();
      if (
        e.clientX < dialogDimensions.left ||
        e.clientX > dialogDimensions.right ||
        e.clientY < dialogDimensions.top ||
        e.clientY > dialogDimensions.bottom
      ) {
        dialogRef.close();
      }
    });
    dialogRef.showModal();
  });
</script>

<dialog bind:this={dialogRef} on:close>
  <div class="p-5">
    ok
    <slot />
  </div>
</dialog>

<style lang="postcss">
  dialog {
    z-index: 10;
    background: green;
    border: none;
    border-radius: 1rem;
  }
  dialog::backdrop {
    @apply bg-gray-400 bg-opacity-50;
  }
</style>
