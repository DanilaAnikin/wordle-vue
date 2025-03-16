<template>
    <div class="flex gap-2 mb-2">
      <LetterBox
        v-for="(letter, index) in guess.word.split('')"
        :key="index"
        :letter="letter === ' ' ? '' : letter"
        :status="guess.colors[index]"
      />
    </div>
</template>
  
<script setup lang="ts">
import LetterBox from './LetterBox.vue';
  
interface Guess {
    word: string;
    colors: string[];
}
  
const props = defineProps<{
    guess: Guess;
}>();
</script>
  