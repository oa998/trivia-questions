// place files you want to import through the `$lib` alias in this folder.

import type { TriviaQuestion } from "$components/question.svelte";
import { peekFor401, throwIfNot2xx } from "./fetch-utils";

export const login = async (password: string) => {
  return fetch("/data/login-pw", {
    method: "POST",
    headers: {
      "content-type": "application/json",
    },
    credentials: "include",
    body: JSON.stringify({ password }),
  })
    .then(peekFor401)
    .then(throwIfNot2xx);
};

export const getAllDays = async () => {
  return fetch("/data/read-day-list", {
    method: "POST",
    headers: {
      "content-type": "application/json",
    },
    credentials: "include",
  })
    .then(peekFor401)
    .then(throwIfNot2xx)
    .then((r) => r.json())
    .then((j) =>
      j.map((row) => ({
        ...row,
        created_on: new Date(row.created_on),
      }))
    );
};

export const read = async (triviaDay: string) => {
  return fetch("/data/read", {
    method: "POST",
    headers: {
      "content-type": "application/json",
    },
    credentials: "include",
    body: JSON.stringify({ triviaDay }),
  })
    .then(peekFor401)
    .then(throwIfNot2xx)
    .then((r) => r.json())
    .then((j) => {
      if (j?.length) {
        return j;
      } else {
        throw new Error(`No questions exist for ${triviaDay}, yet`);
      }
    });
};

export const upsert = async (triviaQuestion: TriviaQuestion) => {
  return fetch("/data/upsert", {
    method: "POST",
    headers: {
      "content-type": "application/json",
    },
    credentials: "include",
    body: JSON.stringify({
      ...triviaQuestion,
      triviaDay: triviaQuestion.trivia_day,
      roundNumber: triviaQuestion.round_number,
      questionNumber: triviaQuestion.question_number,
    }),
  })
    .then(peekFor401)
    .then(throwIfNot2xx);
};

export const deleteQuestion = async (
  triviaQuestion: Omit<TriviaQuestion, "question" | "answer">
) => {
  return fetch("/data/delete", {
    method: "POST",
    headers: {
      "content-type": "application/json",
    },
    credentials: "include",
    body: JSON.stringify({
      triviaDay: triviaQuestion.trivia_day,
      roundNumber: triviaQuestion.round_number,
      questionNumber: triviaQuestion.question_number,
    }),
  })
    .then(peekFor401)
    .then(throwIfNot2xx);
};
