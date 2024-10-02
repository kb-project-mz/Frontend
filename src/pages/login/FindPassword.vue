<script setup>
import { reactive, ref } from 'vue';
import apiInstance from '@/util/axios-instance';
import { useRouter } from 'vue-router';
import { useAuthStore } from '@/stores/auth'; 
import { setLocalStorage } from '@/util/token'; 

// 입력 필드 상태 관리
const member = reactive({
  memberName: '',
  memberId: '',
  email: '',
  verificationCode: '', // 사용자 입력할 인증 코드
});

const router = useRouter();
const error = ref('');
const successMessage = ref('');
const isVerificationSent = ref(false);
const isPasswordSet = ref(false); // 인증 성공 여부
const loading = ref(false);

// 이름, 아이디, 이메일 중복 확인 API 호출
const checkFieldsInDB = async () => {
  try {
    // 이름 중복 확인
    const nameResponse = await apiInstance.get(`/member/memberName/${encodeURIComponent(member.memberName)}`);
    if (!nameResponse.data.data) {
      error.value = '존재하지 않는 이름입니다.';
      return false;
    }

    // 아이디 중복 확인
    const idResponse = await apiInstance.get(`/member/check-memberId/${encodeURIComponent(member.memberId)}`);
    if (!idResponse.data.data) {
      error.value = '존재하지 않는 아이디입니다.';
      return false;
    }

    // 이메일 중복 확인
    const emailResponse = await apiInstance.get(`/member/email/duplicate`, {
      params: { email: member.email }
    });
    if (!emailResponse.data.exists) {
      error.value = '존재하지 않는 이메일입니다. 회원가입을 진행해 주세요.';
      return false;
    }

    return true; // 모든 필드가 유효한 경우
  } catch (err) {
    error.value = '서버 오류가 발생했습니다. 다시 시도해 주세요.';
    return false;
  }
};

// 새 비밀번호 전송 API 요청 (비밀번호 생성 및 이메일 전송)
const sendNewPassword = async () => {
  loading.value = true;
  error.value = '';
  successMessage.value = '';

  try {
    const response = await apiInstance.post(`/member/email/newpassword`, {
      memberName: member.memberName,
      memberId: member.memberId,
      email: member.email,
    });

    if (response.data.success) {
      successMessage.value = '새 비밀번호가 이메일로 전송되었습니다.';
      isVerificationSent.value = true;
    } else {
      error.value = '새 비밀번호 전송에 실패했습니다.';
    }
  } catch (err) {
    error.value = '비밀번호 전송 실패';
  } finally {
    loading.value = false;
  }
};

// 비밀번호 찾기 요청 처리
const findPassword = async () => {
  if (!member.memberName || !member.memberId || !member.email) {
    error.value = '이름, 아이디, 이메일을 모두 입력해 주세요.';
    successMessage.value = '';
    return;
  }

  // DB에서 이름, 아이디, 이메일 일치 여부 확인
  loading.value = true;
  const isValidUser = await checkFieldsInDB();
  if (!isValidUser) {
    loading.value = false;
    return;
  }

  // 사용자가 유효하면 새 비밀번호를 이메일로 전송
  await sendNewPassword();
};

// 비밀번호 확인 API 요청
const verifyPassword = async () => {
  if (!member.verificationCode) {
    error.value = '인증 코드를 입력해 주세요.';
    return;
  }

  loading.value = true;
  error.value = '';
  successMessage.value = '';

  try {
    // 비밀번호 비교 API 호출
    const response = await apiInstance.post(`/member/password/verify-password`, {
      memberName: member.memberName,
      email: member.email,
      newPassword: member.verificationCode,
    });

    console.log('API Response:', response.data);

    if (response.data.success && response.data.data) {
      const memberId = response.data.data; // 서버에서 memberId를 받아옴
      if (!memberId) {
        throw new Error('memberId가 null입니다.');
      }

      // 이름, 이메일, 아이디 모두 저장
      const loginData = {
        memberId: memberId,
        memberName: member.memberName,
        email: member.email,
        ...response.data.tokenData, // 추가적인 토큰 데이터가 있다면 포함
      };
      setLocalStorage(loginData); // 토큰과 로그인 데이터를 로컬 스토리지에 저장
      successMessage.value = '비밀번호가 성공적으로 확인되었습니다.';
      isPasswordSet.value = true;

      // 로그인 상태 불러오기
      const authStore = useAuthStore();
      authStore.loadAuthState(); // 상태 저장

      // 홈 화면으로 리다이렉트
      router.push('/');
    } else {
      error.value = response.data.message || '비밀번호가 일치하지 않습니다.';
    }
  } catch (err) {
    console.error(err);
    error.value = '비밀번호 확인에 실패했습니다.';
  } finally {
    loading.value = false;
  }
};

</script>

<template>
  <div class="flex items-center justify-center min-h-screen px-4">
    <div class="w-full max-w-md mb-32">
      <h2 class="text-center text-2xl font-bold mb-6 text-navy">비밀번호 찾기</h2>

      <!-- 비밀번호 찾기 폼 -->
      <form @submit.prevent="findPassword" v-if="!isVerificationSent">
        <div class="mb-6">
          <input
            type="text"
            v-model="member.memberName"
            class="w-full p-4 border border-gray-300 rounded-lg text-gray-900 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="이름"
          />
        </div>
        <div class="mb-6">
          <input
            type="text"
            v-model="member.memberId"
            class="w-full p-4 border border-gray-300 rounded-lg text-gray-900 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="아이디"
          />
        </div>
        <div class="mb-6">
          <input
            type="email"
            v-model="member.email"
            class="w-full p-4 border border-gray-300 rounded-lg text-gray-900 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="이메일"
          />
        </div>

        <div v-if="error" class="text-red-500 text-center mb-4">{{ error }}</div>
        <div v-if="successMessage" class="text-green-500 text-center mb-4">{{ successMessage }}</div>

        <button
          type="submit"
          class="w-full py-4 bg-navy text-white font-semibold rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          :disabled="loading"
        >
          새 비밀번호 받기
        </button>
      </form>

      <!-- 인증 코드 확인 폼 -->
      <form @submit.prevent="verifyPassword" v-if="isVerificationSent && !isPasswordSet">
        <div class="mb-6">
          <input
            type="text"
            v-model="member.verificationCode"
            class="w-full p-4 border border-gray-300 rounded-lg text-gray-900 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="이메일로 받은 인증 코드"
          />
        </div>

        <div v-if="error" class="text-red-500 text-center mb-4">{{ error }}</div>
        <div v-if="successMessage" class="text-green-500 text-center mb-4">{{ successMessage }}</div>

        <button
          type="submit"
          class="w-full py-4 bg-navy text-white font-semibold rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          :disabled="loading"
        >
          인증 코드 확인
        </button>
      </form>
    </div>
  </div>
</template>

<style scoped>
.text-navy {
  color: #0B1573;
}
.bg-navy {
  background-color: #0B1573;
}
</style>
