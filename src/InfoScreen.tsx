import { useState } from "react";
import WordRow from "./WordRow";
import theOfficeWordBank from "./the-office-word-bank.json";
import escapeRoomImg from "./images/office-escape-room.png";

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
          <a href="https://twitter.com/OfficeMemes_" target="_blank">
            <u>OfficeMemes_</u>.
          </a>
        </p>
      </div>

      <div className="mt-6 p-4 bg-gradient-to-r from-purple-100 to-indigo-100 rounded-xl border border-purple-200">
        <p className="font-bold text-center text-purple-800 mb-2">Liked the game?</p>
        <p className="text-sm text-center text-gray-700 mb-3">
          Check out our printable <em>The Office</em> themed escape room on Etsy!
        </p>
        <a
          href="https://threedotdesignsco.etsy.com/listing/1267036037/escape-the-office-pdf-game-escape-room"
          target="_blank"
          className="block"
        >
          <img
            src={escapeRoomImg}
            alt="The Office Escape Room"
            className="rounded-lg shadow-md hover:shadow-xl hover:scale-105 transition-all duration-300 mx-auto w-48"
          />
        </a>
        <a
          href="https://threedotdesignsco.etsy.com/listing/1267036037/escape-the-office-pdf-game-escape-room"
          target="_blank"
          className="block mt-3 text-center text-sm font-medium text-purple-700 hover:text-purple-900 underline"
        >
          Shop ThreeDotDesignsCo
        </a>
      </div>
    </div>
  );
};
