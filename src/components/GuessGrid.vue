<template>
  <div>
    <GuessRow v-for="(row, index) in board" :key="index" :guess="row" />
  </div>
</template>

<script setup lang="ts">
import GuessRow from './GuessRow.vue';

interface Guess {
  word: string;
  colors: string[];
}

const props = defineProps<{
  board: Guess[];
}>();
</script>
