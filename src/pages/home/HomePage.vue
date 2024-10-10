<script setup>
import Guest from '@/components/home/Guest.vue';
import Member from '@/components/home/Member.vue';

import { useAuthStore } from '@/stores/auth';

const authStore = useAuthStore();
</script>

<template>
  <div>
    <div v-if="authStore.member.memberIdx == null">
      <Guest />
    </div>
    <div v-else>
      <Member />
    </div>
  </div>
</template>
