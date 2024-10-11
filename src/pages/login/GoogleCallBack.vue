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

authStore.isLogin = function() {
  return !!this.accessToken && !!this.member.memberId;
};

onMounted(async () => {
  if (googleAccessToken.value) {

    try {
      authStore.$patch({
        member: {
          memberId: memberId.value,
          memberName: memberName.value,
          memberIdx: memberIdx.value,
          accessToken: googleAccessToken.value,
        },
      });

      console.log("AuthStore memberId:", authStore.member.memberId);
      console.log("AuthStore accessToken:", authStore.member.accessToken);

      if (authStore.isLogin()) {
        console.log("로그인 성공");
      } else {
        console.log("로그인 실패");
      }

      console.log("AuthStore의 로그인 상태 확인:", authStore.isLogin());

      setLocalStorage({
        memberId: memberId.value,
        accessToken: googleAccessToken.value,
        refreshToken: googleRefreshToken.value,
        memberName: memberName.value,
        memberIdx: memberIdx.value,
      });

      authStore.loadAuthState();
      router.push('/');

    } catch (error) {
      console.error('토큰 저장 또는 리다이렉트 중 오류 발생:', error);
    }
  } else {
    console.error("googleAccessToken 값이 없습니다!");
  }
});

</script>

