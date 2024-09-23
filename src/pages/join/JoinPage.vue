<script setup>
import { reactive, ref, watch } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from "@/stores/auth.js";

const auth = useAuthStore();
const router = useRouter();

const member = reactive({
  memberName: '',
  memberId: '',
  email: '',
  password: '',
  checkPassword: '',
  birthday: '',
  terms: false,
});

const disableSubmit = ref(true);
const isLoading = ref(false);
const emailError = ref('');
const isMemberIdChecked = ref(false);
const passwordsMatch = ref(false);
const passwordStrengthMessage = ref('8자 이상, 특수문자, 대소문자 포함해야 합니다');

watch(() => member, (newMember) => {
  disableSubmit.value = !(
    newMember.memberName &&
    newMember.memberId &&
    newMember.email &&
    newMember.password &&
    newMember.checkPassword &&
    newMember.birthday &&
    newMember.terms &&
    isMemberIdChecked.value
  );
});

const checkMemberId = async () => {
  if (!member.memberId) {
    return alert('회원 ID를 입력하세요.');
  }
  isLoading.value = true;
  try {
    const result = await auth.checkMemberId(member.memberId);
    
    if (result) {
      emailError.value = '이미 사용 중인 ID입니다.';
      disableSubmit.value = true;
    } else {
      emailError.value = '사용 가능한 ID입니다.';
      isMemberIdChecked.value = true;
      disableSubmit.value = false;
    }
  } catch (error) {
    alert('ID 중복 확인 중 오류가 발생했습니다.');
    console.error('ID 중복 확인 중 오류:', error);
    emailError.value = 'ID 확인 중 오류가 발생했습니다.';
    disableSubmit.value = true;
  } finally {
    isLoading.value = false;
  }
};

const checkDuplicateMemberId = () => {
  if (!isMemberIdChecked.value) {
    emailError.value = 'ID 중복 체크를 하셔야 합니다.';
  } else {
    emailError.value = '';
  }
};

const checkPasswordsMatch = () => {
  passwordsMatch.value = member.password === member.checkPassword;
};

const enhancedSecurityPassword = (password) => {
  const minLength = 8;
  const specialChars = /[~!@#$%^&*]/;
  const upperCase = /[A-Z]/;
  const lowerCase = /[a-z]/;

  return (
    password.length >= minLength &&
    specialChars.test(password) &&
    upperCase.test(password) &&
    lowerCase.test(password)
  );
};

const checkPasswordStrength = () => {
  const isStrong = enhancedSecurityPassword(member.password);
  passwordStrengthMessage.value = isStrong ? '비밀번호가 강합니다.' : '비밀번호가 약합니다.';
};

const join = async () => {
  if (member.password !== member.checkPassword) {
    return alert('비밀번호가 일치하지 않습니다.');
  }
  if (!member.terms) {
    return alert('약관에 동의해야 합니다.');
  }

  try {
    isLoading.value = true;
    await auth.create(member);
    await auth.login({ memberId: member.memberId, password: member.password });
    router.push({ name: 'home' });
  } catch (error) {
    alert('회원가입 중 오류가 발생했습니다.');
    console.error('회원가입 중 오류:', error);
  } finally {
    isLoading.value = false;
  }
};
</script>

<template>
  <div class="container mx-auto mt-5 p-4">
    <div class="max-w-md mx-auto">
      <h1 class="my-4 text-center text-2xl font-bold">
        <i class="fa-solid fa-user-plus"></i> 회원 가입
      </h1>
      <form @submit.prevent="join" class="bg-white border rounded-lg shadow p-4">
        <div class="mb-4">
          <label for="memberName" class="block text-sm font-medium">이름</label>
          <input
            v-model="member.memberName"
            type="text"
            class="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
            id="memberName"
            placeholder="이름을 입력하세요."
            required
          />
        </div>
        <div class="mb-4">
          <label for="memberId" class="block text-sm font-medium">
            아이디
            <button
              type="button"
              class="ml-2 px-2 py-1 bg-green-500 text-white rounded"
              @click="checkMemberId"
              :disabled="!member.memberId"
            >
              중복 확인
            </button>
          </label>
          <input
            v-model="member.memberId"
            type="text"
            class="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
            id="memberId"
            placeholder="회원 ID를 입력하세요."
            @input="checkDuplicateMemberId"
            required
          />
          <span :class="disableSubmit ? 'text-red-500' : 'text-green-500'">{{ emailError }}</span>
        </div>
        <div class="mb-4">
          <label for="password" class="block text-sm font-medium">비밀번호</label>
          <input
            v-model="member.password"
            type="password"
            class="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
            id="password"
            placeholder="비밀번호를 입력하세요."
            @input="checkPasswordStrength"
            required
          />
          <div class="text-sm mt-1">
            <p>{{ passwordStrengthMessage }}</p>
          </div>
        </div>
        <div class="mb-4">
          <label for="password2" class="block text-sm font-medium">비밀번호 확인</label>
          <input
            v-model="member.checkPassword"
            type="password"
            class="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
            id="password2"
            placeholder="비밀번호를 확인하세요."
            @input="checkPasswordsMatch"
            required
          />
          <span :class="passwordsMatch ? 'text-green-500' : 'text-red-500'">
            {{ passwordsMatch ? '비밀번호가 일치합니다.' : '비밀번호가 일치하지 않습니다.' }}
          </span>
        </div>
        <div class="mb-4">
          <label for="birthday" class="block text-sm font-medium">생년월일</label>
          <input 
            v-model="member.birthday" 
            type="text" 
            class="mt-1 block w-full border-gray-300 rounded-md shadow-sm" 
            id="birthday" 
            placeholder="010101" 
            maxlength="6" 
            required
          />
        </div>
        <div class="mb-4">
          <label for="email" class="block text-sm font-medium">이메일</label>
          <input
            v-model="member.email"
            type="email"
            class="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
            id="email"
            placeholder="이메일을 입력하세요."
            required
          />
        </div>
        <div class="mb-4 form-check">
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
          class="w-full bg-blue-500 text-white py-2 rounded-lg"
          :disabled="disableSubmit || isLoading"
        >
          <i class="fa-solid fa-user-plus"></i> 확인
        </button>
        <div v-if="isLoading" class="text-center mt-2">
          <div class="spinner-border" role="status">
            <span class="visually-hidden">로딩 중</span>
          </div>
        </div>
      </form>
    </div>
  </div>
</template>

<style scoped>
.spinner-border {
  width: 2rem;
  height: 2rem;
}
</style>
