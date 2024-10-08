<script setup>
import { reactive, ref } from 'vue';
import apiInstance from '@/util/axios-instance';

const member = reactive({
  memberName: '',
  memberId: '',
  email: '',
});

const error = ref('');
const successMessage = ref('');
const isVerificationSent = ref(false);
const loading = ref(false);

const checkFieldsInDB = async () => {
  try {
    const nameResponse = await apiInstance.get(`/member/memberName/${encodeURIComponent(member.memberName)}`);
    if (!nameResponse.data.data) {
      error.value = '존재하지 않는 이름입니다.';
      return false;
    }

    const idResponse = await apiInstance.get(`/member/check-memberId/${encodeURIComponent(member.memberId)}`);
    if (!idResponse.data.data) {
      error.value = '존재하지 않는 아이디입니다.';
      return false;
    }

    const emailResponse = await apiInstance.get(`/member/email/duplicate`, {
      params: { email: member.email }
    });
    if (!emailResponse.data.exists) {
      error.value = '존재하지 않는 이메일입니다. 회원가입을 진행해 주세요.';
      return false;
    }

    return true;
  } catch (err) {
    error.value = '서버 오류가 발생했습니다. 다시 시도해 주세요.';
    return false;
  }
};

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
      successMessage.value = '새 비밀번호가 이메일로 전송되었습니다. 이메일을 확인 후 로그인을 해 주세요.';
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

const findPassword = async () => {
  if (!member.memberName || !member.memberId || !member.email) {
    error.value = '이름, 아이디, 이메일을 모두 입력해 주세요.';
    successMessage.value = '';
    return;
  }

  loading.value = true;
  const isValidUser = await checkFieldsInDB();
  if (!isValidUser) {
    loading.value = false;
    return;
  }

  await sendNewPassword();
};

</script>

<template>
  <div class="flex flex-col items-center w-full max-w-md">
      <h2 class="text-center text-2xl font-bold mb-6 text-navy">비밀번호 찾기</h2>

      <form @submit.prevent="findPassword" v-if="!isVerificationSent" class="bg-white p-8 shadow-md rounded-lg w-full">
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

      <div v-if="isVerificationSent" class="bg-white p-8 shadow-md rounded-lg w-full text-center">
        <p class="text-lg text-green-500">{{ successMessage }}</p>
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
