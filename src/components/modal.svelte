<script lang="ts">
  import { onMount } from "svelte";

  let dialogRef: HTMLDialogElement;
  export const open = () => dialogRef.showModal();
  export const close = () => dialogRef.close();
  export let width = "w-[85vsw]";
  export let closeDisabled = false;
  let clazz: string;
  export { clazz as class };

  onMount(() => {
    dialogRef.addEventListener("click", (e) => {
      if (closeDisabled) return;
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

<dialog class={clazz} bind:this={dialogRef} on:close>
  <div class={`p-5`}>
    <slot />
  </div>
</dialog>

<style lang="postcss">
  dialog {
    z-index: 10;
    background: white;
    border: none;
  }
  dialog::backdrop {
    @apply bg-gray-400 bg-opacity-50;
  }
</style>
