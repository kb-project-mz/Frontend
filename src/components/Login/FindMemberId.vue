<script setup>
import { reactive, ref } from 'vue';
import apiInstance from '@/util/axios-instance';

const member = reactive({
  memberName: '',
  email: '',
});

const error = ref('');
const successMessage = ref('');
const loading = ref(false);

const checkEmailDuplicate = async (email) => {
  try {
    const response = await apiInstance.get(`/member/email/duplicate`, {
      params: { email: email }
    });

    if (response && response.data) {
      return response.data.exists;
    } else {
      return false;
    }
  } catch (error) {
    console.error('이메일 중복 확인 오류:', error);
    throw error;
  }
};

const checkNameDuplicate = async (memberName) => {
  try {
    const response = await apiInstance.get(`/member/memberName/${encodeURIComponent(memberName)}`);
    return response.data.data;
  } catch (error) {
    console.error('이름 중복 확인 오류:', error);
    throw error;
  }
};

const validateFields = () => {
  if (!member.memberName || !member.email) {
    error.value = '이름과 이메일을 입력해 주세요.';
    return false;
  }
  return true;
};

const findMemberId = async () => {
  if (!validateFields()) {
    return;
  }

  const isEmailExists = await checkEmailDuplicate(member.email);
  if (!isEmailExists) {
    error.value = '존재하지 않는 이메일입니다. 회원가입을 진행해주세요.';
    return;
  }

  const isNameExists = await checkNameDuplicate(member.memberName);
  if (!isNameExists) {
    error.value = '존재하지 않는 이름입니다. 확인해 주세요.';
    return;
  }

  loading.value = true;
  error.value = '';
  successMessage.value = '';

  try {
    const response = await apiInstance.get(`/member/memberId/${encodeURIComponent(member.memberName)}/${encodeURIComponent(member.email)}`);
    
    successMessage.value = `${member.memberName}님의 아이디는 ${response.data.data.memberId}입니다.`;
    
    member.memberName = '';
    member.email = '';

  } catch (err) {
    if (err.response && err.response.status === 404) {
      error.value = '존재하지 않는 사용자입니다.';
    } else {
      error.value = '서버 오류가 발생했습니다. 다시 시도해 주세요.';
    }
  } finally {
    loading.value = false;
  }
};

const resetMessages = () => {
  successMessage.value = '';
  error.value = ''; 
};
</script>

<template>
  <div class="flex flex-col items-center w-1/2 my-32">
      <form @submit.prevent="findMemberId" class="bg-white p-8 shadow-md rounded-lg w-full">
        <div class="mb-6">
          <input
            type="text"
            v-model="member.memberName"
						@focus="resetMessages" 
            class="w-full p-4 border border-gray-300 rounded-lg text-gray-900 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="이름"
          />
        </div>
        <div class="mb-6">
          <input
            type="text"
            v-model="member.email"
						@focus="resetMessages" 
            class="w-full p-4 border border-gray-300 rounded-lg text-gray-900 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="이메일"
          />
        </div>
        <div v-if="successMessage" class="text-black-500 text-center mb-4">
          <span class="font-semibold text-blue-700">{{ successMessage }}</span>
        </div>
        <button
          type="submit"
          class="w-full py-4 bg-navy text-white font-semibold rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          아이디 찾기
        </button>
        <div class="text-center mt-4 text-gray-600">
          <span v-if="error && error !== '존재하지 않는 사용자입니다.'">{{ error }} <a href="/join" class="text-blue-500">회원가입하러 가기</a></span>
        </div>
      </form>
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
