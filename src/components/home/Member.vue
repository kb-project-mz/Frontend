<script setup>
import Account from '@/components/home/Account.vue';
import Challenge from '@/components/home/Challenge.vue';
import SBTIResult from './SBTIResult.vue';
</script>

<template>
  <div class="mx-[10%] grid grid-cols-1 lg:grid-cols-3 gap-20">
    <div>
      <SBTIResult />
    </div>
    <div>
      <Challenge />
    </div>
    <div>
      <Account />
    </div>
  </div>
</template>

<style setup></style>
