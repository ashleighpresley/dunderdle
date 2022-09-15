import create from "zustand";
import { persist } from "zustand/middleware";
import {
  computeGuess,
  getRandomWord,
  getHint,
  getNumber,
  LetterState,
} from "./word-utils";
export const GUESS_LENGTH = 6;
let wins = 0;
let losses = 0;
let winRate = 0;
let curStreak = 0;
let bestStreak = 0;
let winDistribution = [0, 0, 0, 0, 0, 0];
let theme = "light";

interface GuessRow {
  guess: string;
  result?: LetterState[];
}

interface StoreState {
  answer: string;
  rows: GuessRow[];
  num: string;
  hint: string;
  gameState: "playing" | "won" | "lost";
  keyboardLetterState: { [letter: string]: LetterState };
  addGuess: (guess: string) => void;
  newGame: (initialGuess?: string[]) => void;
  wins: number;
  losses: number;
  winRate: number;
  curStreak: number;
  bestStreak: number;
  winDistribution: number[];
  theme: string;
}

export const useStore = create<StoreState>(
  persist(
    (set, get) => {
      function addGuess(guess: string) {
        const result = computeGuess(guess, get().answer);
        const didWin = result.every((i) => i === LetterState.Match);
        const rows = [...get().rows, { guess, result }];

        const keyboardLetterState = get().keyboardLetterState;
        result.forEach((r, index) => {
          const resultGuessLetter = guess[index];
          const currentLetterState = keyboardLetterState[resultGuessLetter];
          switch (currentLetterState) {
            case LetterState.Match:
              break;
            case LetterState.Present:
              if (r === LetterState.Miss) {
                break;
              }
            default:
              keyboardLetterState[resultGuessLetter] = r;
              break;
          }
        });

        set(() => ({
          rows,
          keyboardLetterState,
          gameState: didWin
            ? "won"
            : rows.length === GUESS_LENGTH
            ? "lost"
            : "playing",
          wins: didWin ? (get().wins += 1) : get().wins,
          curStreak: didWin
            ? (get().curStreak += 1)
            : rows.length === GUESS_LENGTH
            ? 0
            : get().curStreak,
          bestStreak:
            get().curStreak >= get().bestStreak
              ? get().curStreak
              : get().bestStreak,
          losses:
            !didWin && rows.length === GUESS_LENGTH
              ? (get().losses += 1)
              : get().losses,
          winRate: Math.round((get().wins / (get().wins + get().losses)) * 100),
          winDistribution: didWin
            ? get().winDistribution.map((i, index) =>
                index === rows.length - 1 ? (i += 1) : i
              )
            : get().winDistribution,
        }));
      }

      return {
        answer: getRandomWord(),
        rows: [],
        num: getNumber(),
        hint: getHint(),
        gameState: "playing",
        keyboardLetterState: {},
        addGuess,
        newGame: (initialRows = []) => {
          set({
            answer: getRandomWord(),
            rows: [],
            num: getNumber(),
            hint: getHint(),
            gameState: "playing",
            keyboardLetterState: {},
          });
          initialRows.forEach(addGuess);
        },
        wins,
        losses,
        winRate,
        curStreak,
        bestStreak,
        winDistribution,
        squares: [],
        theme,
      };
    },
    {
      name: "dunderdle", // unique name
    }
  )
);

//Below can be used to fully clear the persisted value in the storage.
//useStore.persist.clearStorage();
