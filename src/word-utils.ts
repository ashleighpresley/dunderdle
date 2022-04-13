import wordBank from "./word-bank.json";

import officeWordBank from "./office-word-bank.json";

import theOfficeWordBank from "./the-office-word-bank.json";

export const LETTER_LENGTH = 5;

// Office Wordle Version
// export function getRandomWord() {
//   const randomIndex = Math.floor(Math.random() * officeWordBank.length);
//   return officeWordBank[randomIndex];
// }

export function getOfficeWord() {
  const today = new Date().toLocaleDateString("en-US") as string;
  let word =
    theOfficeWordBank[today as keyof typeof theOfficeWordBank][0]["word"];
  return word;
}
// Normal Wordle Version
// export function getRandomWord() {
//   const randomIndex = Math.floor(Math.random() * wordBank.length);
//   return wordBank[randomIndex];
// }

export enum LetterState {
  Miss,
  Present,
  Match,
  Unfilled,
}

export function computeGuess(
  guess: string,
  answerString: string
): LetterState[] {
  const result: LetterState[] = [];

  const guessedLetters = new Array();

  if (guess.length !== answerString.length) {
    return result;
  }

  const guessArray = guess.split("").reverse();
  const answerArray = answerString.split("").reverse();

  guessArray.forEach((letter, index) => {
    if (letter === answerArray[index]) {
      guessedLetters.push(letter);

      result.push(LetterState.Match);
    } else if (
      answerArray.includes(letter) &&
      !guessedLetters.includes(letter)
    ) {
      guessedLetters.push(letter);
      result.push(LetterState.Present);
    } else {
      guessedLetters.push(letter);
      result.push(LetterState.Miss);
    }
  });

  return result.reverse();
}

export function isValidWord(word: string): boolean {
  // return wordBank.includes(word);
  return wordBank.includes(word) || officeWordBank.includes(word);
}
