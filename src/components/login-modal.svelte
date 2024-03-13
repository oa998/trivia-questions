<script lang="ts">
  import Modal from "$components/modal.svelte";
  import { login } from "$lib/index";
  import { createEventDispatcher } from "svelte";
  let modal: Modal;
  let value = "";
  let submittingPassword = false;
  let error = "";
  const dispatcher = createEventDispatcher();
</script>

<button
  class="underline text-white"
  on:click={() => {
    value = "";
    error = "";
    modal.open();
  }}>Login required</button
>
<Modal bind:this={modal} closeDisabled={submittingPassword}>
  <form
    on:submit|preventDefault={() => {
      submittingPassword = true;
      modal.open();
      login(value)
        .then(() => dispatcher("login-success"))
        .then(modal.close)
        .catch((e) => (error = e.message))
        .then(() => (submittingPassword = false));
    }}
    class="flex flex-col gap-2"
  >
    <input
      bind:value
      type="password"
      name="password"
      id="password"
      placeholder="password"
      disabled={submittingPassword}
      class="border-b-black border-b outline-none disabled:bg-slate-300 disabled:text-gray-500"
      on:input={() => (error = "")}
    />
    <button
      class="border border-black px-2 self-end flex flex-row gap-2 disabled:bg-slate-300 disabled:text-gray-500"
      disabled={submittingPassword}
      ><span>Submit</span>
      {#if submittingPassword}
        <span class="rotate">◠</span>
      {/if}
    </button>
    {#if error}
      <div class="text-xs text-red-600 self-center">{error}</div>
    {/if}
  </form>
</Modal>

<style lang="postcss">
  .rotate {
    display: inline-block;
    animation: rot 2s infinite linear;
  }

  @keyframes rot {
    0% {
      transform: translateY(-2px) rotateZ(0deg);
      transform-origin: center 14px;
    }
    100% {
      transform: translateY(-2px) rotateZ(360deg);
      transform-origin: center 14px;
    }
  }
</style>
