<script setup>
import ConnectedAccountBook from '@/components/connection/ConnectedAccountBook.vue';
import ConnectedCard from '@/components/connection/ConnectedCard.vue';
</script>

<template>
  <div class="mx-[20%] min-h-128 flex space-x-12">
    <div class="w-1/2">
      <ConnectedAccountBook />
    </div>
    <div class="w-1/2">
      <ConnectedCard/>
    </div>
  </div>
</template>

<style scoped>
.min-h-128 {
  min-height: 32rem;
}
</style>

