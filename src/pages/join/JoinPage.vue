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
  gender: '',
  terms: false,
});

const isMemberIdChecked = ref(false);
const passwordsMatch = ref(false);
const passwordStrengthMessage = ref('8자 이상, 특수문자, 대소문자 포함해야 합니다');
const allowedDomains = ['gmail.com', 'naver.com', 'daum.net'];
const selectedDomain = ref('');
const directEmail = ref('');
const isDirectInput = ref(false);
const memberIdFail = ref('');
const memberIdSuccess = ref('');
const disableSubmit = ref(true);
const isLoading = ref(false);

watch(() => member, (newMember) => {
  disableSubmit.value = !(
    newMember.memberName &&
    newMember.memberId &&
    newMember.email &&
    newMember.password &&
    newMember.checkPassword &&
    newMember.birthday &&
    newMember.gender &&
    newMember.terms &&
    isMemberIdChecked.value
  );
});

const checkMemberId = async () => {
  if (!member.memberId) {
    memberIdFail.value = '회원 ID를 입력하세요.';
    memberIdSuccess.value = '';
    return;
  }
  isLoading.value = true;

  console.log("중복 확인 요청 ID:", member.memberId);

  try {
    const result = await auth.checkMemberId(member.memberId);

    console.log("중복 확인 결과:", result);
    
    if (result) {
      memberIdFail.value = '이미 사용 중인 ID입니다.';
      memberIdSuccess.value = '';
      disableSubmit.value = true;
      isMemberIdChecked.value = false;
    } else {
      memberIdSuccess.value = '사용 가능한 ID입니다.';
      memberIdFail.value = '';
      isMemberIdChecked.value = true;
      disableSubmit.value = false;
    }
  } catch (error) {
    alert('ID 중복 확인 중 오류가 발생했습니다.');
    console.error('ID 중복 확인 중 오류:', error);
    memberIdFail.value = 'ID 확인 중 오류가 발생했습니다.';
    memberIdSuccess.value = '';
    disableSubmit.value = true;
  } finally {
    isLoading.value = false;
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

const handleBirthdayInput = (event) => {
  if (event.target.value.length > 1) {
    event.target.value = event.target.value.slice(0, 1);
  }
};

const handleDomainChange = () => {
  isDirectInput.value = selectedDomain.value === '직접입력';
  if (!isDirectInput.value) {
    member.email = `${member.email.split('@')[0]}@${selectedDomain.value}`;
    directEmail.value = '';
  } else {
    directEmail.value = '';
  }
};

const updateDirectEmail = () => {
  if (isDirectInput.value && !member.email.includes('@')) {
    member.email += '@';
  }
  if (directEmail.value.includes('@')) {
    directEmail.value = directEmail.value.replace('@', '');
  }
  if (isDirectInput.value) {
    member.email = `${member.email.split('@')[0]}@${directEmail.value}`;
  }
};

const join = async () => {
  if (!isMemberIdChecked.value) {
    return alert ('ID 중복 확인을 해 주세요')
  }
  if (member.password !== member.checkPassword) {
    return alert('비밀번호가 일치하지 않습니다.');
  }
  if (!member.terms) {
    return alert('약관에 동의해야 합니다.');
  }

  try {
    isLoading.value = true;
    const createResponse = await auth.create(member);
    // await auth.create(member);
    console.log('회원가입 요청:', member);
    console.log('회원가입 응답:', createResponse); 
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
            class="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
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
              class="ml-2 px-2 py-1 bg-blue-800 text-white rounded"
              @click="checkMemberId"
              :disabled="!member.memberId"
            >
              중복 확인
            </button>
          </label>
          <input
            v-model="member.memberId"
            type="text"
            class="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            id="memberId"
            placeholder="회원 ID를 입력하세요."
            required
          />
          <span v-if="memberIdFail" class="text-red-500">{{ memberIdFail }}</span>
          <span v-if="memberIdSuccess" class="text-green-500">{{ memberIdSuccess }}</span>
        </div>
        <div class="mb-4">
          <label for="password" class="block text-sm font-medium">비밀번호</label>
          <input
            v-model="member.password"
            type="password"
            class="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
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
          <label for="checkPassword" class="block text-sm font-medium">비밀번호 확인</label>
          <input
            v-model="member.checkPassword"
            type="password"
            class="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            id="checkPassword"
            placeholder="비밀번호를 확인하세요."
            @input="checkPasswordsMatch"
            required
          />
          <span :class="passwordsMatch ? 'text-green-500' : 'text-red-500'">
            {{ passwordsMatch ? '비밀번호가 일치합니다.' : '비밀번호가 일치하지 않습니다.' }}
          </span>
        </div>
        <div class="mb-4">
          <div class="flex items-center">
            <input 
              v-model="member.birthday" 
              type="text" 
              class="border-none p-2 w-1/2 focus:outline-none focus:ring-2 focus:ring-blue-500" 
              id="birthday" 
              placeholder="010101" 
              maxlength="6" 
              required
            />
            <span class="bg-gray-200 px-2">-</span>
            <input 
              v-model="member.gender"
              type="text" 
              class="border-none p-2 w-1/4 text-center focus:outline-none focus:ring-2 focus:ring-blue-500" 
              id="gender" 
              maxlength="1" 
              @input="handleBirthdayInput"
            />
            <span class="bg-gray-200 px-2">******</span>
          </div>
        </div>
        <div class="mb-4 flex flex-col">
          <label for="email" class="block text-sm font-medium mb-1">이메일</label>
          <div class="flex">
            <input
              v-model="member.email"
              type="email"
              class="flex-1 border border-gray-300 rounded-l-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              id="email"
              placeholder="이메일을 입력하세요."
              required
            />
            <select v-model="selectedDomain" @change="handleDomainChange" class="border border-gray-300 rounded-r-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500">
              <option value="">도메인 선택</option>
              <option v-for="domain in allowedDomains" :key="domain" :value="domain">{{ domain }}</option>
              <option value="직접입력">직접 입력</option>
            </select>
          </div>
          <input 
            v-if="isDirectInput" 
            type="text" 
            placeholder="직접 도메인을 입력해 주세요" 
            v-model="directEmail" 
            @input="updateDirectEmail"
            class="mt-2 border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500" 
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
          class="w-full bg-blue-800 text-white py-2 rounded-lg flex justify-center items-center"
          :disabled="disableSubmit || isLoading || !isMemberIdChecked"
        >
          <i class="fa-solid fa-user-plus"></i>
          <span class="ml-2">확인</span>
        </button>
        <div v-if="isLoading" class="text-center mt-2">
          <div class="animate-spin inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full" role="status">
            <span class="visually-hidden">Loading...</span>
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
