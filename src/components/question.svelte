<script context="module" lang="ts">
  export type TriviaQuestion = {
    trivia_day: string;
    round_number: number;
    question_number: number;
    question: string;
    answer: string;
    wager: number;
    correct: number; // boolean
  };
</script>

<script lang="ts">
  import { upsert } from "$lib/index";
  import Icon from "@iconify/svelte";

  import { createEventDispatcher } from "svelte";
  export let triviaQuestion: TriviaQuestion;
  const dispatcher = createEventDispatcher();
</script>

<div class="cursor-pointer">
  <div class="flex flex-row gap-4 justify-end text-[0.5rem] text-white">
    <button
      class="underline"
      on:click={() => dispatcher("edit", triviaQuestion)}>edit</button
    >
    <button
      class="underline"
      on:click={() => dispatcher("delete", triviaQuestion)}>delete</button
    >
  </div>
  <details class="border-black border rounded bg-white bg-opacity-80">
    <summary>
      <div class="flex flex-col">
        <button
          class="flex flex-row gap-2 justify-between border-b border-b-cyan-100"
          on:click|stopPropagation
        >
          {#if triviaQuestion.question_number > 3}
            <div />
          {:else}
            <div class="flex flex-row gap-1 rounded p-3">
              <div>Question #</div>
              <div>{triviaQuestion.question_number}</div>
            </div>
          {/if}

          <button
            class:bg-red-400={triviaQuestion.correct == 0}
            class:bg-green-600={triviaQuestion.correct == 1}
            class="flex flex-row gap-1 rounded p-3"
            on:click={() => {
              const c =
                triviaQuestion.correct == null ? 2 : triviaQuestion.correct;
              upsert({
                ...triviaQuestion,
                correct: (c + 2) % 3,
              }).then((updatedRow) =>
                dispatcher("right-wrong-update", updatedRow)
              );
            }}
          >
            {#if triviaQuestion.correct == 1}
              <Icon
                icon="lets-icons:check-fill"
                class="text-2xl "
                color="lime"
              />
            {/if}
            {#if triviaQuestion.correct == 0}
              <Icon
                icon="octicon:x-circle-fill-12"
                class="text-2xl"
                color="crimson"
              />
            {/if}
            {#if triviaQuestion.correct == 2}
              <div class="w-10" />
            {/if}
            <div>Points</div>
            <div>
              {triviaQuestion.wager == null ? "-" : triviaQuestion.wager}
            </div>
          </button>
        </button>
        <div
          class="p-4 text-xl text-center font-mono font-extrabold whitespace-pre-wrap"
        >
          {triviaQuestion.question}
        </div>
      </div>
    </summary>
    <div class="p-3 text-center whitespace-pre-wrap">
      <div>{triviaQuestion.answer}</div>
    </div>
  </details>
</div>

<style lang="postcss">
  details > summary {
    list-style: none;
  }
  details > summary::-webkit-details-marker {
    display: none;
  }
  details[open] summary ~ div {
    color: white;
    background: rgb(255 103 2);
  }
</style>
