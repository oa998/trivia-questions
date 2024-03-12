<script lang="ts">
  import DeleteQuestionForm from "$components/delete-question-form.svelte";
  import QuestionForm from "$components/question-form.svelte";
  import Question, { type TriviaQuestion } from "$components/question.svelte";
  import { read } from "$lib/index";
  import { onMount } from "svelte";

  let trivia_day: string = "";
  let questions: TriviaQuestion[] = [];
  let error = "";
  let adding = false;
  let loading = false;
  let editingQuestion: TriviaQuestion | null = null;
  let deletingQuestion: TriviaQuestion | null = null;
  onMount(async () => {
    const urlParams = new URLSearchParams(window.location.search);
    trivia_day = urlParams.get("trivia_day")!;
    loading = true;
    read(trivia_day)
      .then((q) => (questions = q))
      .catch((e) => (error = e))
      .then(() => (loading = false));
  });
</script>

<div
  class="w-full min-h-[100vh] grid justify-center relative px-5 pt-5 pb-32 svg"
>
  <div class="flex flex-col gap-5 w-full max-w-sm">
    {#if loading}
      <div>...loading questions</div>
    {/if}
    {#if questions.length}
      <div class="svg flex flex-col gap-3">
        <div class="text-xl font-bold text-center">{trivia_day}</div>
        {#each questions as question (question.created_on)}
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
              trivia_day: "Wed March 13",
              round_number: 1,
              question_number: 1,
              question: "qaaaaaa?",
              answer: "yes",
            }}
            on:upsert-complete={() => {
              read(trivia_day)
                .then((q) => (questions = q))
                .catch((e) => (error = e))
                .then(() => {
                  adding = false;
                });
            }}
          />
        {:else}
          <button
            class="p-2 border border-gray-700 rounded w-1/2 self-center active:bg-gray-200"
            on:click={() => (adding = true)}>+</button
          >
        {/if}

        <!-- Edit a question -->
        {#if editingQuestion != null}
          <QuestionForm
            on:close={() => (editingQuestion = null)}
            on:cancelled={() => (editingQuestion = null)}
            triviaQuestion={editingQuestion}
            on:upsert-complete={() => {
              read(trivia_day)
                .then((q) => (questions = q))
                .catch((e) => (error = e))
                .then(() => {
                  editingQuestion = null;
                });
            }}
          />
        {/if}

        {#if deletingQuestion != null}
          <DeleteQuestionForm
            on:close={() => (deletingQuestion = null)}
            on:cancelled={() => (deletingQuestion = null)}
            triviaQuestion={deletingQuestion}
            on:delete-complete={() => {
              read(trivia_day)
                .then((q) => (questions = q))
                .catch((e) => (error = e))
                .then(() => {
                  deletingQuestion = null;
                });
            }}
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
    background-color: #ffffff;
    background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 2000 1500'%3E%3Cdefs%3E%3Crect stroke='%23ffffff' stroke-width='.5' width='1' height='1' id='s'/%3E%3Cpattern id='a' width='3' height='3' patternUnits='userSpaceOnUse' patternTransform='scale(50) translate(-980 -735)'%3E%3Cuse fill='%23fcfcfc' href='%23s' y='2'/%3E%3Cuse fill='%23fcfcfc' href='%23s' x='1' y='2'/%3E%3Cuse fill='%23fafafa' href='%23s' x='2' y='2'/%3E%3Cuse fill='%23fafafa' href='%23s'/%3E%3Cuse fill='%23f7f7f7' href='%23s' x='2'/%3E%3Cuse fill='%23f7f7f7' href='%23s' x='1' y='1'/%3E%3C/pattern%3E%3Cpattern id='b' width='7' height='11' patternUnits='userSpaceOnUse' patternTransform='scale(50) translate(-980 -735)'%3E%3Cg fill='%23f5f5f5'%3E%3Cuse href='%23s'/%3E%3Cuse href='%23s' y='5' /%3E%3Cuse href='%23s' x='1' y='10'/%3E%3Cuse href='%23s' x='2' y='1'/%3E%3Cuse href='%23s' x='2' y='4'/%3E%3Cuse href='%23s' x='3' y='8'/%3E%3Cuse href='%23s' x='4' y='3'/%3E%3Cuse href='%23s' x='4' y='7'/%3E%3Cuse href='%23s' x='5' y='2'/%3E%3Cuse href='%23s' x='5' y='6'/%3E%3Cuse href='%23s' x='6' y='9'/%3E%3C/g%3E%3C/pattern%3E%3Cpattern id='h' width='5' height='13' patternUnits='userSpaceOnUse' patternTransform='scale(50) translate(-980 -735)'%3E%3Cg fill='%23f5f5f5'%3E%3Cuse href='%23s' y='5'/%3E%3Cuse href='%23s' y='8'/%3E%3Cuse href='%23s' x='1' y='1'/%3E%3Cuse href='%23s' x='1' y='9'/%3E%3Cuse href='%23s' x='1' y='12'/%3E%3Cuse href='%23s' x='2'/%3E%3Cuse href='%23s' x='2' y='4'/%3E%3Cuse href='%23s' x='3' y='2'/%3E%3Cuse href='%23s' x='3' y='6'/%3E%3Cuse href='%23s' x='3' y='11'/%3E%3Cuse href='%23s' x='4' y='3'/%3E%3Cuse href='%23s' x='4' y='7'/%3E%3Cuse href='%23s' x='4' y='10'/%3E%3C/g%3E%3C/pattern%3E%3Cpattern id='c' width='17' height='13' patternUnits='userSpaceOnUse' patternTransform='scale(50) translate(-980 -735)'%3E%3Cg fill='%23f2f2f2'%3E%3Cuse href='%23s' y='11'/%3E%3Cuse href='%23s' x='2' y='9'/%3E%3Cuse href='%23s' x='5' y='12'/%3E%3Cuse href='%23s' x='9' y='4'/%3E%3Cuse href='%23s' x='12' y='1'/%3E%3Cuse href='%23s' x='16' y='6'/%3E%3C/g%3E%3C/pattern%3E%3Cpattern id='d' width='19' height='17' patternUnits='userSpaceOnUse' patternTransform='scale(50) translate(-980 -735)'%3E%3Cg fill='%23ffffff'%3E%3Cuse href='%23s' y='9'/%3E%3Cuse href='%23s' x='16' y='5'/%3E%3Cuse href='%23s' x='14' y='2'/%3E%3Cuse href='%23s' x='11' y='11'/%3E%3Cuse href='%23s' x='6' y='14'/%3E%3C/g%3E%3Cg fill='%23efefef'%3E%3Cuse href='%23s' x='3' y='13'/%3E%3Cuse href='%23s' x='9' y='7'/%3E%3Cuse href='%23s' x='13' y='10'/%3E%3Cuse href='%23s' x='15' y='4'/%3E%3Cuse href='%23s' x='18' y='1'/%3E%3C/g%3E%3C/pattern%3E%3Cpattern id='e' width='47' height='53' patternUnits='userSpaceOnUse' patternTransform='scale(50) translate(-980 -735)'%3E%3Cg fill='%23F60'%3E%3Cuse href='%23s' x='2' y='5'/%3E%3Cuse href='%23s' x='16' y='38'/%3E%3Cuse href='%23s' x='46' y='42'/%3E%3Cuse href='%23s' x='29' y='20'/%3E%3C/g%3E%3C/pattern%3E%3Cpattern id='f' width='59' height='71' patternUnits='userSpaceOnUse' patternTransform='scale(50) translate(-980 -735)'%3E%3Cg fill='%23F60'%3E%3Cuse href='%23s' x='33' y='13'/%3E%3Cuse href='%23s' x='27' y='54'/%3E%3Cuse href='%23s' x='55' y='55'/%3E%3C/g%3E%3C/pattern%3E%3Cpattern id='g' width='139' height='97' patternUnits='userSpaceOnUse' patternTransform='scale(50) translate(-980 -735)'%3E%3Cg fill='%23F60'%3E%3Cuse href='%23s' x='11' y='8'/%3E%3Cuse href='%23s' x='51' y='13'/%3E%3Cuse href='%23s' x='17' y='73'/%3E%3Cuse href='%23s' x='99' y='57'/%3E%3C/g%3E%3C/pattern%3E%3C/defs%3E%3Crect fill='url(%23a)' width='100%25' height='100%25'/%3E%3Crect fill='url(%23b)' width='100%25' height='100%25'/%3E%3Crect fill='url(%23h)' width='100%25' height='100%25'/%3E%3Crect fill='url(%23c)' width='100%25' height='100%25'/%3E%3Crect fill='url(%23d)' width='100%25' height='100%25'/%3E%3Crect fill='url(%23e)' width='100%25' height='100%25'/%3E%3Crect fill='url(%23f)' width='100%25' height='100%25'/%3E%3Crect fill='url(%23g)' width='100%25' height='100%25'/%3E%3C/svg%3E");
    background-attachment: fixed;
    background-size: cover;
  }
</style>
