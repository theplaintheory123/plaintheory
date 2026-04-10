"use client";

import { useReducer, useEffect, useRef } from "react";

type TimerState = "idle" | "running" | "paused" | "break";

interface State {
  status: TimerState;
  secondsLeft: number;
  focusDuration: number;
  breakDuration: number;
  sessionsToday: number;
}

type Action =
  | { type: "START" }
  | { type: "PAUSE" }
  | { type: "RESET" }
  | { type: "TICK" }
  | { type: "COMPLETE_FOCUS" }
  | { type: "START_BREAK" }
  | { type: "COMPLETE_BREAK" }
  | { type: "SET_DURATION"; focusDuration: number; breakDuration: number };

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case "START":
      return { ...state, status: "running" };
    case "PAUSE":
      return { ...state, status: "paused" };
    case "RESET":
      return { ...state, status: "idle", secondsLeft: state.focusDuration * 60 };
    case "TICK":
      return { ...state, secondsLeft: state.secondsLeft - 1 };
    case "COMPLETE_FOCUS":
      return { ...state, status: "break", secondsLeft: state.breakDuration * 60, sessionsToday: state.sessionsToday + 1 };
    case "COMPLETE_BREAK":
      return { ...state, status: "idle", secondsLeft: state.focusDuration * 60 };
    case "SET_DURATION":
      return { ...state, focusDuration: action.focusDuration, breakDuration: action.breakDuration, secondsLeft: action.focusDuration * 60 };
    default:
      return state;
  }
}

interface TimerOptions {
  focusDuration?: number;
  breakDuration?: number;
  onFocusComplete?: (durationMinutes: number) => void;
}

export function useTimer({ focusDuration = 25, breakDuration = 5, onFocusComplete }: TimerOptions = {}) {
  const [state, dispatch] = useReducer(reducer, {
    status: "idle",
    secondsLeft: focusDuration * 60,
    focusDuration,
    breakDuration,
    sessionsToday: 0,
  });

  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (state.status === "running") {
      intervalRef.current = setInterval(() => {
        dispatch({ type: "TICK" });
      }, 1000);
    } else {
      if (intervalRef.current) clearInterval(intervalRef.current);
    }
    return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
  }, [state.status]);

  useEffect(() => {
    if (state.secondsLeft <= 0) {
      if (state.status === "running") {
        onFocusComplete?.(state.focusDuration);
        dispatch({ type: "COMPLETE_FOCUS" });
      } else if (state.status === "break") {
        dispatch({ type: "COMPLETE_BREAK" });
      }
    }
  }, [state.secondsLeft, state.status]);

  const minutes = Math.floor(state.secondsLeft / 60);
  const seconds = state.secondsLeft % 60;
  const display = `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
  const progress = state.status === "break"
    ? 1 - state.secondsLeft / (state.breakDuration * 60)
    : 1 - state.secondsLeft / (state.focusDuration * 60);

  return {
    state,
    display,
    progress,
    start: () => dispatch({ type: "START" }),
    pause: () => dispatch({ type: "PAUSE" }),
    reset: () => dispatch({ type: "RESET" }),
    setDuration: (focus: number, brk?: number) =>
      dispatch({ type: "SET_DURATION", focusDuration: focus, breakDuration: brk ?? state.breakDuration }),
  };
}
