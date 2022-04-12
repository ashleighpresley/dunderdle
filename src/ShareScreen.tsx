import { useStore } from "./store";

export const ShareScreen = () => {
  const state = useStore();
  return (
    <div className="text-center">
      <div id="wordle-share">
        <p>Wordle #1</p>
        {state.rows.map((row, i) => {
          return (
            <div key={i}>
              {row.result?.map((number) => {
                switch (number) {
                  case 1:
                    return "🟨";
                  case 0:
                    return "⬛";
                  case 2:
                    return "🟩";
                }
              })}
            </div>
          );
        })}
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
