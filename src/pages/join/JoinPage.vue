<script setup>
import { reactive, ref, computed } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from "@/stores/auth.js";

const auth = useAuthStore();
const router = useRouter();

const member = reactive({
  memberName: '',
  memberId: '',
  email: '',
  password: '',
  password2: '',
  birthdate: '',
  birthdateSecond: '',
  terms: false,
});

const allowedDomains = ['gmail.com', 'naver.com', 'daum.net'];
const selectedDomain = ref('');
const directEmail = ref('');
const emailError = ref('');
const disableSubmit = ref(true);
const isLoading = ref(false);
const isMemberIdChecked = ref(false);
const passwordsMatch = ref(false);
const isDirectInput = ref(false);

const checkMemberId = async () => {
  if (!member.memberId) {
    return alert('회원 ID를 입력하세요.');
  }
  isLoading.value = true;
  try {
    disableSubmit.value = await auth.checkMemberId(member.memberId);
  } catch (error) {
    console.error('ID 중복 확인 중 오류:', error);
  } finally {
    isLoading.value = false;
  }
};

const changeMemberId = () => {
  if (!isMemberIdChecked.value) {
    emailError.value = 'ID 중복 체크를 하셔야 합니다.';
  } else {
    emailError.value = '';
  }
};

const handleBirthdateInput = (event) => {
  if (event.target.value.length > 1) {
    event.target.value = event.target.value.slice(0, 1);
  }
};

const checkPasswordsMatch = () => {
  passwordsMatch.value = member.password === member.password2;
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
  if (member.password !== member.password2) {
    return alert('비밀번호가 일치하지 않습니다.');
  }
  if (!member.terms) {
    return alert('약관에 동의해야 합니다.');
  }

  const emailToUse = isDirectInput.value ? member.email : member.email;

  try {
    isLoading.value = true;
    const response = await auth.create({ ...member, email: emailToUse });

    await auth.login({ memberId: member.memberId, password: member.password });
    
    router.push({ name: 'home' });
  } catch (error) {
    console.error('회원가입 중 오류:', error);
  } finally {
    isLoading.value = false;
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
          <div class="mb-3 row">
            <label for="memberName" class="col-sm-4 col-form-label">이름</label>
            <div class="col-sm-8">
              <input
                v-model="member.memberName"
                type="text"
                class="form-control"
                id="memberName"
                placeholder="이름을 입력하세요."
                required
              />
            </div>
          </div>
          <div class="mb-3 row">
            <label for="memberId" class="col-sm-4 col-form-label">
              아이디
              <button
                type="button"
                class="btn btn-success btn-sm py-0 ms-2"
                @click="checkMemberId"
                :disabled="!member.memberId"
              >
                중복 확인
              </button>
            </label>
            <div class="col-sm-8">
              <input
                v-model="member.memberId"
                type="text"
                class="form-control"
                id="memberId"
                placeholder="회원 ID를 입력하세요."
                @input="changeMemberId"
                required
              />
              <span :class="disableSubmit ? 'text-danger' : 'text-primary'">{{ emailError }}</span>
            </div>
          </div>
          <div class="mb-3 row">
            <label for="password" class="col-sm-4 col-form-label">비밀번호</label>
            <div class="col-sm-8">
              <input
                v-model="member.password"
                type="password"
                class="form-control"
                id="password"
                placeholder="비밀번호를 입력하세요."
                required
              />
            </div>
          </div>
          <div class="mb-3 row">
            <label for="password2" class="col-sm-4 col-form-label">비밀번호 확인</label>
            <div class="col-sm-8">
              <input
                v-model="member.password2"
                type="password"
                class="form-control"
                id="password2"
                placeholder="비밀번호를 확인하세요."
                @input="checkPasswordsMatch"
                required
              />
              <span :class="passwordsMatch ? 'text-primary' : 'text-danger'">
                {{ passwordsMatch ? '비밀번호가 일치합니다.' : '비밀번호가 일치하지 않습니다.' }}
              </span>
            </div>
          </div>
          <div class="mb-3 row">
            <label for="birthdate" class="col-sm-4 col-form-label">생년월일</label>
            <div class="col-sm-8">
              <div class="input-group">
                <input 
                  v-model="member.birthdate" 
                  type="text" 
                  class="form-control" 
                  id="birthdate" 
                  placeholder="010101" 
                  maxlength="6" 
                  required
                  style="width: 3em;"
                />
                <span class="input-group-text">-</span>
                <input 
                  v-model="member.birthdateSecond" 
                  type="text" 
                  class="form-control" 
                  id="birthdateSecond" 
                  maxlength="1" 
                  @input="handleBirthdateInput" 
                  style="width: 1em; text-align: center;"
                />
                <span class="input-group-text">******</span>
              </div>
            </div>
          </div>
          <div class="mb-3 row">
            <label for="email" class="col-sm-4 col-form-label">이메일</label>
            <div class="col-sm-8">
              <div class="input-group">
                <input
                  v-model="member.email"
                  type="email"
                  class="form-control"
                  id="email"
                  placeholder="이메일을 입력하세요."
                  required
                />
                <select v-model="selectedDomain" @change="handleDomainChange" class="form-select">
                  <option value="">도메인 선택</option>
                  <option v-for="domain in allowedDomains" :key="domain" :value="domain">{{ domain }}</option>
                  <option value="직접입력">직접 입력</option>
                </select>
              </div>
              <input 
                v-if="isDirectInput" 
                type="text" 
                placeholder="직접 입력 도메인" 
                v-model="directEmail" 
                @input="updateDirectEmail"
                class="form-control mt-2" 
              />
            </div>
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
            :disabled="disableSubmit || isLoading"
          >
            <i class="fa-solid fa-user-plus"></i> 확인
          </button>
          <div v-if="isLoading" class="text-center mt-2">
            <div class="spinner-border" role="status">
              <span class="visually-hidden">Loading...</span>
            </div>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<style scoped>
.spinner-border {
  width: 2rem;
  height: 2rem;
}
</style>
