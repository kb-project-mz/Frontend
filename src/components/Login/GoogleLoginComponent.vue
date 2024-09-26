<script setup>
import { useAuthStore } from '@/stores/auth';
import apiInstance from '@/util/axios-instance';


const authStore = useAuthStore();

// Google 로그인 페이지로 이동하는 함수
const toGoogleLogin = async () => {
  try {
    // 백엔드에서 구글 로그인 URL을 가져옴
    const response = await apiInstance.get('/member/login/google');
    const data = response.data;

    if (data.success) {
      // 구글 로그인 페이지로 리디렉션
      window.location.href = data.data;
    } else {
      console.error('Google 로그인 실패:', data.error.message);
    }
  } catch (error) {
    console.error('Google 로그인 중 오류 발생:', error);
  }
};

// 구글 로그인 콜백 처리 함수
const googleLoginCallback = async (google_id_token) => {
  try {
    const response = await authStore.googleLogin(google_id_token);

    if (response && (response.message === "Login success" || response.message === "Registration success")) {
      console.log("구글 로그인 성공");
      window.location.href = '/home';
    } else {
      console.error('Error during login/join:', response.error);
    }
  } catch (error) {
    console.error('Error during login/join:', error);
  }
};
</script>

<template>
	<button @click="toGoogleLogin">
		<img src="@/assets/google.png" alt="Google Login Button" /></button>
</template>