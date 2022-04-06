import wordBank from "./word-bank.json";

const word = getRandomWord();
console.log(word);

export function getRandomWord() {
  const randomIndex = Math.floor(Math.random() * wordBank.length);
  return wordBank[randomIndex];
}

export enum LetterState {
  Miss,
  Present,
  Match,
}

export function computeGuess(
  guess: string,
  answerString: string = word
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
