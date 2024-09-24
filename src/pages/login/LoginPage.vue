<script setup>
import { computed, reactive, ref } from 'vue';
import { useAuthStore } from '@/stores/auth';
import { useRoute, useRouter } from 'vue-router';

const cr = useRoute();
const router = useRouter();
const auth = useAuthStore();

const member = reactive({
  memberId: '',
  password: '',
});

const error = ref('');
const disableSubmit = computed(() => !(member.memberId && member.password));

const login = async () => {
  console.log(member);
  try {
    const response = await auth.login(member);
    
    if (response) {
      console.log('로그인 성공:', response);
      localStorage.setItem('accessToken', response.accessToken);
      
      if (cr.query.next) {
        router.push({ name: cr.query.next });
      } else {
        router.push('/');
      }
    }
  } catch (e) {
    console.log('에러=======', e);
    error.value = e.response?.data || '로그인 실패';
  }
};
</script>

<template>
    <div class="container mt-5 mx-auto">
      <div class="row justify-content-center">
        <div class="col-md-6">
          <img 
            src="@/assets/fin.png" 
            alt="로고" 
            class="img-fluid my-5 mx-auto d-block" 
          />
  
          <form @submit.prevent="login">
            <div class="mb-3 mt-3">
              <label for="memberId" class="form-label">
                <i class="fa-solid fa-user"></i>
                ID:
              </label>
              <input 
                type="text" 
                id="memberId" 
                class="form-control" 
                placeholder="회원 ID" 
                v-model="member.memberId" 
                required 
              />
            </div>
  
            <div class="mb-3">
              <label for="password" class="form-label">
                <i class="fa-solid fa-lock"></i>
                비밀번호:
              </label>
              <input 
                type="password" 
                id="password" 
                class="form-control" 
                placeholder="비밀번호" 
                v-model="member.password" 
                required 
              />
            </div>
  
            <div v-if="error" class="text-danger">{{ error }}</div>
  
            <button 
              type="submit" 
              class="btn btn-primary w-100 mt-4" 
              :disabled="disableSubmit"
              style="background-color: navy; color: white; border: none;">
              <i class="fa-solid fa-right-to-bracket"></i>
              로그인
            </button>
          </form>
  
          <div class="mt-4">
            <router-link to="/findMemberId" class="btn btn-link">아이디 찾기</router-link>
            <router-link to="/findPassword" class="btn btn-link">비밀번호 찾기</router-link>
            <router-link to="/join" class="btn btn-link">회원가입</router-link>
          </div>
        </div>
      </div>
    </div>
  </template>
