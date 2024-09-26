<script setup>
import { useAuthStore } from '@/stores/auth';
import { computed, ref } from 'vue';

const authStore = useAuthStore();
const memberId = computed(() => authStore.member.memberId);

const value = ref('');
const balanceShow = async () => {
    if(memberId == 'woo') {
        value.value = 2;
        return;
    } else {
        value.value = 
    }
}
</script>

<template>

</template>