import wordBank from "./word-bank.json";

import theOfficeWordBank from "./the-office-word-bank.json";

export const LETTER_LENGTH = 5;

let randomIndexInit = "";

let last_key = parseInt(
  Object.keys(theOfficeWordBank)[Object.values(theOfficeWordBank).length - 1]
);

function randomIndex() {
  const randomIndex = Math.floor(Math.random() * last_key).toString();
  randomIndexInit = randomIndex;

  return randomIndex;
}

//Office Wordle Version
export function getRandomWord() {
  return theOfficeWordBank[randomIndex() as keyof typeof theOfficeWordBank][0][
    "word"
  ];
}

export function getHint() {
  return theOfficeWordBank[
    randomIndexInit as keyof typeof theOfficeWordBank
  ][0]["hint"];
}

export function getNumber() {
  return randomIndexInit;
}

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

  if (guess.length !== answerString.length) {
    return result;
  }

  const answer = answerString.split("");

  const guessAsArray = guess.split("");

  const answerLetterCount: Record<string, number> = {};

  guessAsArray.forEach((letter, index) => {
    const currentAnswerLetter = answer[index];

    answerLetterCount[currentAnswerLetter] = answerLetterCount[
      currentAnswerLetter
    ]
      ? answerLetterCount[currentAnswerLetter] + 1
      : 1;

    if (currentAnswerLetter === letter) {
      result.push(LetterState.Match);
    } else if (answer.includes(letter)) {
      result.push(LetterState.Present);
    } else {
      result.push(LetterState.Miss);
    }
  });

  result.forEach((curResult, resultIndex) => {
    if (curResult !== LetterState.Present) {
      return;
    }

    const guessLetter = guessAsArray[resultIndex];

    answer.forEach((currentAnswerLetter, answerIndex) => {
      if (currentAnswerLetter !== guessLetter) {
        return;
      }

      if (result[answerIndex] === LetterState.Match) {
        result[resultIndex] = LetterState.Miss;
      }

      if (answerLetterCount[guessLetter] <= 0) {
        result[resultIndex] = LetterState.Miss;
      }
    });

    answerLetterCount[guessLetter]--;
  });

  return result;
}

export function isValidWord(word: string): boolean {
  return (
    wordBank.includes(word) ||
    JSON.stringify(theOfficeWordBank).indexOf(word) > -1
  );
}
