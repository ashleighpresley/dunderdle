import { useStore } from "./store";

export const ShareScreen = () => {
  const state = useStore();
  function copyToClipboard() {
    navigator.clipboard
      .writeText(document.getElementById("dunderdle-share")?.innerText!)
      .then(() => {
        alert("Copied to clipboard!");
      })
      .catch(() => {
        alert("Something went wrong.");
      });
  }

  return (
    <div className="text-center">
      <div id="dunderdle-share">
        <p>Dunderdle #{state.num}</p>
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
