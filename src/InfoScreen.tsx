import WordRow from "./WordRow";
import { LetterState } from "./word-utils";

export const InfoScreen = () => {
  return (
    <div>
      <div className="text-sm pb-8 border-b my-4 text-slate-500 leading-relaxed flex flex-col gap-2">
        <p>Guess the word in six tries.</p>
        <p>
          Each guess must be a valid five-letter word. Hit the enter button to
          submit.
        </p>
        <p>
          After each guess, the color of the tiles will change to show how close
          your guess was to the word.
        </p>
      </div>
      <div className="text-sm pb-8 border-b my-4 text-slate-500 leading-relaxed flex flex-col gap-2">
        <p className="font-bold text-black">Examples</p>
        <WordRow letters={"jello"} result={[2]} />
        <p>
          The letter <strong>J</strong> is in the word and it's in the correct
          spot.
        </p>
        <WordRow letters={"fires"} result={[3, 1]} />
        <p>
          The letter <strong>I</strong> is in the word but it's in the wrong
          spot.
        </p>
        <WordRow letters={"farms"} result={[3, 3, 3, 0]} />
        <p>
          The letter <strong>M</strong> is not in the word in any spot.
        </p>
      </div>
    </div>
  );
};