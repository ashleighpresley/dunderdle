import React, { useCallback, useEffect, useRef, useState } from "react";
import Keyboard from "./Keyboard";
import { useStore, GUESS_LENGTH } from "./store";
import { isValidWord, LETTER_LENGTH } from "./word-utils";
import WordRow from "./WordRow";
import { Info, ChartLine, Share, Star, XCircle } from "phosphor-react";
import { StatsChart } from "./StatsChart";
import { StatsScreen } from "./StatsScreen";
import { InfoScreen } from "./InfoScreen";
import { ShareScreen } from "./ShareScreen";
import { HintScreen } from "./HintScreen";
import Confetti from "react-confetti";

export default function App() {
  const state = useStore();
  const [guess, setGuess, addGuessLetter] = useGuess();
  const addGuess = useStore((s) => s.addGuess);
  const previousGuess = usePrevious(guess);
  const [showInvalidGuess, setInvalidGuess] = useState(false);
  const [showStatsModal, setShowStatsModal] = React.useState(false);
  const [showInfoModal, setShowInfoModal] = React.useState(false);
  const [showShareModal, setShowShareModal] = React.useState(false);
  const [showHintModal, setShowHintModal] = React.useState(false);
  const [hideDundie, setHideDundie] = useState(false);

  if (isNaN(state.winRate) && state.losses <= 0 && state.wins <= 0) {
    state.winRate = 0;
  }

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
        <header className="border-b border-gray-300 pb-2 px-2 my-2 flex flex-col-5 gap-5 justify-center items-center">
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
          <h1 className="text-4xl text-center tracking-tight">Dunderdle</h1>
          <Share
            size={22}
            onClick={() => {
              setShowShareModal(true);
            }}
            className="cursor-pointer icon"
          />
          <Star
            size={22}
            onClick={() => {
              setShowHintModal(true);
            }}
            className="cursor-pointer icon"
          />
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
              className={`justify-center items-center overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none ${
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
                  <button
                    className="play-again-btn block border rounded border-emerald-500 bg-emerald-500 p-1 mb-4 mx-auto shadow text-white hover:shadow-lg"
                    onClick={() => {
                      let confirmAction = confirm(
                        "Are you sure you want to reset your stats?"
                      );
                      if (confirmAction) {
                        localStorage.removeItem("dunderdle"),
                          window.location.reload();
                      } else {
                      }
                    }}
                  >
                    Reset Stats
                  </button>
                </div>
              </div>
            </div>
            <div className="opacity-25 fixed inset-0 z-40 bg-black"></div>
          </>
        ) : null}

        {showInfoModal ? (
          <>
            <div
              className={`justify-center items-center overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none ${
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

        {showHintModal ? (
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
                    <h3 className="text-3xl font-semibold">Hint</h3>
                    <button
                      className="font-bold uppercase text-sm px-6 py-3 rounded hover:text-red-700 outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                      type="button"
                      onClick={() => setShowHintModal(false)}
                    >
                      <XCircle size={22} className={"icon"} />
                    </button>
                  </div>
                  {/*body*/}
                  <div className="relative p-6 flex-auto">{<HintScreen />}</div>
                  <div className="flex items-start justify-between px-5 gap-8">
                    <button
                      className="play-again-btn block border rounded border-emerald-500 bg-emerald-500 p-2 mb-4 mx-auto shadow text-white hover:shadow-lg"
                      id="game-mode"
                      onClick={() => {
                        state.theme === "light"
                          ? ((state.theme = "dark"), setShowHintModal(false))
                          : ((state.theme = "light"), setShowHintModal(false));
                      }}
                    >
                      Switch to{" "}
                      {state.theme === "light" ? "Dark Mode" : "Light Mode"}
                    </button>
                    <button
                      className="play-again-btn block border rounded border-emerald-500 bg-emerald-500 p-2 mb-4 mx-auto shadow text-white hover:shadow-lg"
                      onClick={() => {
                        state.newGame();
                        setGuess("");
                        setShowHintModal(false);
                      }}
                    >
                      New Game
                    </button>
                  </div>
                </div>
              </div>
            </div>
            <div className="opacity-25 fixed inset-0 z-40 bg-black"></div>
          </>
        ) : null}

        {isGameOver ? (
          <div>
            <div
              role="modal"
              className={`absolute inset-x-9 top-14 transition-all duration-1000 opacity-1 ${
                hideDundie ? "opacity-0" : "opacity-100"
              }`}
            >
              {state.gameState === "won"
                ? (setTimeout(function () {
                    setHideDundie(true);
                  }, 6000),
                  (
                    <div className="p-12">
                      <img src="https://bucketdrum.s3.amazonaws.com/wonDundie.png" />
                      <Confetti width={300} height={400} />
                    </div>
                  ))
                : null}
            </div>
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
          </div>
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
          case "backspace":
          case "<-":
            return newGuess.slice(0, -1);
          case "Enter":
          case "enter":
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
      letter = letter.toLowerCase();
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
