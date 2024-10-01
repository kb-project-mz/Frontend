<script setup>
import { ref, onMounted } from 'vue';

const props = defineProps({
  limit: Number,
  completed: Number,
});

const progressWidth = ref('0%');
const emojiPosition = ref(0);

const moveEmoji = () => {
  const percentage = (props.completed / props.limit) * 100;
  emojiPosition.value = Math.min(percentage, 100);
};

onMounted(() => {
  setTimeout(() => {
    const percentage = (props.completed / props.limit) * 100;
    progressWidth.value = percentage >= 100 ? '100%' : percentage + '%';
    moveEmoji();
  }, 100);
});
</script>

<template>
  <div>
    <div class="relative">
      <div class="rounded-full h-7 bg-gray-200">
        <div class="h-full rounded-full bg-navy progress-bar" :style="{ width: progressWidth }"></div>
      </div>
      <div class="absolute top-[-30px] transition-transform text-2xl" :style="{ left: `calc(${emojiPosition}% - 10px)` }">
        <span role="img" aria-label="emoji"><font-awesome-icon :icon="['fas', 'person-running']" /></span>
      </div>
    </div>
  </div>
</template>

<style>
.bg-navy {
  background-color: #0B1573;
}
.progress-bar {
  transition: width 1s ease;
}
.transition-transform {
  transition: left 1s ease;
}
</style>
