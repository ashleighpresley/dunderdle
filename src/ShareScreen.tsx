import { useStore } from "./store";
import theOfficeWordBank from "./the-office-word-bank.json";

export const ShareScreen = () => {
  const state = useStore();
  function copyToClipboard() {
    navigator.clipboard.writeText(
      document.getElementById("wordle-share")?.innerText!
    );
    alert("Copied to clipboard!");
  }
  const today = new Date().toLocaleDateString("en-US") as string;
  let day =
    theOfficeWordBank[today as keyof typeof theOfficeWordBank][0]["day"];
  return (
    <div className="text-center">
      <div id="wordle-share">
        <p>Wordle #{day}</p>
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
        onClick={() => copyToClipboard()}
        className="text-sm cursor-pointer border-t mt-4"
      >
        Tap to Copy
      </p>
    </div>
  );
};
