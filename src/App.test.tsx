import { describe, expect, it } from "vitest";
import App from "./App";
import { useStore } from "./store";
import { render, screen } from "./test/test-utils";

describe("Simple working test", () => {
  it("the title is visible", () => {
    render(<App />);
    expect(screen.getByText(/Wordle/i)).toBeInTheDocument();
  });
  it("shows empty state", () => {
    useStore.setState({ guesses: [] });
    render(<App />);
    expect(screen.queryByText("Game Over!")).not.toBeInTheDocument();
    expect(document.querySelectorAll("main div")).toHaveLength(6);
    expect(document.querySelectorAll("main div span")).toHaveLength(30);
    expect(document.querySelector("main")?.textContent).toEqual("");
  });
  it("shows one row of guesses", () => {
    useStore.setState({ guesses: ["hello"] });
    render(<App />);
    expect(screen.queryByText("Game Over!")).not.toBeInTheDocument();
    expect(document.querySelectorAll("main div")).toHaveLength(6);
    expect(document.querySelectorAll("main div span")).toHaveLength(30);
    expect(document.querySelector("main")?.textContent).toEqual("hello");
  });
  it("shows one row of guesses", () => {
    useStore.setState({
      guesses: ["hello"],
    });
    render(<App />);
    expect(screen.queryByText("Game Over!")).not.toBeInTheDocument();
    expect(document.querySelectorAll("main div")).toHaveLength(6);
    expect(document.querySelectorAll("main div span")).toHaveLength(30);
    expect(document.querySelector("main")?.textContent).toEqual("hello");
  });
  it("shows game over screen", () => {
    useStore.setState({
      guesses: Array(6).fill("hello"),
    });
    render(<App />);
    expect(screen.queryByText("Game Over!")).toBeInTheDocument();
    expect(document.querySelectorAll("main div")).toHaveLength(6);
    expect(document.querySelectorAll("main div span")).toHaveLength(30);
    expect(document.querySelector("main")?.textContent).toEqual(
      "hellohellohellohellohellohello"
    );
  });
  it("can start a new game", () => {
    useStore.setState({
      guesses: Array(6).fill("hello"),
    });
    render(<App />);
    expect(screen.queryByText("Game Over!")).toBeInTheDocument();
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
