<script setup>
import { computed, onMounted, watchEffect } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { useAuthStore } from '@/stores/auth'; // authStore 가져오기
import { setLocalStorage } from '@/util/token'; 

const authStore = useAuthStore(); // authStore 인스턴스
const router = useRouter();
const route = useRoute();

// computed를 사용하여 query 파라미터 추출
const googleAccessToken = computed(() => route.query.access_token);
const googleRefreshToken = computed(() => route.query.refresh_token);
const memberId = computed(() => route.query.member_id);
const memberName = computed(() => route.query.member_name);

watchEffect(() => {
  console.log('로그인 상태 변경 감지:', authStore.member);
});

// onMounted로 컴포넌트가 마운트된 후 실행
onMounted(() => {
  if (googleAccessToken.value) {
    try {
      // authStore에서 직접 상태 관리 및 로컬 스토리지 설정
      authStore.$patch({
        member: {
          memberId: memberId.value,
          memberName: memberName.value,
        }
      });

      setLocalStorage({
        memberId: memberId.value,
        accessToken: googleAccessToken.value,
        refreshToken: googleRefreshToken.value,
        memberName: memberName.value
      });

      console.log('로그인 상태 업데이트:', authStore.member);

      authStore.loadAuthState();
      console.log("홈 페이지로 리다이렉션합니다.");
      router.push('/'); 
    } catch (error) {
      console.error('토큰 저장 또는 리다이렉트 중 오류 발생:', error);
    }
  } else {
    console.error('액세스 토큰이 없습니다.');
  }
});
</script>
