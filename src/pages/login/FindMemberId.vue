<script setup>
import { reactive, ref, computed } from 'vue';
import axios from 'axios';
import { useRouter } from 'vue-router';

const member = reactive({
  memberName: '',
  email: '',
});

const allowedDomains = ['gmail.com', 'naver.com', 'daum.net'];
const selectedDomain = ref('');
const directEmail = ref('');
const error = ref('');
const successMessage = ref('');
const loading = ref(false);
const isDirectInput = ref(false);
const router = useRouter();

const validateEmail = () => {
  error.value = '';
};

const validateFields = () => {
  error.value = '';
};

const isButtonEnabled = computed(() => {
  return member.memberName && (member.email || directEmail.value) && selectedDomain.value && !error.value;
});

const handleDomainChange = () => {
  isDirectInput.value = selectedDomain.value === '직접입력';
  if (!isDirectInput.value) {
    directEmail.value = '';
  }
};

const findMemberId = async () => {
  loading.value = true;
  error.value = '';
  const emailToUse = isDirectInput.value ? directEmail.value : member.email;

  try {
    const response = await axios.post('/api/v1/member/find-member-id', {
      memberName: member.memberName,
      email: emailToUse,
    });
    successMessage.value = `${response.data.memberName}님의 아이디는 ${response.data.memberId}입니다.`;
  } catch (err) {
    if (err.response && err.response.status === 404) {
      error.value = '존재하지 않는 사용자입니다.';
      successMessage.value = '';
    } else {
      error.value = '서버 오류가 발생했습니다. 다시 시도해 주세요.';
    }
  } finally {
    loading.value = false;
  }
};

const goToJoin = () => {
  router.push('/join');
};
</script>

<template>
  <div class="container mt-5">
    <h1 class="text-center mb-5">아이디 찾기</h1>
    <div class="mb-3">
      <input 
        type="text" 
        placeholder="이름" 
        v-model="member.memberName" 
        @input="validateFields" 
        class="form-control" 
      />
      <div class="input-group mt-3">
        <input 
          type="email" 
          placeholder="이메일" 
          v-model="member.email" 
          @input="validateEmail" 
          class="form-control" 
        />
        <select v-model="selectedDomain" @change="handleDomainChange" class="form-select">
          <option value="">이메일 선택</option>
          <option v-for="domain in allowedDomains" :key="domain" :value="domain">{{ domain }}</option>
          <option value="직접입력">직접 입력</option>
        </select>
      </div>
      <input 
        v-if="isDirectInput" 
        type="text" 
        placeholder="이메일을 입력해 주세요" 
        v-model="directEmail" 
        class="form-control mt-2" 
      />
      <div class="d-flex justify-content-center mt-3">
        <button 
          :disabled="!isButtonEnabled" 
          @click="findMemberId" 
          class="btn btn-dark" 
          style="background-color: navy; color: white;"
        >
          아이디 찾기
        </button>
      </div>
    </div>

    <div v-if="error" class="text-danger text-center">
      {{ error }} 
      <button @click="goToJoin" class="btn btn-link">회원가입하러 가기</button>
    </div>
    <div v-if="successMessage" class="text-success text-center">{{ successMessage }}</div>
    <div v-if="loading" class="text-center">로딩 중</div>
  </div>
</template>
