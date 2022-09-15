import WordRow from "./WordRow";

export const InfoScreen = () => {
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
          to post your results and streaks!{" "}
        </p>
        <p>
          This game will be free but you can{" "}
          <a href="https://www.buymeacoffee.com/ashleighp" target="_blank">
            <u>buy me a coffee</u>
          </a>{" "}
          if you'd like!
        </p>
      </div>
    </div>
  );
};
