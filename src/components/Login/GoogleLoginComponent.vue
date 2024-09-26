<template>
  
    <button @click="toGoogleLogin">
			<img src="@/assets/google.png" alt="Google Login Button" /></button>
  
</template>
<script setup>
import { useAuthStore } from '@/stores/auth';
import { ref } from 'vue';
import apiInstance from '@/util/axios-instance';


const authStore = useAuthStore();
const toGoogleLogin = async () => {
  try {
    // Google 로그인 페이지로 이동 (백엔드에서 로그인 URL 반환)
    const response = await apiInstance.get('/member/login/google');
    const data = response.data;
    console.log(data);

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
// 구글 로그인 완료 후 사용자 정보를 받아 세션 유지
const googleLoginCallback = async (google_id_token) => {
  try {
    const response = await fetch('/api/v1/member/login/google', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ token: google_id_token })
    });

    const data = await response.json();

    if (data.message === "Login success" || data.message === "Registration success") {
      // 로그인 또는 회원가입 성공 시 사용자 정보를 로컬 스토리지에 저장
      localStorage.setItem('auth', JSON.stringify(data));
      window.location.href = '/home'; // 홈 화면으로 리디렉션
    } else {
      console.error('Error during login/join:', data.error);
    }
  } catch (error) {
    console.error('Error during login/join:', error);
  }
};
</script>
