<script context="module" lang="ts">
  export type TriviaQuestion = {
    trivia_day: string;
    round_number: number;
    question_number: number;
    question: string;
    answer: string;
  };
</script>

<script lang="ts">
  export let triviaQuestion: TriviaQuestion;
  import { createEventDispatcher } from "svelte";

  const dispatcher = createEventDispatcher();
</script>

<div class="cursor-pointer">
  <div class="flex flex-row gap-4 justify-end text-[0.5rem]">
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
        <div class="flex flex-row gap-2 justify-between">
          <div class="flex flex-row gap-1 rounded p-3">
            <div>Round:</div>
            <div>{triviaQuestion.round_number}</div>
          </div>
          <div class="flex flex-row gap-1 rounded p-3">
            <div>Question:</div>
            <div>{triviaQuestion.question_number}</div>
          </div>
        </div>
        <div class="p-4 text-xl text-center font-mono font-extrabold">
          {triviaQuestion.question}
        </div>
      </div>
    </summary>
    <div class="p-3 text-center">
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
