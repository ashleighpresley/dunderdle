import { useState } from "react";
import { useStore } from "./store";

export const HintScreen = () => {
  const [buttonText, setButtonText] = useState("Click here for a hint");
  const state = useStore();

  function handleClick() {
    buttonText === "Click here for a hint"
      ? setButtonText(state.hint)
      : setButtonText("Click here for a hint");
  }
  return (
    <div>
      <div className="text-sm pb-8 border-b my-4 leading-relaxed flex flex-col gap-2 text-center">
        <p className="font-bold">Need help with word #{state.num}?</p>
        <button
          className="block border-transparent border-2 hover:border-gray-200 italic"
          id="hint-button"
          onClick={handleClick}
        >
          {buttonText}
        </button>
      </div>
    </div>
  );
};
