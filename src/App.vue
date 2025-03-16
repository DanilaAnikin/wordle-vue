<template>
  <div class="flex flex-col items-center p-4">
    <GuessGrid :board="board" />

    <!-- Display win or game over message -->
    <div v-if="isGameOver" class="mt-4 flex flex-col items-center">
      <p v-if="isWin" class="text-green-600 text-xl font-bold">
        Well done, you guessed the word in {{ guesses.length }} {{ guesses.length === 1 ? 'try' : 'tries' }}!
      </p>
      <p v-else class="text-red-500 text-xl">
        Game Over! The word was {{ secretWord }}.
      </p>
      <button @click="restartGame" class="mt-2 bg-blue-500 text-white px-4 py-2 rounded">
        Restart Game
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useWordle } from './composables/useWordle';
import GuessGrid from './components/GuessGrid.vue';

const { secretWord, guesses, isWin, isGameOver, restartGame, board } = useWordle();
</script>
