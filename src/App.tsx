import React, { useEffect, useRef, useState } from "react";
import Keyboard from "./Keyboard";
import { useStore, GUESS_LENGTH } from "./store";
import { isValidWord, LETTER_LENGTH } from "./word-utils";
import WordRow from "./WordRow";
import { Info, ChartLine, Share, Gear } from "phosphor-react";
import { StatsChart } from "./StatsChart";
import { StatsScreen } from "./StatsScreen";
import { InfoScreen } from "./InfoScreen";

export default function App() {
  const state = useStore();
  const [guess, setGuess, addGuessLetter] = useGuess();
  const addGuess = useStore((s) => s.addGuess);
  const previousGuess = usePrevious(guess);
  const [showInvalidGuess, setInvalidGuess] = useState(false);
  const [showStatsModal, setShowStatsModal] = React.useState(false);
  const [showInfoModal, setShowInfoModal] = React.useState(false);

  useEffect(() => {
    let id: any;
    if (showInvalidGuess) {
      id = setTimeout(() => setInvalidGuess(false), 1500);
    }
    return () => clearTimeout(id);
  }, [showInvalidGuess]);

  useEffect(() => {
    if (guess.length === 0 && previousGuess?.length === LETTER_LENGTH) {
      if (isValidWord(previousGuess)) {
        addGuess(previousGuess);
        setInvalidGuess(false);
      } else {
        setInvalidGuess(true);
        setGuess(previousGuess);
      }
    }
  }, [guess]);

  let rows = [...state.rows];

  let curRow = 0;
  if (rows.length < GUESS_LENGTH) {
    curRow = rows.push({ guess }) - 1;
  }

  const numGuessesRemaining = GUESS_LENGTH - rows.length;
  const isGameOver = state.gameState !== "playing";
  const opacityLevel = `${isGameOver ? "opacity-30" : "opacity-100"}`;

  rows = rows.concat(Array(numGuessesRemaining).fill(""));

  return (
    <div>
      <div className="mx-auto w-96 relative">
        <header className="border-b border-gray-300 pb-2 my-2 flex flex-col-5 gap-8 justify-center items-center">
          <Info
            size={22}
            onClick={() => {
              setShowInfoModal(true);
            }}
            className="cursor-pointer"
          />
          <ChartLine
            size={22}
            onClick={() => {
              setShowStatsModal(true);
            }}
            className="cursor-pointer"
          />
          <h1 className="text-4xl text-center tracking-tight">Wordle</h1>
          <Share
            size={22}
            onClick={() => {
              console.log("share");
            }}
            className="cursor-pointer"
          />
          <Gear
            size={22}
            onClick={() => {
              console.log("settings");
            }}
            className="cursor-pointer"
          />
        </header>

        <main className={`grid grid-rows-6 gap-1.5 mb-4 px-8 ${opacityLevel}`}>
          {rows.map(({ guess, result }, index) => (
            <WordRow
              key={index}
              letters={guess}
              result={result}
              className={
                showInvalidGuess && curRow === index
                  ? "animate-bounce bg-white/75"
                  : ""
              }
            />
          ))}
        </main>

        <div className={opacityLevel}>
          <Keyboard
            onClick={(letter) => {
              addGuessLetter(letter);
            }}
          />
        </div>

        {showStatsModal ? (
          <>
            <div className="justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none">
              <div className="relative w-auto my-6 mx-auto max-w-3xl">
                {/*content*/}
                <div className="border-0 rounded-lg shadow-lg relative flex flex-col w-full bg-white outline-none focus:outline-none">
                  {/*header*/}
                  <div className="flex items-start justify-between p-5 border-b border-solid border-slate-200 rounded-t">
                    <h3 className="text-3xl font-semibold">Stats</h3>
                    <button
                      className="text-red-500 font-bold uppercase text-sm px-6 py-3 rounded hover:text-red-700 outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                      type="button"
                      onClick={() => setShowStatsModal(false)}
                    >
                      Close
                    </button>
                  </div>
                  {/*body*/}
                  <div className="relative p-6 flex-auto">
                    {<StatsScreen />}
                    {<StatsChart />}
                  </div>
                </div>
              </div>
            </div>
            <div className="opacity-25 fixed inset-0 z-40 bg-black"></div>
          </>
        ) : null}

        {showInfoModal ? (
          <>
            <div className="justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none">
              <div className="relative w-auto my-6 mx-auto max-w-3xl">
                {/*content*/}
                <div className="border-0 rounded-lg shadow-lg relative flex flex-col w-full bg-white outline-none focus:outline-none">
                  {/*header*/}
                  <div className="flex items-start justify-between p-5 border-b border-solid border-slate-200 rounded-t">
                    <h3 className="text-3xl font-semibold">How to Play</h3>
                    <button
                      className="text-red-500 font-bold uppercase text-sm px-6 py-3 rounded hover:text-red-700 outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                      type="button"
                      onClick={() => setShowInfoModal(false)}
                    >
                      Close
                    </button>
                  </div>
                  {/*body*/}
                  <div className="relative p-6 flex-auto">{<InfoScreen />}</div>
                </div>
              </div>
            </div>
            <div className="opacity-25 fixed inset-0 z-40 bg-black"></div>
          </>
        ) : null}

        {isGameOver && (
          <div
            role="modal"
            className="absolute bg-white left-0 right-0 top-1/4 p-6 text-center w-3/4 mx-auto rounded shadow-lg"
          >
            <h2 className="text-xl">You {state.gameState}!</h2>
            <h2>The word was:</h2>
            <div>
              <WordRow letters={state.answer} />
            </div>
            <button
              className="play-again-btn block border rounded border-emerald-500 bg-emerald-500 p-2 mt-4 mx-auto shadow text-white hover:shadow-lg"
              onClick={() => {
                state.newGame();
                setGuess("");
              }}
            >
              New Game
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

function useGuess(): [
  string,
  React.Dispatch<React.SetStateAction<string>>,
  (letter: string) => void
] {
  const [guess, setGuess] = useState("");

  const addGuessLetter = (letter: string) => {
    setGuess((curGuess) => {
      const newGuess = letter.length === 1 ? curGuess + letter : curGuess;
      switch (letter) {
        case "Backspace":
        case "<-":
          return newGuess.slice(0, -1);
        case "Enter":
          if (newGuess.length === LETTER_LENGTH) {
            return "";
          }
      }

      if (curGuess.length === LETTER_LENGTH) {
        return curGuess;
      }

      return newGuess;
    });
  };

  const onKeyDown = (e: KeyboardEvent) => {
    let letter = e.key;
    addGuessLetter(letter);
  };

  useEffect(() => {
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, []);

  return [guess, setGuess, addGuessLetter];
}

function usePrevious<T>(value: T) {
  const ref: any = useRef<T>();
  useEffect(() => {
    ref.current = value;
  }, [value]);
  return ref.current;
}
