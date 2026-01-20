import React, { useCallback, useEffect, useRef, useState } from "react";
import Keyboard from "./Keyboard";
import { useStore, GUESS_LENGTH } from "./store";
import { isValidWord, LETTER_LENGTH, checkHardMode } from "./word-utils";
import WordRow from "./WordRow";
import { Info, ChartLine, Share, Moon, Sun, XCircle, Gear } from "@phosphor-icons/react";
import { StatsChart } from "./StatsChart";
import { StatsScreen } from "./StatsScreen";
import { InfoScreen } from "./InfoScreen";
import { ShareScreen } from "./ShareScreen";
import theOfficeWordBank from "./the-office-word-bank.json";
import Confetti from "react-confetti";

export default function App() {
  const state = useStore();
  const [guess, setGuess, addGuessLetter] = useGuess();
  const addGuess = useStore((s) => s.addGuess);
  const setTheme = useStore((s) => s.setTheme);
  const hardMode = useStore((s) => s.hardMode);
  const setHardMode = useStore((s) => s.setHardMode);
  const colorBlindMode = useStore((s) => s.colorBlindMode);
  const setColorBlindMode = useStore((s) => s.setColorBlindMode);
  const previousGuess = usePrevious(guess);
  const [showInvalidGuess, setInvalidGuess] = useState(false);
  const [hardModeError, setHardModeError] = useState<string | null>(null);
  const [showStatsModal, setShowStatsModal] = useState(false);
  const [showPopupModal, setShowPopupModal] = useState(true);
  const [showInfoModal, setShowInfoModal] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);
  const [showSettingsModal, setShowSettingsModal] = useState(false);
  const [showWinAnimation, setShowWinAnimation] = useState(false);
  const [dundieVisible, setDundieVisible] = useState(false);
  const [hours, setHours] = useState(10);
  const [minutes, setMinutes] = useState(10);
  const [seconds, setSeconds] = useState(10);
  const [isLoading, setIsLoading] = useState(true);

  const today = new Date().toLocaleDateString("en-US") as string;
  let word =
    theOfficeWordBank[today as keyof typeof theOfficeWordBank][0]["word"];

  if (state.answer != word) {
    state.newGame();
    setGuess("");
  }

  if (isNaN(state.winRate) && state.losses <= 0 && state.wins <= 0) {
    state.winRate = 0;
  }

  useEffect(() => {
    const nextWordCountdown = () => {
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
    const intervalId = setInterval(nextWordCountdown, 1000);
    return () => clearInterval(intervalId);
  }, []);

  useEffect(() => {
    let id: NodeJS.Timeout;
    if (showInvalidGuess) {
      id = setTimeout(() => setInvalidGuess(false), 1500);
    }
    return () => clearTimeout(id);
  }, [showInvalidGuess]);

  // Close modals on Escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setShowStatsModal(false);
        setShowInfoModal(false);
        setShowShareModal(false);
        setShowSettingsModal(false);
      }
    };
    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, []);

  // Handle win animation timing
  useEffect(() => {
    if (state.gameState === "won") {
      // Small delay before showing animation for smoother feel
      const showTimer = setTimeout(() => {
        setShowWinAnimation(true);
        setDundieVisible(true);
      }, 300);

      // Hide the dundie after 6 seconds
      const hideTimer = setTimeout(() => {
        setDundieVisible(false);
      }, 6300);

      return () => {
        clearTimeout(showTimer);
        clearTimeout(hideTimer);
      };
    } else {
      setShowWinAnimation(false);
      setDundieVisible(false);
    }
  }, [state.gameState]);

  useEffect(() => {
    if (guess.length === 0 && previousGuess?.length === LETTER_LENGTH) {
      if (!isValidWord(previousGuess)) {
        setInvalidGuess(true);
        setHardModeError(null);
        setGuess(previousGuess);
        return;
      }

      // Check hard mode constraints
      if (hardMode && state.rows.length > 0) {
        const violation = checkHardMode(previousGuess, state.rows);
        if (violation) {
          const errorMsg = violation.type === "mustBeAt"
            ? `${violation.letter} must be in position ${violation.position}`
            : `Guess must contain ${violation.letter}`;
          setHardModeError(errorMsg);
          setInvalidGuess(true);
          setGuess(previousGuess);
          return;
        }
      }

      addGuess(previousGuess);
      setInvalidGuess(false);
      setHardModeError(null);
    }
  }, [guess, hardMode, state.rows]);

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

  // Apply theme to document
  useEffect(() => {
    if (state.theme === "dark") {
      document.body.classList.add("bg-slate-600");
      document.body.classList.remove("bg-white");
    } else {
      document.body.classList.remove("bg-slate-600");
      document.body.classList.add("bg-white");
    }
  }, [state.theme]);

  return (
    <div>
      <div className="mx-auto w-96 relative">
        <header className="border-b border-gray-300 pb-2 px-2 my-2 flex flex-col-5 gap-5 justify-center items-center">
          <button
            onClick={() => setShowInfoModal(true)}
            aria-label="How to play"
            className={`cursor-pointer transition-colors hover:opacity-70 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 rounded ${state.theme === "dark" ? "text-white" : "text-black"}`}
          >
            <Info size={22} />
          </button>
          <button
            onClick={() => setShowStatsModal(true)}
            aria-label="View statistics"
            className={`cursor-pointer transition-colors hover:opacity-70 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 rounded ${state.theme === "dark" ? "text-white" : "text-black"}`}
          >
            <ChartLine size={22} />
          </button>
          <h1 className={`text-4xl text-center tracking-tight transition-colors ${state.theme === "dark" ? "text-white" : "text-black"}`}>Dunderdle</h1>
          <button
            onClick={() => setShowShareModal(true)}
            aria-label="Share results"
            className={`cursor-pointer transition-colors hover:opacity-70 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 rounded ${state.theme === "dark" ? "text-white" : "text-black"}`}
          >
            <Share size={22} />
          </button>
          <button
            onClick={() => setShowSettingsModal(true)}
            aria-label="Settings"
            className={`cursor-pointer transition-colors hover:opacity-70 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 rounded ${state.theme === "dark" ? "text-white" : "text-black"}`}
          >
            <Gear size={22} />
          </button>
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
                      <XCircle size={22} />
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
                      <XCircle size={22} />
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
                      <XCircle size={22} />
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

        {showSettingsModal ? (
          <>
            <div
              className={`justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none ${
                state.theme === "dark" ? darkTheme[1] : lightTheme[1]
              }`}
            >
              <div className="relative w-auto my-6 mx-auto max-w-sm">
                <div
                  className={`border-0 rounded-lg shadow-lg relative flex flex-col w-full outline-none focus:outline-none ${
                    state.theme === "dark" ? darkTheme[0] : lightTheme[0]
                  }`}
                >
                  <div className="flex items-start justify-between p-5 border-b border-solid border-slate-200 rounded-t">
                    <h3 className="text-3xl font-semibold">Settings</h3>
                    <button
                      className="font-bold uppercase text-sm px-6 py-3 rounded hover:text-red-700 outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                      type="button"
                      onClick={() => setShowSettingsModal(false)}
                    >
                      <XCircle size={22} />
                    </button>
                  </div>
                  <div className="relative p-6 flex-auto">
                    <div className="flex flex-col gap-4">
                      {/* Theme Toggle */}
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          {state.theme === "light" ? <Moon size={20} /> : <Sun size={20} />}
                          <span>Dark Mode</span>
                        </div>
                        <button
                          onClick={() => setTheme(state.theme === "light" ? "dark" : "light")}
                          className={`relative w-12 h-6 rounded-full transition-colors ${
                            state.theme === "dark" ? "bg-green-500" : "bg-gray-300"
                          }`}
                          aria-label="Toggle dark mode"
                        >
                          <span
                            className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-transform ${
                              state.theme === "dark" ? "translate-x-7" : "translate-x-1"
                            }`}
                          />
                        </button>
                      </div>

                      {/* Hard Mode Toggle */}
                      <div className="flex items-center justify-between">
                        <div>
                          <span className="font-medium">Hard Mode</span>
                          <p className="text-xs text-gray-500">Revealed hints must be used in subsequent guesses</p>
                        </div>
                        <button
                          onClick={() => setHardMode(!hardMode)}
                          disabled={state.rows.length > 0 && !hardMode}
                          className={`relative w-12 h-6 rounded-full transition-colors ${
                            hardMode ? "bg-green-500" : "bg-gray-300"
                          } ${state.rows.length > 0 && !hardMode ? "opacity-50 cursor-not-allowed" : ""}`}
                          aria-label="Toggle hard mode"
                        >
                          <span
                            className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-transform ${
                              hardMode ? "translate-x-7" : "translate-x-1"
                            }`}
                          />
                        </button>
                      </div>
                      {state.rows.length > 0 && !hardMode && (
                        <p className="text-xs text-orange-600">Hard mode can only be enabled at the start of a game</p>
                      )}

                      {/* Color Blind Mode Toggle */}
                      <div className="flex items-center justify-between">
                        <div>
                          <span className="font-medium">Color Blind Mode</span>
                          <p className="text-xs text-gray-500">Use high contrast colors</p>
                        </div>
                        <button
                          onClick={() => setColorBlindMode(!colorBlindMode)}
                          className={`relative w-12 h-6 rounded-full transition-colors ${
                            colorBlindMode ? "bg-green-500" : "bg-gray-300"
                          }`}
                          aria-label="Toggle color blind mode"
                        >
                          <span
                            className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-transform ${
                              colorBlindMode ? "translate-x-7" : "translate-x-1"
                            }`}
                          />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="opacity-25 fixed inset-0 z-40 bg-black"></div>
          </>
        ) : null}

        {/* Hard mode error message */}
        {hardModeError && showInvalidGuess && (
          <div className="fixed top-20 left-1/2 transform -translate-x-1/2 bg-red-500 text-white px-4 py-2 rounded-lg shadow-lg z-50 animate-bounce">
            {hardModeError}
          </div>
        )}

        {isGameOver && (
          <div>
            {/* Win celebration animation */}
            {state.gameState === "won" && showWinAnimation && (
              <div
                className={`absolute inset-x-9 top-14 z-10 transition-all duration-700 ease-out ${
                  dundieVisible
                    ? "opacity-100 scale-100 translate-y-0"
                    : "opacity-0 scale-75 -translate-y-4"
                }`}
              >
                <div className="p-12">
                  <img
                    src="https://bucketdrum.s3.amazonaws.com/wonDundie.png"
                    alt="Dundie Award"
                    className="drop-shadow-lg"
                  />
                </div>
              </div>
            )}

            {/* Confetti - render separately for better performance */}
            {state.gameState === "won" && dundieVisible && (
              <div className="fixed inset-0 pointer-events-none z-20">
                <Confetti
                  width={window.innerWidth}
                  height={window.innerHeight}
                  recycle={false}
                  numberOfPieces={200}
                  gravity={0.3}
                />
              </div>
            )}

            {/* Game over panel */}
            <div
              className={`${
                state.theme === "dark"
                  ? darkTheme[0] + " " + darkTheme[1]
                  : lightTheme[0] + " " + lightTheme[1]
              } absolute inset-x-0 bottom-0 p-10 text-center mx-auto rounded-t-lg shadow-lg
                transition-all duration-500 ease-out
                ${isGameOver ? "translate-y-0 opacity-95" : "translate-y-full opacity-0"}`}
            >
              <div>
                <WordRow letters={state.answer} />
              </div>
              <h1 className="pt-4 font-medium">Next word:</h1>
              <p className="text-lg tabular-nums">
                {hours < 0 || minutes < 0 || seconds < 0
                  ? "Come Back Tomorrow!"
                  : `${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`}
              </p>
            </div>
          </div>
        )}
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
