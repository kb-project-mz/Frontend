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
    <p class="text-gray-500">탈퇴 수</p>
    <p class="text-2xl font-bold">{{ value }}</p>
  </div>
</template>
  
<style scoped>

</style>
  