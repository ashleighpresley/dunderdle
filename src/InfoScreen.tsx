import { useState } from "react";
import { useStore } from "./store";
import WordRow from "./WordRow";
import theOfficeWordBank from "./the-office-word-bank.json";

export const InfoScreen = () => {
  const [buttonText, setButtonText] = useState("Click here for a hint");
  const today = new Date().toLocaleDateString("en-US") as string;
  let day =
    theOfficeWordBank[today as keyof typeof theOfficeWordBank][0]["hint"];
  function handleClick() {
    buttonText === "Click here for a hint"
      ? setButtonText(day)
      : setButtonText("Click here for a hint");
  }
  return (
    <div>
      <div className="text-sm pb-8 border-b my-4 leading-relaxed flex flex-col gap-2">
        <p>Guess the word in six tries!</p>
        <p>
          Each guess must be a valid five-letter word (keep in mind it could be
          a name!). Hit the enter button to submit.
        </p>
        <p>
          You can enter in any valid 5 letter word, but the answer will be
          something relating to the show <em>The Office</em>
        </p>
        <p>
          After each guess, the color of the tiles will change to show how close
          your guess was to the word.
        </p>
        <p>A new Dunderdle will be available each day.</p>
      </div>
      <div className="flex flex-col items-center">
        <div className="text-sm pb-8 border-b my-4 leading-relaxed flex flex-col gap-2 max-w-sm">
          <p className="font-bold">Examples</p>
          <WordRow letters={"jello"} result={[2]} />
          <p>
            The letter <strong>J</strong> is in the word and it's in the correct
            spot.
          </p>
          <WordRow letters={"fires"} result={[null!, 1]} />
          <p>
            The letter <strong>I</strong> is in the word but it's in the wrong
            spot.
          </p>
          <WordRow letters={"farms"} result={[null!, null!, null!, 0]} />
          <p>
            The letter <strong>M</strong> is not in the word in any spot.
          </p>
        </div>
      </div>
      <div className="text-sm pb-8 border-b my-4 leading-relaxed flex flex-col gap-2 text-center">
        <p className="font-bold">Need help with todays word?</p>
        <button
          className="block border-transparent	border-2 hover:border-gray-200 italic"
          id="hint-button"
          onClick={handleClick}
        >
          {buttonText}
        </button>
      </div>
      <div className="text-sm text-center">
        <p>
          Dunderdle is a{" "}
          <a href="https://www.nbc.com/the-office/about" target="_blank">
            <em>The Office</em>
          </a>{" "}
          themed Wordle game.
        </p>
        <p>
          Let me know what you think! Send feedback to{" "}
          <a href="https://twitter.com/ash92596" target="_blank">
            <u>ash92596</u>.
          </a>
        </p>
        <p>
          Join the{" "}
          <a href="https://www.facebook.com/groups/dunderdle" target="_blank">
            <u>Dunderdle Facebook group</u>
          </a>{" "}
          to post your results and discuss the word of the day!{" "}
        </p>
        <p>
          This game will be free and ad-free forever, but you can{" "}
          <a href="https://www.buymeacoffee.com/ashleighp" target="_blank">
            <u>buy me a coffee</u>
          </a>{" "}
          if you'd like!
        </p>
      </div>
    </div>
  );
};
