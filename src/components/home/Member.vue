<script setup>
import Account from '@/components/home/Account.vue';
import Challenge from '@/components/home/Challenge.vue';
import SBTIResult from './SBTIResult.vue';
</script>

<template>
  <div class="mx-[10%] grid grid-cols-1 lg:grid-cols-3 gap-20">
    <div>
      <h1>[소비 테스트 결과지]</h1>
      <SBTIResult />
    </div>
    <div>
      <h1>[challenge top3]</h1>
      <Challenge />
    </div>
    <div>
      <h1>[Account]</h1>
      <Account />
    </div>
  </div>
</template>

<style setup></style>
