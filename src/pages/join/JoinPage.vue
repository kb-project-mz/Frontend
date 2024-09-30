<script setup>
import { reactive, ref, watch } from 'vue';
import axios from 'axios';

const member = reactive({
    memberName: '',
    email: '',
    newPassword: '',
});

const selectedDomain = ref('');
const directEmail = ref('');
const isDirectInput = ref(false);
const error = ref('');
const successMessage = ref('');
const isVerificationSent = ref(false);
const isPasswordSet = ref(false);

const allowedDomains = ['gmail.com', 'naver.com', 'daum.net'];

watch(() => member.email, (newEmail) => {
    if (isDirectInput.value && !newEmail.includes('@')) {
        member.email = `${newEmail}@${directEmail.value}`;
    } else if (!isDirectInput.value && selectedDomain.value) {
        member.email = `${newEmail.split('@')[0]}@${selectedDomain.value}`;
    }
});

const findPassword = async () => {
    if (!member.memberName || !member.email) {
        error.value = '모든 필드를 입력해주세요.';
        successMessage.value = '';
        return;
    }

    try {
        const response = await axios.get(
            `/api/v1/member/password/${encodeURIComponent(member.memberName)}/${encodeURIComponent(member.email)}`
        );
        successMessage.value = '새 비밀번호가 이메일로 전송되었습니다.';
        error.value = '';
        isVerificationSent.value = true;
    } catch {
        error.value = '비밀번호 찾기 실패';
        successMessage.value = '';
    }
};

const setNewPassword = async () => {
    if (!member.newPassword) {
        error.value = '비밀번호를 입력해주세요.';
        return;
    }

    try {
        const response = await axios.post(
            `/api/v1/member/email/newpassword`,
            {
                memberName: member.memberName,
                email: member.email,
                newPassword: member.newPassword
            }
        );
        successMessage.value = '비밀번호가 성공적으로 변경되었습니다.';
        error.value = '';
        isPasswordSet.value = true;
    } catch {
        error.value = '비밀번호 변경 실패';
        successMessage.value = '';
    }
};

</script>

<template>
  <form class="w-1/4" @submit.prevent="findPassword" v-if="!isVerificationSent">
    <div class="relative mb-6">
      <input
        type="text"
        v-model="member.memberName" 
        class="bg-gray border border-gray-300 text-gray-900 text-sm rounded-xl focus:ring-blue-500 focus:border-blue-500 block w-full ps-10 p-5"
        placeholder="이름을 입력해주세요." />
    </div>

    <div class="relative mb-6">
      <input
        type="text"
        v-model="member.email" 
        class="bg-gray border border-gray-300 text-gray-900 text-sm rounded-xl focus:ring-blue-500 focus:border-blue-500 block w-full ps-10 p-5"
        placeholder="이메일을 입력해주세요." />
      <div class="mt-2">
        <select v-model="selectedDomain" @change="handleDomainChange" class="bg-gray border border-gray-300 text-gray-900 text-sm rounded-xl focus:ring-blue-500 focus:border-blue-500 block w-full ps-10 p-5">
          <option value="">도메인을 선택하세요</option>
          <option v-for="domain in allowedDomains" :key="domain" :value="domain">{{ domain }}</option>
          <option value="직접입력">직접 입력</option>
        </select>
      </div>
      <div class="mt-2">
        <input type="checkbox" v-model="isDirectInput" /> 직접 입력
        <input v-if="isDirectInput" type="text" v-model="directEmail" class="bg-gray border border-gray-300 text-gray-900 text-sm rounded-xl focus:ring-blue-500 focus:border-blue-500 block w-full ps-10 p-5 mt-2" placeholder="도메인을 입력하세요." />
      </div>
    </div>

    <div v-if="error" class="text-red-500 font-semibold text-lg text-center">{{ error }}</div>
    <div v-if="successMessage" class="text-green-500 font-semibold text-lg text-center">{{ successMessage }}</div>

    <button type="submit" class="cursor-pointer bg-navy text-white text-sm rounded-xl block w-full ps-10 p-5">
      새 비밀번호 받기
    </button>
  </form>

  <form class="w-1/4" @submit.prevent="setNewPassword" v-if="isVerificationSent && !isPasswordSet">
    <div class="relative mb-6">
      <input
        type="password"
        v-model="member.newPassword" 
        class="bg-gray border border-gray-300 text-gray-900 text-sm rounded-xl focus:ring-blue-500 focus:border-blue-500 block w-full ps-10 p-5"
        placeholder="새 비밀번호를 입력해주세요." />
    </div>

    <div v-if="error" class="text-red-500 font-semibold text-lg text-center">{{ error }}</div>
    <div v-if="successMessage" class="text-green-500 font-semibold text-lg text-center">{{ successMessage }}</div>

    <button type="submit" class="cursor-pointer bg-navy text-white text-sm rounded-xl block w-full ps-10 p-5">
      새 비밀번호 설정
    </button>
  </form>

  <button @click="login" v-if="isPasswordSet" class="cursor-pointer bg-navy text-white text-sm rounded-xl block w-full ps-10 p-5 mt-4">
    로그인
  </button>
</template>

<style scoped>
.text-navy {
  color: #0B1573;
}
.bg-navy {
  background-color: #0B1573;
}
</style>
