<script>
  export default {
    props: {
      value: {
        type: [Number, String],
        default: '0'
      }
    }
  }
  </script>

<template>
  <div class="bg-white shadow-md rounded-md p-4 w-48 text-center">
    <p class="text-gray-500">로그인 수</p>
    <p class="text-2xl font-bold">{{ value }}</p>
  </div>
</template>
  
<style scoped>
@keyframes fadeIn {
  0% {
    opacity: 0;
    transform: translateY(20px);
  }
  100% {
    opacity: 1;
    transform: translateY(0);
  }
}

.animate-fade-in {
  animation: fadeIn 0.5s ease-out;
}
</style>
  