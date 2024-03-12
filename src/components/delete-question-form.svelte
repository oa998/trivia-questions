<script lang="ts">
  import Modal from "$components/modal.svelte";
  import { deleteQuestion } from "$lib/index";
  import { createEventDispatcher } from "svelte";
  import type TriviaQuestion from "./question.svelte";
  let modal: Modal;
  export let triviaQuestion: TriviaQuestion;
  let { trivia_day, round_number, question_number, question, answer } =
    triviaQuestion;
  let submitting = false;
  let error = "";
  const dispatcher = createEventDispatcher();
</script>

<Modal class="w-1/2" bind:this={modal} closeDisabled={submitting} on:close>
  <form
    on:submit|preventDefault={async () => {
      submitting = true;
      modal.open();
      deleteQuestion({
        trivia_day,
        round_number,
        question_number,
      })
        .then(() => dispatcher("delete-complete"))
        .then(modal.close)
        .catch((e) => (error = e.message))
        .then(() => (submitting = false));
    }}
    class="flex flex-col gap-2"
  >
    <div class="font-bold text-center">Confirm delete?</div>
    <div class="flex flex-col gap-1">
      <div>Round: {round_number}</div>
      <div>Question: {question_number}</div>
      <div>Question: {question}</div>
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
        ><span>Delete</span>
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
