import React, { useCallback, useEffect, useRef, useState } from "react";
import Keyboard from "./Keyboard";
import { useStore, GUESS_LENGTH } from "./store";
import { isValidWord, LETTER_LENGTH } from "./word-utils";
import WordRow from "./WordRow";
import { Info, ChartLine, Share, Moon, Sun, XCircle } from "phosphor-react";
import { StatsChart } from "./StatsChart";
import { StatsScreen } from "./StatsScreen";
import { InfoScreen } from "./InfoScreen";
import { ShareScreen } from "./ShareScreen";

export default function App() {
  const state = useStore();
  const [guess, setGuess, addGuessLetter] = useGuess();
  const addGuess = useStore((s) => s.addGuess);
  const previousGuess = usePrevious(guess);
  const [showInvalidGuess, setInvalidGuess] = useState(false);
  const [showStatsModal, setShowStatsModal] = React.useState(false);
  const [showInfoModal, setShowInfoModal] = React.useState(false);
  const [showShareModal, setShowShareModal] = React.useState(false);
  const [showGameOverModal, setShowGameOverModal] = React.useState(false);
  const [hours, setHours] = useState(10);
  const [minutes, setMinutes] = useState(10);
  const [seconds, setSeconds] = useState(10);
  const [isLoading, setIsLoading] = useState(true);

  (function resetAtMidnight() {
    const state = useStore();
    const now = new Date();

    let milsTilMidnight =
      new Date(
        now.getFullYear(),
        now.getMonth(),
        now.getDate(),
        11,
        30,
        10,
        0
      ).getTime() - now.getTime();
    if (milsTilMidnight < 0) {
      milsTilMidnight += 86400000; // it's after midnight, try midnight tomorrow.
    }
    setTimeout(function () {
      state.newGame();
      setGuess("");
      () => resetAtMidnight();
    }, milsTilMidnight);
  })();

  useEffect(() => {
    const nextWordleCountdown = () => {
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      tomorrow.setHours(0, 0, 0, 0);
      const today = new Date().getTime();

      const timeDiff = tomorrow.getTime() - today;

      const seconds = 1000;
      const minutes = seconds * 60;
      const hours = minutes * 60;
      const days = hours * 24;

      let timeHours = Math.floor((timeDiff % days) / hours);
      let timeMinutes = Math.floor((timeDiff % hours) / minutes);
      let timeSeconds = Math.floor((timeDiff % minutes) / seconds);

      timeHours = timeHours < 10 ? 0 + timeHours : timeHours;
      timeMinutes = timeMinutes < 10 ? 0 + timeMinutes : timeMinutes;
      timeSeconds = timeSeconds < 10 ? 0 + timeSeconds : timeSeconds;

      setHours(timeHours);
      setMinutes(timeMinutes);
      setSeconds(timeSeconds);
      setIsLoading(false);
    };
    setInterval(nextWordleCountdown, 1000);
  }, []);

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
  isGameOver ? () => setShowGameOverModal(true) : null;

  rows = rows.concat(Array(numGuessesRemaining).fill(""));

  const darkTheme = ["bg-slate-600", "text-white"];
  const lightTheme = ["bg-white", "text-black"];

  state.theme === "dark"
    ? (document.body.classList.add(darkTheme[0]),
      document
        .querySelectorAll(".icon")
        .forEach((el) => el.classList.add(darkTheme[1])),
      document
        .querySelectorAll("h1")
        .forEach((el) => el.classList.add(darkTheme[1])))
    : (document.body.classList.remove(darkTheme[0]),
      document
        .querySelectorAll(".icon")
        .forEach((el) => el.classList.remove(darkTheme[1])),
      document
        .querySelectorAll("h1")
        .forEach((el) => el.classList.remove(darkTheme[1])));

  return (
    <div>
      <div className="mx-auto w-96 relative">
        <header className="border-b border-gray-300 pb-2 my-2 flex flex-col-5 gap-8 justify-center items-center">
          <Info
            size={22}
            onClick={() => {
              setShowInfoModal(true);
            }}
            className="cursor-pointer icon"
          />
          <ChartLine
            size={22}
            onClick={() => {
              setShowStatsModal(true);
            }}
            className="cursor-pointer icon"
          />
          <h1 className="text-4xl text-center tracking-tight">Wordle</h1>
          <Share
            size={22}
            onClick={() => {
              setShowShareModal(true);
            }}
            className="cursor-pointer icon"
          />
          {state.theme === "light" ? (
            <Moon
              size={22}
              onClick={() => (state.theme = "dark")}
              className="cursor-pointer icon"
            />
          ) : (
            <Sun
              size={22}
              onClick={() => (state.theme = "light")}
              className="cursor-pointer icon"
            />
          )}
        </header>

        <main
          className={`grid grid-rows-6 gap-1.5 mb-4 px-8 ${
            state.theme === "dark" ? darkTheme[1] : lightTheme[1]
          }`}
        >
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

        <div>
          <Keyboard
            onClick={(letter) => {
              addGuessLetter(letter);
            }}
          />
        </div>

        {showStatsModal ? (
          <>
            <div
              className={`justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none ${
                state.theme === "dark" ? darkTheme[1] : lightTheme[1]
              }`}
            >
              <div className="relative w-auto my-6 mx-auto max-w-3xl">
                {/*content*/}
                <div
                  className={`border-0 rounded-lg shadow-lg relative flex flex-col w-full outline-none focus:outline-none ${
                    state.theme === "dark" ? darkTheme[0] : lightTheme[0]
                  }`}
                >
                  {/*header*/}
                  <div className="flex items-start justify-between p-5 border-b border-solid border-slate-200 rounded-t">
                    <h3 className="text-3xl font-semibold">Stats</h3>
                    <button
                      className="font-bold uppercase text-sm px-6 py-3 rounded hover:text-red-700 outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                      type="button"
                      onClick={() => setShowStatsModal(false)}
                    >
                      <XCircle size={22} className={"icon"} />
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
            <div
              className={`justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none ${
                state.theme === "dark" ? darkTheme[1] : lightTheme[1]
              }`}
            >
              <div className="relative w-auto my-6 mx-auto max-w-3xl">
                {/*content*/}
                <div
                  className={`border-0 rounded-lg shadow-lg relative flex flex-col w-full outline-none focus:outline-none ${
                    state.theme === "dark" ? darkTheme[0] : lightTheme[0]
                  }`}
                >
                  {/*header*/}
                  <div className="flex items-start justify-between p-5 border-b border-solid border-slate-200 rounded-t">
                    <h3 className="text-3xl font-semibold">How to Play</h3>
                    <button
                      className="font-bold uppercase text-sm px-6 py-3 rounded hover:text-red-700 outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                      type="button"
                      onClick={() => setShowInfoModal(false)}
                    >
                      <XCircle size={22} className={"icon"} />
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

        {showShareModal ? (
          <>
            <div
              className={`justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none ${
                state.theme === "dark" ? darkTheme[1] : lightTheme[1]
              }`}
            >
              <div className="relative w-auto my-6 mx-auto max-w-3xl">
                {/*content*/}
                <div
                  className={`border-0 rounded-lg shadow-lg relative flex flex-col w-full outline-none focus:outline-none ${
                    state.theme === "dark" ? darkTheme[0] : lightTheme[0]
                  }`}
                >
                  {/*header*/}
                  <div className="flex items-start justify-between p-5 border-b border-solid border-slate-200 rounded-t">
                    <h3 className="text-3xl font-semibold">Share</h3>
                    <button
                      className="font-bold uppercase text-sm px-6 py-3 rounded hover:text-red-700 outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                      type="button"
                      onClick={() => setShowShareModal(false)}
                    >
                      <XCircle size={22} className={"icon"} />
                    </button>
                  </div>
                  {/*body*/}
                  <div className="relative p-6 flex-auto">
                    {<ShareScreen />}
                  </div>
                </div>
              </div>
            </div>
            <div className="opacity-25 fixed inset-0 z-40 bg-black"></div>
          </>
        ) : null}

        {isGameOver && !showGameOverModal ? (
          <div
            role="modal"
            className={` ${
              state.theme === "dark"
                ? darkTheme[0] + " " + darkTheme[1]
                : lightTheme[0] + " " + lightTheme[1]
            } absolute inset-x-0 bottom-0 p-10 text-center mx-auto rounded shadow-lg opacity-90`}
          >
            <div className="">
              <WordRow letters={state.answer} />
            </div>
            <h1 className="pt-4">Next word:</h1>
            <p>
              {hours}:{minutes}:{seconds}
            </p>
          </div>
        ) : null}

        {isGameOver && showGameOverModal ? (
          <>
            <div
              className={`justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none ${
                state.theme === "dark" ? darkTheme[1] : lightTheme[1]
              }`}
            >
              <div className="relative w-auto my-6 mx-auto max-w-3xl">
                {/*content*/}
                <div
                  className={`border-0 rounded-lg shadow-lg relative flex flex-col w-full outline-none focus:outline-none ${
                    state.theme === "dark" ? darkTheme[0] : lightTheme[0]
                  }`}
                >
                  {/*header*/}
                  <div className="flex items-start justify-between p-5 border-b border-solid border-slate-200 rounded-t">
                    <h3 className="text-3xl font-semibold">Game Over</h3>
                    <button
                      className="font-bold uppercase text-sm px-6 py-3 rounded hover:text-red-700 outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                      type="button"
                      onClick={() => setShowGameOverModal(false)}
                    >
                      <XCircle size={22} className={"icon"} />
                    </button>
                  </div>
                  {/*body*/}
                  <div className="relative p-6 flex-auto text-center">
                    <h2 className="text-xl">You {state.gameState}!</h2>
                    <h2>The word was:</h2>
                    <div>
                      <WordRow letters={state.answer} />
                    </div>
                    <h1 className="pt-4">Next word:</h1>
                    <p>
                      {hours}:{minutes}:{seconds}
                    </p>
                  </div>
                </div>
              </div>
            </div>
            <div className="opacity-25 fixed inset-0 z-40 bg-black"></div>
          </>
        ) : null}
      </div>
    </div>
  );

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

    const onKeyDown = useCallback((event: KeyboardEvent) => {
      let letter = event.key;
      addGuessLetter(letter);
    }, []);

    if (state.gameState !== "playing") {
      document.removeEventListener("keydown", onKeyDown);
    } else {
      document.addEventListener("keydown", onKeyDown);
    }

    return [guess, setGuess, addGuessLetter];
  }

  function usePrevious<T>(value: T) {
    const ref: any = useRef<T>();
    useEffect(() => {
      ref.current = value;
    }, [value]);
    return ref.current;
  }
}
