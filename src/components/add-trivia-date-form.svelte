<script lang="ts">
  import Modal from "$components/modal.svelte";
  import { upsert } from "$lib/index";
  import dayjs from "dayjs";
  import localizedFormat from "dayjs/plugin/localizedFormat";
  import { createEventDispatcher } from "svelte";
  dayjs.extend(localizedFormat);
  let modal: Modal;
  let submitting = false;
  let error = "";
  let trivia_day = dayjs().format("dddd, MMMM D");
  const dispatcher = createEventDispatcher();
  $: innerWidth = 0;
</script>

<svelte:window bind:innerWidth />

<Modal
  class={innerWidth < 700 ? "w-[90vw]" : "w-[40vw]"}
  bind:this={modal}
  closeDisabled={submitting}
  on:close
>
  <form
    on:submit|preventDefault={async () => {
      submitting = true;
      modal.open();
      upsert({
        trivia_day,
        round_number: 1,
        question_number: 1,
      })
        .then(() => dispatcher("upsert-complete"))
        .then(modal.close)
        .catch((e) => (error = e.message))
        .then(() => (submitting = false));
    }}
    class="flex flex-col gap-10"
  >
    <div class="flex flex-col w-full">
      <input
        bind:value={trivia_day}
        type="text"
        disabled={submitting}
        class="border-b-black border-b outline-none disabled:bg-slate-300 disabled:text-gray-500"
        on:input={() => (error = "")}
        required
      />
      <span class="text-xs">Name</span>
    </div>

    <div class="flex flex-row justify-between">
      <button
        type="button"
        class="underline px-2 disabled:bg-slate-300 disabled:text-gray-500"
        disabled={submitting}
        on:click={() => dispatcher("cancelled")}
        >Cancel
      </button>

      <button
        type="submit"
        class="border border-black px-2 self-end flex flex-row gap-2 disabled:bg-slate-300 disabled:text-gray-500"
        disabled={submitting}
        ><span>Submit</span>
        {#if submitting}
          <span class="rotate">◠</span>
        {/if}
      </button>
    </div>
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
