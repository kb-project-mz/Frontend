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
const memberName = computed(() => route.query.member_name);

onMounted(() => {
  if (googleAccessToken.value) {
    try {
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

      authStore.loadAuthState();
      router.push('/'); 
    } catch (error) {
      console.error('토큰 저장 또는 리다이렉트 중 오류 발생:', error);
    }
  }
});
</script>
