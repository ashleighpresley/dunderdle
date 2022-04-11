import { LetterState, LETTER_LENGTH } from "./word-utils";

interface WordRowProps {
  letters: string;
  result?: LetterState[];
  className?: string;
}

export default function WordRow({
  letters: lettersProp = "",
  result = [],
  className = "",
}: WordRowProps) {
  const lettersRemaining = LETTER_LENGTH - lettersProp.length;
  const letters = lettersProp
    .split("")
    .concat(Array(lettersRemaining).fill(""));

  return (
    <div className={`grid grid-cols-5 gap-1.5 ${className}`}>
      {letters.map((char, index) => (
        <CharacterBox key={index} value={char} state={result[index]} />
      ))}
    </div>
  );
}

interface CharacterBoxProps {
  value: string;
  state?: LetterState;
}

function CharacterBox({ value, state }: CharacterBoxProps) {
  const stateStyles =
    state == null
      ? "border-gray-300 text-black"
      : `${characterStateStyles[state]} text-white`;

  return (
    <span
      className={`inline-block border-2 py-3
      before:inline-block before:content-[' ']
      uppercase font-bold text-center text-2xl ${stateStyles}`}
    >
      {value}
    </span>
  );
}

const characterStateStyles = {
  [LetterState.Miss]: "bg-zinc-400 border-zinc-400",
  [LetterState.Present]: "bg-yellow-400 border-yellow-400",
  [LetterState.Match]: "bg-emerald-500 border-emerald-500",
  [LetterState.Unfilled]: "bg-white border-gray-300 text-black",
};
