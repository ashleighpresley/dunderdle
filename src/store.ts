import create from "zustand";
import { persist } from "zustand/middleware";
import { computeGuess, getRandomWord, LetterState } from "./word-utils";
export const GUESS_LENGTH = 6;
let wins = 0;
let losses = 0;
let winRate = 0;
let curStreak = 0;
let bestStreak = 0;
let winDistribution = [0, 0, 0, 0, 0, 0];

interface GuessRow {
  guess: string;
  result?: LetterState[];
}

interface StoreState {
  answer: string;
  rows: GuessRow[];
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
}

export const useStore = create<StoreState>(
  persist(
    (set, get) => {
      function addGuess(guess: string) {
        const result = computeGuess(guess, get().answer);
        const didWin = result.every((i) => i === LetterState.Match);
        const rows = [...get().rows, { guess, result }];

        didWin
          ? ((wins += 1),
            (curStreak += 1),
            curStreak >= bestStreak ? (bestStreak = curStreak) : bestStreak,
            (winDistribution[rows.length - 1] += 1))
          : rows.length === GUESS_LENGTH
          ? ((losses += 1), (curStreak = 0))
          : null;

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
          wins,
          losses,
          winRate: Math.round((wins / (wins + losses)) * 100),
          curStreak,
          bestStreak,
          winDistribution,
        }));
      }
      return {
        answer: getRandomWord(),
        rows: [],
        gameState: "playing",
        keyboardLetterState: {},
        addGuess,
        newGame: (initialRows = []) => {
          set({
            answer: getRandomWord(),
            rows: [],
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
      };
    },
    {
      name: "wordle", // unique name
    }
  )
);

//Below can be used to fully clear the persisted value in the storage.
//useStore.persist.clearStorage();
