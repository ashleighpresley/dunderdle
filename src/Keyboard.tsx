import React from "react";
import { useStore } from "./store";
import { LetterState } from "./word-utils";

export default function Keyboard({
  onClick: onClickProp,
}: {
  onClick: (letter: string) => void;
}) {
  const keyboardLetterState = useStore((s) => s.keyboardLetterState);
  const colorBlindMode = useStore((s) => s.colorBlindMode);
  const styles = colorBlindMode ? colorBlindKeyStateStyles : keyStateStyles;

  const onClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    const letter = e.currentTarget.textContent;
    onClickProp(letter!);
  };

  return (
    <div className="flex flex-col">
      {keyboardKeys.map((keyboardRow, rowIndex) => {
        return (
          <div
            key={rowIndex}
            className="flex justify-center my-1 space-x-1.5 px-1"
          >
            {keyboardRow.map((key, index) => {
              let keyStyles = "rounded font-bold uppercase py-4 px-2 flex-1";
              const letterState = styles[keyboardLetterState[key]];

              if (key === "") {
                keyStyles += " pointer-events-none";
              }

              if (letterState) {
                keyStyles += " text-white " + letterState;
              } else if (key !== "") {
                keyStyles += " bg-gray-300";
              } else if (key === "") {
                keyStyles += " px-0";
              }

              return (
                <button key={index} className={keyStyles} onClick={onClick}>
                  {key}
                </button>
              );
            })}
          </div>
        );
      })}
    </div>
  );
}

const keyboardKeys = [
  ["q", "w", "e", "r", "t", "y", "u", "i", "o", "p"],
  ["", "a", "s", "d", "f", "g", "h", "j", "k", "l", ""],
  ["<-", "z", "x", "c", "v", "b", "n", "m", "Enter"],
];

const keyStateStyles = {
  [LetterState.Miss]: "bg-zinc-400",
  [LetterState.Present]: "bg-yellow-400",
  [LetterState.Match]: "bg-emerald-500",
  [LetterState.Unfilled]: "",
};

// High contrast colors for color blind users
const colorBlindKeyStateStyles = {
  [LetterState.Miss]: "bg-zinc-500",
  [LetterState.Present]: "bg-orange-500",
  [LetterState.Match]: "bg-blue-600",
  [LetterState.Unfilled]: "",
};
