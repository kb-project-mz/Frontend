<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-100">
    <div class="w-full max-w-screen-lg bg-white shadow-lg rounded-lg grid grid-cols-1 md:grid-cols-2 min-h-screen">
      <div class="flex flex-col items-center justify-center p-8 border-r border-gray-300">
        <FindMemberId />
      </div>
      <div class="flex flex-col items-center justify-center p-8">
        <FindPassword />
      </div>
    </div>
  </div>
</template>

<script setup>
import FindMemberId from '../../components/Login/FindMemberId.vue';
import FindPassword from '../../components/Login/FindPassword.vue';
</script>

<style scoped>
.text-navy {
  color: #0B1573;
}
.bg-navy {
  background-color: #0B1573;
}
</style>
