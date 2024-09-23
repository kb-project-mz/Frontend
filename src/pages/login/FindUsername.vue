<template>
    <div class="mt-5 mx-auto" style="width: 500px">
      <h1 class="my-5">아이디 찾기</h1>
  
      <div class="mb-3">
        <input type="text" placeholder="이름" v-model="member.name" />
        <input type="email" placeholder="이메일" v-model="member.email" @blur="validateEmail" />
        <button @click="findUsername">아이디 찾기</button>
      </div>
  
      <div v-if="error" class="text-danger">{{ error }}</div>
      <div v-if="successMessage">{{ successMessage }}</div>
    </div>
  </template>
  
  <script setup>
  import { reactive, ref } from 'vue';
  import axios from 'axios';
  
  const member = reactive({
    name: '',
    email: '',
  });
  
  const error = ref('');
  const successMessage = ref('');
  
  const validateEmail = () => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!regex.test(member.email)) {
      error.value = '유효한 이메일 주소를 입력하세요.';
    } else {
      error.value = '';
    }
  };
  
  const findUsername = async () => {
    try {
      const response = await axios.post('/api/v1/member/find-username', {
        name: member.name,
        email: member.email,
      });
      successMessage.value = `아이디는 ${response.data.username}입니다.`;
      error.value = '';
    } catch {
      error.value = '존재하지 않는 사용자입니다. 회원가입하러 가기.';
      successMessage.value = '';
    }
  };
  </script>
  