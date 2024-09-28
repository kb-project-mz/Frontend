<script setup>
import { setTokens } from '@/util/token';
import { useRouter, useRoute } from 'vue-router';

const router = useRouter();
const route = useRoute();

const googleAccessToken = route.query.access_token;
const googleRefreshToken = route.query.refresh_token;
console.log("Extracted googleAccessToken:", googleAccessToken);

if (googleAccessToken) {
  try {
    console.log("googleAccessToken이 존재합니다. 토큰을 저장합니다. 토큰 값:", googleAccessToken);
    setTokens(googleAccessToken, googleRefreshToken);
    console.log("토큰이 로컬 스토리지에 저장되었습니다. 저장된 토큰 값:", googleAccessToken);

    // 홈 페이지로 리다이렉션
    console.log("홈 페이지로 리다이렉션합니다.");
    router.push('/');
  } catch (error) {
    console.error('토큰 저장 또는 리다이렉트 중 오류 발생:', error);
  }
} else {
  console.error('액세스 토큰이 없습니다.');
}
</script>

<template>
  <div>
    <p>구글 로그인 중입니다. 잠시만 기다려 주세요...</p>
  </div>
</template>