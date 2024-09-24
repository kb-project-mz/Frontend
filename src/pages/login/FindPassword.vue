<script setup>
import { reactive, ref } from 'vue';
import axios from 'axios';

const member = reactive({
    memberName: '',
    memberId: '',
    email: '',
});

const error = ref('');
const successMessage = ref('');

const findPassword = async () => {
    try {
        await axios.post('/api/v1/member/find-password', {
            name: member.memberName,
            memberId: member.memberId,
            email: member.email,
        });
        successMessage.value = '새 비밀번호가 고객님의 이메일로 전송되었습니다.';
        error.value = '';
    } catch {
        error.value = '비밀번호 찾기 실패';
        successMessage.value = '';
    }
};
</script>

<template>
    <div class="mt-5 mx-auto" style="width: 500px">
      <h1 class="my-5">비밀번호 찾기</h1>

      <div class="mb-3">
        <input type="text" placeholder="이름" v-model="member.memberName" />
        <input type="text" placeholder="회원 ID" v-model="member.memberId" />
        <input type="email" placeholder="이메일" v-model="member.email" />
        <button @click="findPassword">새 비밀번호 받기</button>
      </div>

      <div v-if="error" class="text-danger">{{ error }}</div>
      <div v-if="successMessage">{{ successMessage }}</div>
    </div>
</template>
