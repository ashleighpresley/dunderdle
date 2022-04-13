import { describe, expect, it } from "vitest";
import App from "./App";
import { useStore } from "./store";
import { render, screen } from "./test/test-utils";

describe("Simple working test", () => {
  it("the title is visible", () => {
    render(<App />);
    expect(screen.getByText(/Dunderdle/i)).toBeInTheDocument();
  });
  it("shows empty state", () => {
    useStore.getState().newGame([]);
    render(<App />);
    expect(screen.queryByText("New Game")).not.toBeInTheDocument();
    expect(document.querySelectorAll("main div")).toHaveLength(6);
    expect(document.querySelectorAll("main div span")).toHaveLength(30);
    expect(document.querySelector("main")?.textContent).toEqual("");
  });
  it("shows one row of guesses", () => {
    useStore.getState().newGame(["hello"]);
    render(<App />);
    expect(screen.queryByText("New Game")).not.toBeInTheDocument();
    expect(document.querySelectorAll("main div")).toHaveLength(6);
    expect(document.querySelectorAll("main div span")).toHaveLength(30);
    expect(document.querySelector("main")?.textContent).toEqual("hello");
  });
  it("shows one row of guesses", () => {
    useStore.getState().newGame(["hello"]);
    render(<App />);
    expect(screen.queryByText("New Game")).not.toBeInTheDocument();
    expect(document.querySelectorAll("main div")).toHaveLength(6);
    expect(document.querySelectorAll("main div span")).toHaveLength(30);
    expect(document.querySelector("main")?.textContent).toEqual("hello");
  });
  it("shows new game button when used up all of guess opportunities", () => {
    useStore.getState().newGame(Array(6).fill("hello"));

    render(<App />);
    expect(screen.queryByText("New Game")).toBeInTheDocument();
    expect(document.querySelectorAll("main div")).toHaveLength(6);
    expect(document.querySelectorAll("main div span")).toHaveLength(30);
    expect(document.querySelector("main")?.textContent).toEqual(
      "hellohellohellohellohellohello"
    );
  });
  it("shows 'You won!' when correct answer is guessed", () => {
    useStore.getState().newGame(Array(2).fill("hello"));
    const answer = useStore.getState().answer;
    useStore.getState().addGuess(answer);
    render(<App />);

    expect(screen.queryByText("You won!")).toBeInTheDocument();
  });
  it("shows 'You lost!' when correct answer is not guessed and all guess opportunities have been used", () => {
    useStore.getState().newGame(Array(6).fill("zzzzz"));
    render(<App />);

    expect(screen.queryByText("You lost!")).toBeInTheDocument();
  });
  it("can start a new game", () => {
    useStore.getState().newGame(Array(6).fill("hello"));
    render(<App />);
    expect(screen.queryByText("New Game")).toBeInTheDocument();
    expect(document.querySelector("main")?.textContent).toEqual(
      "hellohellohellohellohellohello"
    );
    const playAgainBtn: HTMLElement = document.getElementsByClassName(
      "play-again-btn"
    )[0] as HTMLElement;
    playAgainBtn.click();
    expect(document.querySelectorAll("main div")).toHaveLength(6);
    expect(document.querySelectorAll("main div span")).toHaveLength(30);
    expect(document.querySelector("main")?.textContent).toEqual("");
  });
});
