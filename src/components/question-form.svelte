<script lang="ts">
  import Modal from "$components/modal.svelte";
  import { upsert } from "$lib/index";
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

<Modal wide bind:this={modal} closeDisabled={submitting} on:close>
  <form
    on:submit|preventDefault={async () => {
      submitting = true;
      modal.open();
      upsert({
        trivia_day,
        round_number,
        question_number,
        question,
        answer,
      })
        .then(() => dispatcher("upsert-complete"))
        .then(modal.close)
        .catch((e) => (error = e.message))
        .then(() => (submitting = false));
    }}
    class="flex flex-col gap-2"
  >
    <div class="flex flex-row justify-around gap-3">
      <div class="flex flex-col w-2/6">
        <input
          bind:value={round_number}
          type="number"
          disabled={submitting}
          class=" max-w-min border-b-black border-b outline-none disabled:bg-slate-300 disabled:text-gray-500"
          on:input={() => (error = "")}
        />
        <span class="text-xs">Round</span>
      </div>

      <div class="flex flex-col w-2/6">
        <input
          bind:value={question_number}
          type="number"
          disabled={submitting}
          class="border-b-black border-b outline-none disabled:bg-slate-300 disabled:text-gray-500"
          on:input={() => (error = "")}
        />
        <span class="text-xs">Question</span>
      </div>
    </div>

    <div class="flex flex-col">
      <textarea
        bind:value={question}
        disabled={submitting}
        cols={6}
        class="border-black border outline-none h-24 p-1 disabled:bg-slate-300 disabled:text-gray-500"
        on:input={() => (error = "")}
      />
      <span class="text-xs">Question</span>
    </div>

    <div class="flex flex-col">
      <textarea
        bind:value={answer}
        disabled={submitting}
        cols={6}
        class="border-black border outline-none h-24 p-1 disabled:bg-slate-300 disabled:text-gray-500"
        on:input={() => (error = "")}
      />
      <span class="text-xs">Answer</span>
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
