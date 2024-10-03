<script>
export default {
  props: {
    title: {
      type: String,
      required: true
    },
    value: {
      type: [Number, String],
      default: '0'
    }
  }
}
</script>

<template>
  <transition name="fade">
    <div class="card bg-white shadow-md rounded-md p-4 w-48 text-center">
      <p class="text-gray-500">회원가입 수</p>
      <p class="text-2xl font-bold">{{ value }}</p>
    </div>
  </transition>
</template>
  
<style scoped>
.fade-enter-active, .fade-leave-active {
  transition: opacity 0.5s;
}
.fade-enter, .fade-leave-to /* .fade-leave-active in <2.1.8 */ {
  opacity: 0;
}
</style>
  