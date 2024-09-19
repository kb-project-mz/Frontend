<script setup>
import { reactive, ref } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from "@/stores/auth.js";

const auth = useAuthStore();
const router = useRouter();

const member = reactive({
  name: '',
  username: '',
  email: '',
  password: '',
  password2: '',
  birthdate: '',
  terms: false,
});

const checkError = ref('');
const disableSubmit = ref(true);

const checkUsername = async () => {
  if (!member.username) {
    return alert('사용자 ID를 입력하세요.');
  }
  disableSubmit.value = await auth.checkUsername(member.username);
  checkError.value = disableSubmit.value ? '이미 사용중인 ID입니다.' : '사용가능한 ID입니다.';
};

const changeUsername = () => {
  if (disableSubmit.value) {
    checkError.value = 'ID 중복 체크를 하셔야 합니다.';
  } else {
    checkError.value = '';
  }
};

const join = async () => {
  if (member.password !== member.password2) {
    return alert('비밀번호가 일치하지 않습니다.');
  }
  try {
    await auth.create(member);
    router.push({ name: 'home' });
  } catch (e) {
    console.error(e);
  }
};
</script>


<template>
    <div class="container mt-5">
      <div class="row justify-content-center">
        <div class="col-md-6">
          <h1 class="my-4 text-center">
            <i class="fa-solid fa-user-plus"></i> 회원 가입
          </h1>
          <form @submit.prevent="join" class="border p-4 bg-light rounded">
            <div class="mb-3">
              <label for="name" class="form-label">이름</label>
              <input
                v-model="member.name"
                type="text"
                class="form-control"
                id="name"
                placeholder="이름을 입력하세요."
                required
              />
            </div>
  
            <div class="mb-3">
              <label for="username" class="form-label">
                사용자 ID
                <button
                  type="button"
                  class="btn btn-success btn-sm py-0 ms-2"
                  @click="checkUsername"
                >
                  ID 중복 확인
                </button>
              </label>
              <input
                v-model="member.username"
                type="text"
                class="form-control"
                id="username"
                placeholder="사용자 ID를 입력하세요."
                @input="changeUsername"
                required
              />
              <span :class="disableSubmit ? 'text-danger' : 'text-primary'">{{ checkError }}</span>
            </div>
  
            <div class="mb-3">
              <label for="password" class="form-label">비밀번호</label>
              <input
                v-model="member.password"
                type="password"
                class="form-control"
                id="password"
                placeholder="비밀번호를 입력하세요."
                required
              />
            </div>
  
            <div class="mb-3">
              <label for="password2" class="form-label">비밀번호 확인</label>
              <input
                v-model="member.password2"
                type="password"
                class="form-control"
                id="password2"
                placeholder="비밀번호를 확인하세요."
                required
              />
            </div>

            <div class="mb-3 mt-3">
                <label for="birthdate">생년월일</label>
                <input 
                v-model="member.birthdate" 
                type="text" 
                class="form-control" 
                id="birthdate" 
                placeholder="010101-3******" 
                maxlength="13" />
            </div>
  
            <div class="mb-3">
              <label for="email" class="form-label">이메일</label>
              <input
                v-model="member.email"
                type="email"
                class="form-control"
                id="email"
                placeholder="이메일을 입력하세요."
                required
              />
            </div>
  
            <div class="mb-3 form-check">
              <input
                type="checkbox"
                class="form-check-input"
                id="terms"
                v-model="member.terms"
                required
              />
              <label class="form-check-label" for="terms">약관에 동의합니다.</label>
            </div>
  
            <button
              type="submit"
              class="btn btn-primary w-100"
              :disabled="disableSubmit"
            >
              <i class="fa-solid fa-user-plus"></i> 확인
            </button>
          </form>
        </div>
      </div>
    </div>
  </template>

<style scoped>

</style>