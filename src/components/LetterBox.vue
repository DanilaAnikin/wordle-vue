<template>
    <div :class="['w-12 h-12 flex items-center justify-center text-xl font-bold uppercase border', colorClass]">
      {{ letter }}
    </div>
</template>
  
<script setup lang="ts">
import { computed } from 'vue';
  
interface Props {
    letter: string;
    status?: string;
}
  
const props = defineProps<Props>();
  
const colorClass = computed(() => {
    if (!props.status) return 'border-gray-300';
    switch (props.status) {
      case 'correct':
        return 'bg-green-500 border-green-500 text-white';
      case 'present':
        return 'bg-yellow-500 border-yellow-500 text-white';
      default:
        return 'bg-gray-400 border-gray-400 text-white';
    }
});
</script>
  