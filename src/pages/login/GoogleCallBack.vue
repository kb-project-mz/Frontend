<script setup>
import { computed, onMounted } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { useAuthStore } from '@/stores/auth'; 
import { setLocalStorage } from '@/util/token'; 

const authStore = useAuthStore();
const router = useRouter();
const route = useRoute();

const googleAccessToken = computed(() => route.query.access_token);
const googleRefreshToken = computed(() => route.query.refresh_token);
const memberId = computed(() => route.query.member_id);
const memberIdx = computed(() => route.query.member_idx);
const memberName = computed(() => route.query.member_name);

onMounted(() => {

  console.log("초기 구글 토큰 값 확인:", googleAccessToken.value, googleRefreshToken.value);
  console.log("초기 memberId 및 memberIdx 값 확인:", memberId.value, memberIdx.value);

  if (googleAccessToken.value) {
    try {
      authStore.$patch({
        member: {
          memberId: memberId.value,
          memberName: memberName.value,
          memberIdx: memberIdx.value,
        },
        accessToken: googleAccessToken.value || localStorage.getItem('accessToken')
      });

      console.log("AuthStore에 저장된 데이터:", authStore.member);
      console.log("AuthStore의 accessToken 확인:", authStore.accessToken);
      console.log("AuthStore의 로그인 상태 확인:", authStore.isLogin());

      setLocalStorage({
        memberId: memberId.value,
        accessToken: googleAccessToken.value,
        refreshToken: googleRefreshToken.value,
        memberName: memberName.value,
        memberIdx: memberIdx.value,
      });

      console.log("AuthStore에 저장된 데이터:", authStore.member);
      console.log("로컬 스토리지에 저장된 auth:", localStorage.getItem('auth'));

      authStore.loadAuthState();
      router.push('/'); 
    } catch (error) {
      console.error('토큰 저장 또는 리다이렉트 중 오류 발생:', error);
    }
  }
});
</script>

