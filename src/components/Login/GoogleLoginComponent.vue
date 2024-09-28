<script setup>
import { useAuthStore } from '@/stores/auth';
import apiInstance from '@/util/axios-instance';
import { useRouter } from 'vue-router'

const authStore = useAuthStore();
const router = useRouter();

// Google 로그인 페이지로 이동하는 함수
const toGoogleLogin = async () => {
  console.log('toGoogleLogin 호출');
  try {
    // 백엔드에서 구글 로그인 URL을 가져옴
    const response = await apiInstance.get('/member/login/google');
    console.log('구글 로그인 URL 응답:', response.data.data);

    if (response.data.success) {
      // 구글 로그인 페이지로 리디렉션
      console.log('구글 로그인 페이지로 리디렉션:', response.data.data);
      window.location.href = response.data.data; // 구글 로그인 페이지로 이동
    } else {
      console.error('Google 로그인 실패:', response.data.error);
    }
  } catch (error) {
    console.error('Google 로그인 중 오류 발생:', error.response ? error.response.data : error.message);
  }
};
</script>

<template>
  <button @click="toGoogleLogin">
    <img src="@/assets/google.png" alt="Google Login Button" />
  </button>
</template>
