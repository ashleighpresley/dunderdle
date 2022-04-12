import { useStore } from "./store";

export const ShareScreen = () => {
  const state = useStore();
  return (
    <div className="text-center">
      <div id="wordle-share">
        <p>Wordle #1</p>
        {state.squares.map((item, i) => (
          <div key={item + i}> {item} </div>
        ))}
      </div>
      <p
        onClick={() =>
          navigator.clipboard.writeText(
            document.getElementById("wordle-share")?.innerText!
          )
        }
        className="text-sm cursor-pointer border-t mt-4"
      >
        Tap to Copy
      </p>
    </div>
  );
};
