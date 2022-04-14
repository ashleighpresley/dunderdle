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
    expect(document.querySelectorAll("main div")).toHaveLength(6);
    expect(document.querySelectorAll("main div span")).toHaveLength(30);
    expect(document.querySelector("main")?.textContent).toEqual("");
  });
  it("shows one row of guesses", () => {
    useStore.getState().newGame(["hello"]);
    render(<App />);
    expect(document.querySelectorAll("main div")).toHaveLength(6);
    expect(document.querySelectorAll("main div span")).toHaveLength(30);
    expect(document.querySelector("main")?.textContent).toEqual("hello");
  });
});
