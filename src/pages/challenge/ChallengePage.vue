<script setup>
import MyChallengeList from '@/components/challenge/MyChallengeList.vue';
import NoMoneyChallenge from '@/components/challenge/NoMoneyChallenge.vue';

</script>

<template>
  <div class="mx-[10%] grid grid-cols-1 lg:grid-cols-5 gap-20">
    <NoMoneyChallenge class="lg:col-span-2 max-h-160" />
    <MyChallengeList class="lg:col-span-3" />
  </div>
</template>

<style scoped>
.max-h-160 {
  max-height: 40rem;
}
</style>
