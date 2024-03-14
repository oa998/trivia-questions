<script lang="ts">
  import Modal from "$components/modal.svelte";
  import { upsert } from "$lib/index";
  import Icon from "@iconify/svelte";
  import { createEventDispatcher } from "svelte";
  import type TriviaQuestion from "./question.svelte";
  let modal: Modal;
  export let triviaQuestion: TriviaQuestion;
  let {
    trivia_day,
    round_number,
    question_number,
    category,
    question,
    answer,
    wager,
    correct,
  } = triviaQuestion;
  let submitting = false;
  let error = "";
  const dispatcher = createEventDispatcher();
  let answer_correct_toggle = correct == null ? 2 : correct;
</script>

<Modal
  class="w-[80vw] max-w-xl"
  bind:this={modal}
  closeDisabled={submitting}
  on:close
>
  <form
    on:submit|preventDefault={async () => {
      submitting = true;
      modal.open();
      let correct = answer_correct_toggle;
      if (answer_correct_toggle == 2) {
        correct = null;
      }
      upsert({
        trivia_day,
        round_number,
        question_number,
        question,
        category,
        answer,
        wager,
        correct,
      })
        .then(() => dispatcher("upsert-complete"))
        .then(modal.close)
        .catch((e) => (error = e.message))
        .then(() => (submitting = false));
    }}
    class="flex flex-col gap-2"
  >
    <div class="flex flex-row justify-center gap-10 flex-wrap">
      <div class="flex flex-col w-[100px]">
        <input
          bind:value={round_number}
          type="number"
          disabled={submitting}
          class=" max-w-min border-b-black border-b outline-none disabled:bg-slate-300 disabled:text-gray-500"
          on:input={() => (error = "")}
          required
        />
        <span class="text-xs">Round</span>
      </div>

      <div class="flex flex-col w-[100px]">
        <input
          bind:value={question_number}
          type="number"
          disabled={submitting}
          class="border-b-black border-b outline-none disabled:bg-slate-300 disabled:text-gray-500"
          on:input={() => (error = "")}
          required
        />
        <span class="text-xs">Question</span>
      </div>

      <div class="flex flex-col w-[100px]">
        <input
          bind:value={wager}
          type="number"
          disabled={submitting}
          class="border-b-black border-b outline-none disabled:bg-slate-300 disabled:text-gray-500"
          on:input={() => (error = "")}
          required
          min={0}
          max={15}
        />
        <span class="text-xs">Wager/Winnings</span>
      </div>

      <button
        type="button"
        class:bg-red-200={answer_correct_toggle == 0}
        class:bg-green-200={answer_correct_toggle == 1}
        class:bg-white={answer_correct_toggle == 2}
        class="flex flex-row w-min gap-2 items-center px-2 rounded-lg"
        on:click={() => {
          answer_correct_toggle += 2;
          answer_correct_toggle %= 3;
          console.log("final:", answer_correct_toggle);
        }}
      >
        <span class="text-xs">Answered:</span>
        {#if answer_correct_toggle == 0}
          <Icon icon="bxs:x-circle" class="text-lg " color="crimson" />
        {/if}
        {#if answer_correct_toggle == 1}
          <Icon icon="lets-icons:check-fill" class="text-lg" color="green" />
        {/if}
        {#if answer_correct_toggle == 2}
          <Icon icon="ic:outline-remove-circle" class="text-lg" color="gray" />
        {/if}
      </button>
    </div>

    <div class="flex flex-col w-full pt-3">
      <input
        bind:value={category}
        type="text"
        disabled={submitting}
        class="border-b-black border-b outline-none disabled:bg-slate-300 disabled:text-gray-500"
        on:input={() => (error = "")}
      />
      <span class="text-xs">Category</span>
    </div>

    <div class="flex flex-col">
      <textarea
        bind:value={question}
        disabled={submitting}
        cols={6}
        class="border-black border outline-none h-24 p-1 disabled:bg-slate-300 disabled:text-gray-500"
        on:input={() => (error = "")}
        autofocus
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
