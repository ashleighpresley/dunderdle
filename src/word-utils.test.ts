import { describe, expect, it } from "vitest";
import {
  computeGuess,
  getOfficeWord,
  isValidWord,
  LetterState,
} from "./word-utils";

describe("isValidWord", () => {
  it("works with a valid word", () => {
    expect(isValidWord("basic")).toBeTruthy();
  });
  it("works with an invalid word", () => {
    expect(isValidWord("zzzzz")).toBeFalsy();
  });
});
describe("getOfficeWord", () => {
  it("gets an office themed word", () => {
    expect(getOfficeWord()).toBeTruthy();
    expect(getOfficeWord()).toHaveLength(5);
  });
});

describe("computeGuess", () => {
  it("returns an empty array when given incomplete guess", () => {
    expect(computeGuess("so", "basic")).toEqual([]);
  });
  it("displays miss, present, and match", () => {
    expect(computeGuess("boost", "basic")).toEqual([
      LetterState.Match,
      LetterState.Miss,
      LetterState.Miss,
      LetterState.Present,
      LetterState.Miss,
    ]);
  });
  it("works with all misses", () => {
    expect(computeGuess("jumps", "click")).toEqual([
      LetterState.Miss,
      LetterState.Miss,
      LetterState.Miss,
      LetterState.Miss,
      LetterState.Miss,
    ]);
  });
  it("works with all present", () => {
    expect(computeGuess("slope", "poles")).toEqual([
      LetterState.Present,
      LetterState.Present,
      LetterState.Present,
      LetterState.Present,
      LetterState.Present,
    ]);
  });
  it("works with all matches", () => {
    expect(computeGuess("hello", "hello")).toEqual([
      LetterState.Match,
      LetterState.Match,
      LetterState.Match,
      LetterState.Match,
      LetterState.Match,
    ]);
  });
  it("only shows one match when two letters are present", () => {
    expect(computeGuess("solid", "boost")).toEqual([
      LetterState.Present,
      LetterState.Match,
      LetterState.Miss,
      LetterState.Miss,
      LetterState.Miss,
    ]);
  });
  it("only shows one present when letter is guessed multiple times", () => {
    expect(computeGuess("alloy", "linux")).toEqual([
      LetterState.Miss,
      LetterState.Present,
      LetterState.Miss,
      LetterState.Miss,
      LetterState.Miss,
    ]);
  });
  it("shows unmatched letter instance as miss when letter is guessed multiple times and matched/present only once", () => {
    expect(computeGuess("there", "arise")).toEqual([
      LetterState.Miss,
      LetterState.Miss,
      LetterState.Miss,
      LetterState.Present,
      LetterState.Match,
    ]);
  });
});
