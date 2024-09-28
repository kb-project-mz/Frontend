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
const passwordStrengthMessage = ref('대소문자, 숫자, 특수문자를 모두 포함한 8글자 이상이어야 합니다.');
const allowedDomains = ['gmail.com', 'naver.com', 'daum.net'];
const selectedDomain = ref('');
const directEmail = ref('');
const isDirectInput = ref(false);
const memberIdFail = ref('');
const memberIdSuccess = ref('');
const disableSubmit = ref(true);
const isLoading = ref(false);
const isStrong = ref(false);

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
  isStrong.value = enhancedSecurityPassword(member.password);
  if (isStrong.value) {
    passwordStrengthMessage.value = '비밀번호가 강합니다.';
  } else if (member.password.length > 0) {
    passwordStrengthMessage.value = '비밀번호가 약합니다.';
  } else {
    passwordStrengthMessage.value = '대소문자, 숫자, 특수문자를 모두 포함한 8글자 이상이어야 합니다.';
  }
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
    console.log('회원가입 요청:', member);
    console.log('회원가입 응답:', createResponse);

		// 회원가입 후 로그인 요청
    const loginResponse = await auth.login(member.memberId, member.password);

    if (loginResponse) {
      console.log('로그인 성공:', loginResponse);
      router.push({ name: 'home' });
    }
  } catch (error) {
    alert('회원가입 중 오류가 발생했습니다.');
    console.error('회원가입 중 오류:', error);
  } finally {
    isLoading.value = false;
  }
};
</script>

<template>
  <div class="flex justify-center">
    <div class="w-1/3 px-16 py-10 bg-white border rounded-lg shadow">
      <div class="mb-5 font-bold text-2xl text-blue">
        <div>회원가입을 위해</div>
        <div>정보를 입력해주세요</div>
      </div>
    
      <form @submit.prevent="join">
        <div class="relative mb-6">
          <div class="absolute inset-y-0 start-0 flex items-center ps-4 pointer-events-none">
            <font-awesome-icon :icon="['fas', 'user']" />
          </div>
          <input
            v-model="member.memberName"
            type="text"
            id="memberName"
            class="bg-gray border border-gray-300 text-gray-900 text-sm rounded-xl focus:ring-blue-500 focus:border-blue-500 block w-full ps-10 p-4"
            placeholder="이름"
            required />
        </div>
        
        <div class="relative flex">
          <div class="absolute inset-y-0 start-0 flex items-center ps-4 pointer-events-none">
            <font-awesome-icon :icon="['fas', 'user']" />
          </div>
          <input
            v-model="member.memberId"
            type="text"
            id="memberId"
            class="bg-gray border border-gray-300 text-gray-900 text-sm rounded-xl focus:ring-blue-500 focus:border-blue-500 block w-full ps-10 p-4"
            placeholder="아이디"
            required />
          <button
            type="button"
            class="cursor-pointer w-24 ml-2 px-1 my-2 bg-navy text-white rounded-lg text-sm"
            @click="checkMemberId"
            :disabled="!member.memberId">
            중복 확인
          </button>
        </div>
        <div class="text-sm mb-6">
          <span v-if="memberIdFail" class="text-red-500">{{ memberIdFail }}</span>
          <span v-if="memberIdSuccess" class="text-green-500">{{ memberIdSuccess }}</span>
        </div>

        <div class="relative">
          <div class="absolute inset-y-0 start-0 flex items-center ps-4 pointer-events-none">
            <font-awesome-icon :icon="['fas', 'lock']" />
          </div>
          <input
            v-model="member.password"
            type="password"
            id="password"
            class="bg-gray border border-gray-300 text-gray-900 text-sm rounded-xl focus:ring-blue-500 focus:border-blue-500 block w-full ps-10 p-4"
            placeholder="비밀번호"
            @input="checkPasswordStrength"
            required />
            
        </div>
        <div :class="['text-sm', 'mt-1', 'mb-6', isStrong ? 'text-green-500' : 'text-red-500']">
          {{ passwordStrengthMessage }}
        </div>

        <div class="relative">
          <div class="absolute inset-y-0 start-0 flex items-center ps-4 pointer-events-none">
            <font-awesome-icon :icon="['fas', 'lock']" />
          </div>
          <input
            v-model="member.checkPassword"
            type="password"
            id="checkPassword"
            class="bg-gray border border-gray-300 text-gray-900 text-sm rounded-xl focus:ring-blue-500 focus:border-blue-500 block w-full ps-10 p-4"
            placeholder="비밀번호를 다시 입력해주세요."
            @input="checkPasswordsMatch"
            required />
        </div>
        <div :class="['mb-6', 'text-sm', passwordsMatch ? 'text-green-500' : 'text-red-500']">
          {{ passwordsMatch ? '비밀번호가 일치합니다.' : '비밀번호가 일치하지 않습니다.' }}
        </div>

        <div class="mb-6">
          <div class="flex items-center">
            <input 
              v-model="member.birthday" 
              type="text" 
              class="bg-gray border border-gray-300 text-gray-900 text-sm rounded-xl focus:ring-blue-500 focus:border-blue-500 block p-4"
              id="birthday" 
              placeholder="생년월일 6자리" 
              maxlength="6" 
              required />
            <span class="px-2">-</span>
            <input 
              v-model="member.gender"
              type="text" 
              class="w-11 bg-gray border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-4"
              id="gender" 
              maxlength="1"
              @input="handleBirthdayInput"
              required />
            <span class="px-2">●●●●●●</span>
          </div>
        </div>
        

        <div class="mb-4 flex flex-col">
          <div class="flex items-center">
            <input
            v-model="member.email"
            type="email"
            
            class="bg-gray border border-gray-300 text-gray-900 text-sm rounded-l-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-4"
            id="email"
            placeholder="이메일"
            required />
            <select v-model="selectedDomain" @change="handleDomainChange"
              class="border border-gray-300 rounded-r-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500 block p-3">
              <option value="">도메인 선택</option>
              <option v-for="domain in allowedDomains" :key="domain" :value="domain">{{ domain }}</option>
              <option value="직접입력">직접 입력</option>
            </select>
          </div>
          <input 
            v-if="isDirectInput" 
            type="text" 
            class="mt-2 border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500" 
            placeholder="직접 도메인을 입력해 주세요" 
            v-model="directEmail" 
            @input="updateDirectEmail" />
        </div>

        <div class="mb-6 form-check">
          <input
            type="checkbox"
            class="form-check-input"
            id="terms"
            v-model="member.terms"
            required />
          <label class="form-check-label" for="terms">약관에 동의합니다.</label>
        </div>

        <button
          type="submit"
          class="cursor-pointer w-full bg-navy text-white py-2 rounded-xl flex justify-center items-center py-5"
          :disabled="disableSubmit || isLoading || !isMemberIdChecked">
          <span class="ml-2">회원가입 하기</span>
        </button>
      </form>
    </div>
  </div>
</template>

<style scoped>
.spinner-border {
  width: 2rem;
  height: 2rem;
}
.text-blue {
  color: #0B1573;
}
.bg-navy {
  background-color: #0B1573;
}
</style>
