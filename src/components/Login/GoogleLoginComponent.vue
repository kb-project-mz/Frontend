<script setup>
import { useAuthStore } from '@/stores/auth';
import apiInstance from '@/util/axios-instance';

const authStore = useAuthStore();

// Google 로그인 페이지로 이동하는 함수
const toGoogleLogin = async () => {
  console.log('toGoogleLogin 호출');
  try {
    // 백엔드에서 구글 로그인 URL을 가져옴
    const response = await apiInstance.get('/member/login/google');
    console.log('구글 로그인 URL 응답:', response.data.data);

    const data = response.data;

    if (data.success) {
      // 구글 로그인 페이지로 리디렉션
      console.log('구글 로그인 페이지로 리디렉션:', data.data);
      window.location.href = response.data.data;
    } else {
      console.error('Google 로그인 실패:', response.data.error);
    }
  } catch (error) {
    console.error('Google 로그인 중 오류 발생:', error.response ? error.response.data : error.message);
  }
};

const googleLoginCallback = async (google_id_token) => {
  try {
        const requestPayload = {
            id_token: google_id_token,
        };
        console.log("request 정보 확인:", google_id_token)
        
        const response = await authStore.googleLogin(requestPayload);
        
        if (response.data && response.data.success) {
            console.log("구글 로그인 성공:", response.data.data);
            router.push('/');
        } else {
            console.error('Error during login/join:', response.data.error || '로그인 오류 발생');
        }
    } catch (error) {
        console.error('Error during login/join:', error.response ? error.response.data : error.message);
    }
};
</script>

<template>
  <button @click="toGoogleLogin">
    <img src="@/assets/google.png" alt="Google Login Button" />
  </button>
</template>
