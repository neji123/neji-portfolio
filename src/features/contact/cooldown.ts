"use client";

import { useSyncExternalStore } from "react";

/** Session key: until when (epoch ms) the form rests after a successful send. */
const COOLDOWN_KEY = "nb-contact-cooldown-until";
/** Ten minutes between two messages from the same tab. */
export const COOLDOWN_MS = 600_000;

// One store for the tab: `null` until first read from sessionStorage, 0 when the form is free.
let until: number | null = null;
let timer: number | undefined;
const listeners = new Set<() => void>();

function emit() {
  for (const listener of listeners) listener();
}

function readStored(): number {
  try {
    const value = Number(window.sessionStorage.getItem(COOLDOWN_KEY));
    return Number.isFinite(value) && value > Date.now() ? value : 0;
  } catch {
    return 0;
  }
}

/** Frees the form when the cooldown runs out, without polling. */
function scheduleEnd() {
  window.clearTimeout(timer);
  if (!until) return;
  timer = window.setTimeout(() => {
    until = 0;
    try {
      window.sessionStorage.removeItem(COOLDOWN_KEY);
    } catch {
      // Storage blocked: the in-memory store is enough.
    }
    emit();
  }, until - Date.now());
}

function isCoolingDown(): boolean {
  if (until === null) {
    until = readStored();
    scheduleEnd();
  }
  return until > 0;
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

export function startCooldown() {
  until = Date.now() + COOLDOWN_MS;
  try {
    window.sessionStorage.setItem(COOLDOWN_KEY, String(until));
  } catch {
    // Storage blocked (private mode): the cooldown still holds for this page.
  }
  scheduleEnd();
  emit();
}

/** Whether the form is resting after a send. The server render, and hydration, say no. */
export function useCooldown(): boolean {
  return useSyncExternalStore(subscribe, isCoolingDown, () => false);
}
