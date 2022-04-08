import React from "react";
import { useStore } from "./store";
import { LetterState } from "./word-utils";

export default function Keyboard({
  onClick: onClickProp,
}: {
  onClick: (letter: string) => void;
}) {
  const keyboardLetterState = useStore((s) => s.keyboardLetterState);
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
              let styles = "rounded font-bold uppercase py-4 px-2 flex-1";
              const letterState = keyStateStyles[keyboardLetterState[key]];

              if (key === "") {
                styles += " pointer-events-none";
              }

              if (letterState) {
                styles += " text-white " + letterState;
              } else if (key !== "") {
                styles += " bg-gray-300";
              } else if (key === "") {
                styles += " px-0";
              }

              return (
                <button key={index} className={styles} onClick={onClick}>
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
  ["Enter", "z", "x", "c", "v", "b", "n", "m", "Back"],
];

const keyStateStyles = {
  [LetterState.Miss]: "bg-zinc-400",
  [LetterState.Present]: "bg-yellow-400",
  [LetterState.Match]: "bg-emerald-500",
};
