// place files you want to import through the `$lib` alias in this folder.

import { isLoggedIn } from "$stores/auth";
import { peekFor401, throwIfNot2xx } from "./fetch-utils";

export const login = async (password: string) => {
  return fetch("/data/am-i-available/login-pw", {
    method: "POST",
    headers: {
      "content-type": "application/json",
    },
    credentials: "include",
    body: JSON.stringify({ password }),
  })
    .then(peekFor401)
    .then(throwIfNot2xx)
    .then(() => {
      isLoggedIn.set(true);
    });
};

export const getAvailabilities = async () => {
  return fetch("/data/am-i-available/get-availabilities")
    .then(peekFor401)
    .then(throwIfNot2xx);
};

export const setAvailability = async (
  name: string,
  date: string,
  isAvailable: 0 | 1
) => {
  return fetch("/data/am-i-available/set-availability", {
    method: "POST",
    headers: {
      "content-type": "application/json",
    },
    credentials: "include",
    body: JSON.stringify({ name, date, isAvailable }),
  })
    .then(peekFor401)
    .then(throwIfNot2xx);
};

export const addAttendee = async (name: string) => {
  return fetch("/data/am-i-available/add-attendee", {
    method: "POST",
    headers: {
      "content-type": "application/json",
    },
    credentials: "include",
    body: JSON.stringify({ name }),
  })
    .then(peekFor401)
    .then(throwIfNot2xx);
};

export const removeAttendee = async (name: string) => {
  return fetch("/data/am-i-available/remove-attendee", {
    method: "POST",
    headers: {
      "content-type": "application/json",
    },
    credentials: "include",
    body: JSON.stringify({ name }),
  })
    .then(peekFor401)
    .then(throwIfNot2xx);
};

export const addDate = async (date: string) => {
  return fetch("/data/am-i-available/add-date", {
    method: "POST",
    headers: {
      "content-type": "application/json",
    },
    credentials: "include",
    body: JSON.stringify({ date }),
  })
    .then(peekFor401)
    .then(throwIfNot2xx);
};

export const removeDate = async (date: string) => {
  return fetch("/data/am-i-available/remove-date", {
    method: "POST",
    headers: {
      "content-type": "application/json",
    },
    credentials: "include",
    body: JSON.stringify({ date }),
  })
    .then(peekFor401)
    .then(throwIfNot2xx);
};
