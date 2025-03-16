import { ref, computed, onMounted, onUnmounted } from 'vue';

export interface Guess {
  word: string;
  colors: string[];
}

const WORD_LENGTH = 5;
const MAX_ATTEMPTS = 6;

// Fetch a random 5-letter word from the API.
async function fetchRandomWord(): Promise<string> {
  try {
    const response = await fetch('https://random-word-api.herokuapp.com/word?length=5');
    const data = await response.json();
    if (Array.isArray(data) && data.length > 0) {
      return data[0].toUpperCase();
    }
  } catch (error) {
    console.error('Error fetching random word:', error);
  }
  // Fallback in case of error
  return 'APPLE';
}

// Compute feedback colors for each letter in the guess.
export function computeColors(guess: string, answer: string): string[] {
  const colors: string[] = new Array(guess.length).fill('absent');
  const answerLetterCount = new Map<string, number>();

  // Count letters in the answer
  for (const letter of answer) {
    answerLetterCount.set(letter, (answerLetterCount.get(letter) || 0) + 1);
  }

  // First pass: mark correct positions (green)
  for (let i = 0; i < guess.length; i++) {
    if (guess[i] === answer[i]) {
      colors[i] = 'correct';
      answerLetterCount.set(guess[i], answerLetterCount.get(guess[i])! - 1);
    }
  }

  // Second pass: mark present letters (yellow)
  for (let i = 0; i < guess.length; i++) {
    if (colors[i] === 'correct') continue;
    if (answerLetterCount.get(guess[i]) && answerLetterCount.get(guess[i])! > 0) {
      colors[i] = 'present';
      answerLetterCount.set(guess[i], answerLetterCount.get(guess[i])! - 1);
    }
  }

  return colors;
}

export function useWordle() {
  const secretWord = ref<string>('');
  const guesses = ref<Guess[]>([]);
  const currentGuess = ref<string>('');

  const isWin = computed(() => {
    return guesses.value.some((guess) => guess.word === secretWord.value);
  });

  // Game over if maximum attempts reached or win
  const isGameOver = computed(() => {
    return guesses.value.length >= MAX_ATTEMPTS || isWin.value;
  });

  const checkGuess = () => {
    if (currentGuess.value.length !== WORD_LENGTH) return;
    const guessUpper = currentGuess.value.toUpperCase();
    guesses.value.push({
      word: guessUpper,
      colors: computeColors(guessUpper, secretWord.value),
    });
    currentGuess.value = '';
  };

  const restartGame = async () => {
    guesses.value = [];
    currentGuess.value = '';
    secretWord.value = await fetchRandomWord();
    console.log('New Secret Word:', secretWord.value);
  };

  // Handle keyboard input: letters, backspace, and enter.
  const handleKeydown = (event: KeyboardEvent) => {
    if (isGameOver.value) return;
    if (event.key === 'Enter') {
      if (currentGuess.value.length === WORD_LENGTH) {
        checkGuess();
      }
    } else if (event.key === 'Backspace') {
      currentGuess.value = currentGuess.value.slice(0, -1);
    } else {
      if (/^[a-zA-Z]$/.test(event.key)) {
        if (currentGuess.value.length < WORD_LENGTH) {
          currentGuess.value += event.key.toUpperCase();
        }
      }
    }
  };

  onMounted(async () => {
    secretWord.value = await fetchRandomWord();
    console.log('Secret Word:', secretWord.value);
    document.addEventListener('keydown', handleKeydown);
  });

  onUnmounted(() => {
    document.removeEventListener('keydown', handleKeydown);
  });

  // Board of 6 rows:
  const board = computed(() => {
    const rows = [];
    for (let i = 0; i < MAX_ATTEMPTS; i++) {
      if (i < guesses.value.length) {
        rows.push(guesses.value[i]);
      } else if (i === guesses.value.length) {
        rows.push({
          word: currentGuess.value.padEnd(WORD_LENGTH, ' '),
          colors: new Array(WORD_LENGTH).fill(''),
        });
      } else {
        rows.push({
          word: ' '.repeat(WORD_LENGTH),
          colors: new Array(WORD_LENGTH).fill(''),
        });
      }
    }
    return rows;
  });

  return { secretWord, guesses, currentGuess, isWin, isGameOver, checkGuess, restartGame, board };
}
