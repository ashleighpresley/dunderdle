import { describe, expect, it } from "vitest";
import { getRandomWord } from "./word-utils";

describe("word-utils", () => {
  it("random word", () => {
    expect(getRandomWord()).toBeTruthy();
    expect(getRandomWord()).toHaveLength(5);
  });
});
