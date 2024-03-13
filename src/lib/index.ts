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

export const beep = () => {
  const audioCtx = new (window.AudioContext ||
    window.webkitAudioContext ||
    window.audioContext)();
  function beepNoise(duration, frequency, volume, type, callback = null) {
    const oscillator = audioCtx.createOscillator();
    const gainNode = audioCtx.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(audioCtx.destination);
    gainNode.gain.exponentialRampToValueAtTime(
      0.00001,
      audioCtx.currentTime + 0.5
    );

    if (volume) {
      gainNode.gain.value = volume;
    }
    if (frequency) {
      oscillator.frequency.value = frequency;
    }
    if (type) {
      oscillator.type = type;
    }
    if (callback) {
      oscillator.onended = callback;
    }

    oscillator.start(audioCtx.currentTime);
    oscillator.stop(audioCtx.currentTime + (duration || 500) / 1000);
  }
  beepNoise(1000, 240, 0.3, "sine");
  setTimeout(() => beepNoise(1000, 440, 0.1, "sine"), 100);
};
