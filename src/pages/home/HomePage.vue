<script setup>
import { useAuthStore } from '@/stores/auth.js';
import GuestHomePage from './GuestHomePage.vue';
import MemberHomePage from './MemberHomePage.vue';

const authStore  = useAuthStore();
</script>

<template>
  <MemberHomePage v-if="authStore.member.accessToken" />
  <GuestHomePage v-else />
</template>

<style scoped>

</style>
