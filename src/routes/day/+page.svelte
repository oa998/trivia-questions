<script lang="ts">
  import DeleteQuestionForm from "$components/delete-question-form.svelte";
  import QuestionForm from "$components/question-form.svelte";
  import Question, { type TriviaQuestion } from "$components/question.svelte";
  import { beep, read } from "$lib/index";
  import Icon from "@iconify/svelte";
  import dayjs from "dayjs";
  import { onDestroy, onMount } from "svelte";

  let trivia_day: string = "";
  let questions: TriviaQuestion[] = [];
  let error = "";
  let adding = false;
  let loading = false;
  let editingQuestion: TriviaQuestion | null = null;
  let deletingQuestion: TriviaQuestion | null = null;

  let nextRound = 1;
  let nextQuestion = 1;
  let refreshInterval: number;
  let lastUpdate = new Date().toJSON();
  let soundOn = false;

  function reread() {
    return read(trivia_day)
      .then((q) => {
        if (JSON.stringify(questions) != JSON.stringify(q)) {
          lastUpdate = new Date().toJSON();
          if (soundOn) beep();
        } else {
          const FORTY_MINS = 1000 * 60 * 40;
          if (
            FORTY_MINS < Math.abs(dayjs(new Date(lastUpdate)).diff(new Date()))
          ) {
            clearInterval(refreshInterval);
          }
        }
        questions = q;
      })
      .catch((e) => (error = e))
      .then(() => (loading = false));
  }

  onMount(async () => {
    const urlParams = new URLSearchParams(window.location.search);
    trivia_day = urlParams.get("trivia_day")!;
    loading = true;
    reread();
    refreshInterval = setInterval(reread, 30 * 1000);
  });

  onDestroy(() => {
    clearInterval(refreshInterval);
  });

  $: {
    if (questions?.length) {
      const lastQuestion = questions.at(-1);
      if (
        lastQuestion.question_number == 3 &&
        (lastQuestion.round_number == 3 || lastQuestion.round_number == 6)
      ) {
        nextRound = lastQuestion.round_number;
        nextQuestion = 4;
      } else if (lastQuestion.question_number < 3) {
        nextRound = lastQuestion.round_number;
        nextQuestion = lastQuestion.question_number + 1;
      } else {
        nextRound = lastQuestion.round_number + 1;
        nextQuestion = 1;
      }
    }
  }

  $: score = questions.reduce((score, q) => {
    if (q.round_number == 6 && q.question_number == 4) {
      if (q.correct == 1) return score + q.wager;
      if (q.correct == 0) return score - q.wager;
    }
    if (q.correct == 1) return score + q.wager;
    return score;
  }, 0);
</script>

<div
  class="w-full min-h-[100vh] grid justify-center px-5 pt-5 pb-56 svg relative"
