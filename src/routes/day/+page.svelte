<script lang="ts">
  import DeleteQuestionForm from "$components/delete-question-form.svelte";
  import QuestionForm from "$components/question-form.svelte";
  import Question, { type TriviaQuestion } from "$components/question.svelte";
  import { read } from "$lib/index";
  import Icon from "@iconify/svelte";
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

  let eventSource: EventSource;
  let connectedEventSource = false;

  function establishEventSource() {
    eventSource = new EventSource("/data/listen");

    eventSource.onmessage = (e) => {
      connectedEventSource = true;
      if (trivia_day && e.data.includes(trivia_day)) {
        read(trivia_day).then((q) => (questions = q));
      }
      if (e.data.includes("Server Termination")) {
        console.log("restarting SSE in 15 seconds");
        connectedEventSource = false;
        setTimeout(establishEventSource, 15000);
      }
    };

    eventSource.onerror = (e) => {
      connectedEventSource = false;
      establishEventSource();
    };

    connectedEventSource = eventSource.readyState != 2;
  }

  onMount(async () => {
    const urlParams = new URLSearchParams(window.location.search);
    trivia_day = urlParams.get("trivia_day")!;
    loading = true;
    read(trivia_day)
      .then((q) => (questions = q))
      .catch((e) => (error = e))
      .then(() => (loading = false));

    establishEventSource();
  });

  onDestroy(() => {
    console.log("closing eventSource");
    if (eventSource) eventSource.close();
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
    console.log({ nextRound, nextQuestion });
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
  <div class="flex flex-col gap-5 w-full max-w-sm">
    {#if loading}
      <div>...loading questions</div>
    {/if}
    {#if questions.length}
      <div class="flex flex-col gap-3 pt-10">
        <div
          class="text-xl font-bold text-center text-white bg-black px-10 w-min whitespace-nowrap self-center"
        >
          {trivia_day}
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
            on:upsert-complete={() => (adding = false)}
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
            on:upsert-complete={() => (editingQuestion = null)}
          />
        {/if}

        {#if deletingQuestion != null}
          <DeleteQuestionForm
            on:close={() => (deletingQuestion = null)}
            on:cancelled={() => (deletingQuestion = null)}
            triviaQuestion={deletingQuestion}
            on:delete-complete={() => (deletingQuestion = null)}
          />
        {/if}
      </div>
    {/if}
    {#if error}
      <div>{error}</div>
      <a href={"/"} class="underline">Back</a>
    {/if}
  </div>
  <div class="fixed bottom-1 right-1">
    {#if connectedEventSource}
      <Icon icon="lets-icons:check-fill" class="text-sx" color="green" />
    {:else}
      <Icon icon="bxs:x-circle" class="text-sx " color="crimson" />
    {/if}
  </div>
</div>

<style lang="postcss">
  .svg {
    /* background-color: #ffffff;
    background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 2000 1500'%3E%3Cdefs%3E%3Crect stroke='%23ffffff' stroke-width='.5' width='1' height='1' id='s'/%3E%3Cpattern id='a' width='3' height='3' patternUnits='userSpaceOnUse' patternTransform='scale(50) translate(-980 -735)'%3E%3Cuse fill='%23fcfcfc' href='%23s' y='2'/%3E%3Cuse fill='%23fcfcfc' href='%23s' x='1' y='2'/%3E%3Cuse fill='%23fafafa' href='%23s' x='2' y='2'/%3E%3Cuse fill='%23fafafa' href='%23s'/%3E%3Cuse fill='%23f7f7f7' href='%23s' x='2'/%3E%3Cuse fill='%23f7f7f7' href='%23s' x='1' y='1'/%3E%3C/pattern%3E%3Cpattern id='b' width='7' height='11' patternUnits='userSpaceOnUse' patternTransform='scale(50) translate(-980 -735)'%3E%3Cg fill='%23f5f5f5'%3E%3Cuse href='%23s'/%3E%3Cuse href='%23s' y='5' /%3E%3Cuse href='%23s' x='1' y='10'/%3E%3Cuse href='%23s' x='2' y='1'/%3E%3Cuse href='%23s' x='2' y='4'/%3E%3Cuse href='%23s' x='3' y='8'/%3E%3Cuse href='%23s' x='4' y='3'/%3E%3Cuse href='%23s' x='4' y='7'/%3E%3Cuse href='%23s' x='5' y='2'/%3E%3Cuse href='%23s' x='5' y='6'/%3E%3Cuse href='%23s' x='6' y='9'/%3E%3C/g%3E%3C/pattern%3E%3Cpattern id='h' width='5' height='13' patternUnits='userSpaceOnUse' patternTransform='scale(50) translate(-980 -735)'%3E%3Cg fill='%23f5f5f5'%3E%3Cuse href='%23s' y='5'/%3E%3Cuse href='%23s' y='8'/%3E%3Cuse href='%23s' x='1' y='1'/%3E%3Cuse href='%23s' x='1' y='9'/%3E%3Cuse href='%23s' x='1' y='12'/%3E%3Cuse href='%23s' x='2'/%3E%3Cuse href='%23s' x='2' y='4'/%3E%3Cuse href='%23s' x='3' y='2'/%3E%3Cuse href='%23s' x='3' y='6'/%3E%3Cuse href='%23s' x='3' y='11'/%3E%3Cuse href='%23s' x='4' y='3'/%3E%3Cuse href='%23s' x='4' y='7'/%3E%3Cuse href='%23s' x='4' y='10'/%3E%3C/g%3E%3C/pattern%3E%3Cpattern id='c' width='17' height='13' patternUnits='userSpaceOnUse' patternTransform='scale(50) translate(-980 -735)'%3E%3Cg fill='%23f2f2f2'%3E%3Cuse href='%23s' y='11'/%3E%3Cuse href='%23s' x='2' y='9'/%3E%3Cuse href='%23s' x='5' y='12'/%3E%3Cuse href='%23s' x='9' y='4'/%3E%3Cuse href='%23s' x='12' y='1'/%3E%3Cuse href='%23s' x='16' y='6'/%3E%3C/g%3E%3C/pattern%3E%3Cpattern id='d' width='19' height='17' patternUnits='userSpaceOnUse' patternTransform='scale(50) translate(-980 -735)'%3E%3Cg fill='%23ffffff'%3E%3Cuse href='%23s' y='9'/%3E%3Cuse href='%23s' x='16' y='5'/%3E%3Cuse href='%23s' x='14' y='2'/%3E%3Cuse href='%23s' x='11' y='11'/%3E%3Cuse href='%23s' x='6' y='14'/%3E%3C/g%3E%3Cg fill='%23efefef'%3E%3Cuse href='%23s' x='3' y='13'/%3E%3Cuse href='%23s' x='9' y='7'/%3E%3Cuse href='%23s' x='13' y='10'/%3E%3Cuse href='%23s' x='15' y='4'/%3E%3Cuse href='%23s' x='18' y='1'/%3E%3C/g%3E%3C/pattern%3E%3Cpattern id='e' width='47' height='53' patternUnits='userSpaceOnUse' patternTransform='scale(50) translate(-980 -735)'%3E%3Cg fill='%23F60'%3E%3Cuse href='%23s' x='2' y='5'/%3E%3Cuse href='%23s' x='16' y='38'/%3E%3Cuse href='%23s' x='46' y='42'/%3E%3Cuse href='%23s' x='29' y='20'/%3E%3C/g%3E%3C/pattern%3E%3Cpattern id='f' width='59' height='71' patternUnits='userSpaceOnUse' patternTransform='scale(50) translate(-980 -735)'%3E%3Cg fill='%23F60'%3E%3Cuse href='%23s' x='33' y='13'/%3E%3Cuse href='%23s' x='27' y='54'/%3E%3Cuse href='%23s' x='55' y='55'/%3E%3C/g%3E%3C/pattern%3E%3Cpattern id='g' width='139' height='97' patternUnits='userSpaceOnUse' patternTransform='scale(50) translate(-980 -735)'%3E%3Cg fill='%23F60'%3E%3Cuse href='%23s' x='11' y='8'/%3E%3Cuse href='%23s' x='51' y='13'/%3E%3Cuse href='%23s' x='17' y='73'/%3E%3Cuse href='%23s' x='99' y='57'/%3E%3C/g%3E%3C/pattern%3E%3C/defs%3E%3Crect fill='url(%23a)' width='100%25' height='100%25'/%3E%3Crect fill='url(%23b)' width='100%25' height='100%25'/%3E%3Crect fill='url(%23h)' width='100%25' height='100%25'/%3E%3Crect fill='url(%23c)' width='100%25' height='100%25'/%3E%3Crect fill='url(%23d)' width='100%25' height='100%25'/%3E%3Crect fill='url(%23e)' width='100%25' height='100%25'/%3E%3Crect fill='url(%23f)' width='100%25' height='100%25'/%3E%3Crect fill='url(%23g)' width='100%25' height='100%25'/%3E%3C/svg%3E");
    */
    background-attachment: fixed;
    background-repeat: repeat-y;
    background-size: cover;
    background-image: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' version='1.1' xmlns:xlink='http://www.w3.org/1999/xlink' xmlns:svgjs='http://svgjs.dev/svgjs' width='1440' height='560' preserveAspectRatio='none' viewBox='0 0 1440 560'%3e%3cg clip-path='url(%26quot%3b%23SvgjsClipPath1033%26quot%3b)' fill='none'%3e%3crect width='1440' height='560' x='0' y='0' fill='%230e2a47'%3e%3c/rect%3e%3ccircle r='93.335' cx='25.85' cy='-56.57' stroke='%23365aa3' stroke-opacity='0.25' stroke-width='2'%3e%3c/circle%3e%3ccircle r='93.335' cx='364.33' cy='405.75' stroke='%23365aa3' stroke-opacity='0.25' stroke-width='2'%3e%3c/circle%3e%3ccircle r='93.335' cx='816.47' cy='779.03' stroke='%23365aa3' stroke-opacity='0.25' stroke-width='2'%3e%3c/circle%3e%3ccircle r='79.575' cx='1206.66' cy='210.84' stroke='%23365aa3' stroke-opacity='0.25' stroke-width='2'%3e%3c/circle%3e%3ccircle r='72.455' cx='1270.3' cy='454.52' stroke='%23365aa3' stroke-opacity='0.25' stroke-width='2'%3e%3c/circle%3e%3ccircle r='123.435' cx='709.56' cy='75.38' stroke='%23365aa3' stroke-opacity='0.25' stroke-width='2'%3e%3c/circle%3e%3ccircle r='140.78' cx='233.73' cy='265.89' stroke='%23365aa3' stroke-opacity='0.25' stroke-width='2'%3e%3c/circle%3e%3ccircle r='107.845' cx='846.72' cy='556.44' stroke='%23365aa3' stroke-opacity='0.25' stroke-width='2'%3e%3c/circle%3e%3ccircle r='58.095' cx='507.81' cy='3.64' stroke='%23365aa3' stroke-opacity='0.25' stroke-width='2'%3e%3c/circle%3e%3ccircle r='72.99' cx='803.01' cy='346.46' stroke='%23365aa3' stroke-opacity='0.25' stroke-width='2'%3e%3c/circle%3e%3ccircle r='181.155' cx='507.63' cy='240.68' stroke='%23365aa3' stroke-opacity='0.25' stroke-width='2'%3e%3c/circle%3e%3ccircle r='120.375' cx='503.48' cy='439.93' stroke='%23365aa3' stroke-opacity='0.25' stroke-width='2'%3e%3c/circle%3e%3c/g%3e%3cdefs%3e%3cclipPath id='SvgjsClipPath1033'%3e%3crect width='1440' height='560' x='0' y='0'%3e%3c/rect%3e%3c/clipPath%3e%3c/defs%3e%3c/svg%3e");
  }
</style>