>
  <div class="flex flex-col gap-5 w-full max-w-md">
    {#if loading}
      <div>...loading questions</div>
    {/if}
    {#if questions.length}
      <div class="flex flex-col gap-3 pt-10">
        <div
          class="text-xl font-bold text-center text-white bg-black px-10 w-min whitespace-nowrap self-center flex flex-row gap-5 items-center"
        >
          {trivia_day}
          <button
            class:text-lime-500={soundOn}
            class:border-lime-500={soundOn}
            class="flex flex-row gap-2 items-center border rounded-lg border-white px-2"
            on:click={() => {
              soundOn = !soundOn;
              if (soundOn) beep();
            }}
          >
            {#if soundOn}
              <Icon icon="mdi:speakerphone" color="lime" />
              <span>On</span>
            {:else}
              <Icon icon="mdi:mute" color="pink" />
              <span>Off</span>
            {/if}
          </button>
        </div>
        <div
          class="text-xl font-bold text-center text-white bg-black fixed bottom-2 left-2 whitespace-nowrap px-2"
        >
          Score: {score}
        </div>

        {#each questions as question (question.created_on)}
          {#if question.question_number == 1}
            <div class="text-cyan-200 italic border-b border-b-cyan-200 pt-10">
              ROUND {question.round_number}
            </div>
          {/if}
          {#if question.question_number == 4 && question.round_number == 3}
            <div class="text-cyan-200 italic border-b border-b-cyan-200 pt-10">
              HALFTIME
            </div>
          {/if}

          {#if question.question_number == 4 && question.round_number == 6}
            <div class="text-cyan-200 italic border-b border-b-cyan-200 pt-10">
              FINAL
            </div>
          {/if}
          <Question
            triviaQuestion={question}
            on:edit={() => (editingQuestion = question)}
            on:delete={() => (deletingQuestion = question)}
            on:right-wrong-update={() => reread()}
          />
        {/each}

        {#if adding}
          <QuestionForm
            on:close={() => (adding = false)}
            on:cancelled={() => (adding = false)}
            triviaQuestion={{
              trivia_day,
              round_number: nextRound,
              question_number: nextQuestion,
              question: "",
              answer: "",
            }}
            on:upsert-complete={() => reread().then(() => (adding = false))}
          />
        {:else}
          <button
            class="p-2 border border-gray-200 rounded w-1/2 self-center active:bg-gray-700 text-white"
            on:click={() => (adding = true)}>+</button
          >
        {/if}

        <!-- Edit a question -->
        {#if editingQuestion != null}
          <QuestionForm
            on:close={() => (editingQuestion = null)}
            on:cancelled={() => (editingQuestion = null)}
            triviaQuestion={editingQuestion}
            on:upsert-complete={() =>
              reread().then(() => (editingQuestion = null))}
          />
        {/if}

        {#if deletingQuestion != null}
          <DeleteQuestionForm
            on:close={() => (deletingQuestion = null)}
            on:cancelled={() => (deletingQuestion = null)}
            triviaQuestion={deletingQuestion}
            on:delete-complete={() =>
              reread().then(() => (deletingQuestion = null))}
          />
        {/if}
      </div>
    {/if}
    {#if error}
      <div>{error}</div>
      <a href={"/"} class="underline">Back</a>
    {/if}
  </div>
</div>

<style lang="postcss">
  .svg {
    background-attachment: fixed;
    background-repeat: repeat-y;
    background-size: cover;
    background-image: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' version='1.1' xmlns:xlink='http://www.w3.org/1999/xlink' xmlns:svgjs='http://svgjs.dev/svgjs' width='1440' height='560' preserveAspectRatio='none' viewBox='0 0 1440 560'%3e%3cg clip-path='url(%26quot%3b%23SvgjsClipPath1033%26quot%3b)' fill='none'%3e%3crect width='1440' height='560' x='0' y='0' fill='%230e2a47'%3e%3c/rect%3e%3ccircle r='93.335' cx='25.85' cy='-56.57' stroke='%23365aa3' stroke-opacity='0.25' stroke-width='2'%3e%3c/circle%3e%3ccircle r='93.335' cx='364.33' cy='405.75' stroke='%23365aa3' stroke-opacity='0.25' stroke-width='2'%3e%3c/circle%3e%3ccircle r='93.335' cx='816.47' cy='779.03' stroke='%23365aa3' stroke-opacity='0.25' stroke-width='2'%3e%3c/circle%3e%3ccircle r='79.575' cx='1206.66' cy='210.84' stroke='%23365aa3' stroke-opacity='0.25' stroke-width='2'%3e%3c/circle%3e%3ccircle r='72.455' cx='1270.3' cy='454.52' stroke='%23365aa3' stroke-opacity='0.25' stroke-width='2'%3e%3c/circle%3e%3ccircle r='123.435' cx='709.56' cy='75.38' stroke='%23365aa3' stroke-opacity='0.25' stroke-width='2'%3e%3c/circle%3e%3ccircle r='140.78' cx='233.73' cy='265.89' stroke='%23365aa3' stroke-opacity='0.25' stroke-width='2'%3e%3c/circle%3e%3ccircle r='107.845' cx='846.72' cy='556.44' stroke='%23365aa3' stroke-opacity='0.25' stroke-width='2'%3e%3c/circle%3e%3ccircle r='58.095' cx='507.81' cy='3.64' stroke='%23365aa3' stroke-opacity='0.25' stroke-width='2'%3e%3c/circle%3e%3ccircle r='72.99' cx='803.01' cy='346.46' stroke='%23365aa3' stroke-opacity='0.25' stroke-width='2'%3e%3c/circle%3e%3ccircle r='181.155' cx='507.63' cy='240.68' stroke='%23365aa3' stroke-opacity='0.25' stroke-width='2'%3e%3c/circle%3e%3ccircle r='120.375' cx='503.48' cy='439.93' stroke='%23365aa3' stroke-opacity='0.25' stroke-width='2'%3e%3c/circle%3e%3c/g%3e%3cdefs%3e%3cclipPath id='SvgjsClipPath1033'%3e%3crect width='1440' height='560' x='0' y='0'%3e%3c/rect%3e%3c/clipPath%3e%3c/defs%3e%3c/svg%3e");
  }
</style>
