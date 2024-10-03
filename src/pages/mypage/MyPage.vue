<script setup>
import { reactive, ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from "@/stores/auth.js";
import apiInstance from '@/util/axios-instance';

const router = useRouter();
const auth = useAuthStore(); 

const profile = reactive({
  memberName: '',
  memberId: '',
  password: '',
  email: '',
  birthDay: '',
});

const password = ref('');
const newPassword = ref('');
const isPasswordVerified = ref(false);
const selectedDomain = ref('');
const directEmail = ref('');
const isDirectInput = ref(false);
const isVerificationCodeSent = ref(false);
const inputCode = ref('');
const verificationFail = ref('');
const verificationSuccess = ref('');
const disableSubmit = ref(false);
const isLoading = ref(false);
const profileImageUrl = ref('C:/upload/profile.jpg');
const profileImageFile = ref(null);

// 프로필 정보를 API에서 불러오는 함수
const fetchProfile = async () => {
  try {
    const data = await auth.fetchProfile();
    Object.assign(profile, data);
  } catch (error) {
    console.error('프로필 정보 불러오기 오류:', error);
    alert('프로필 정보를 불러오는 중 오류가 발생했습니다.');
  }
};

onMounted(() => {
  fetchProfile();
});

const isPasswordValid = (password) => {
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

const changePassword = async () => {
  if (isPasswordValid(newPassword.value)) {
    try {
      await auth.changePassword(newPassword.value);
      alert('비밀번호가 변경되었습니다.');
    } catch (error) {
      console.error('비밀번호 변경 중 오류:', error);
      alert('비밀번호 변경 중 오류가 발생했습니다.');
    }
  } else {
    alert('비밀번호가 안전하지 않습니다.');
  }
};

// 이메일 도메인 리스트
const allowedDomains = ['gmail.com', 'naver.com', 'daum.net'];

// 이메일 도메인 처리
const handleDomainChange = () => {
  isDirectInput.value = selectedDomain.value === '직접입력';
  if (!isDirectInput.value) {
    profile.email = `${profile.email.split('@')[0]}@${selectedDomain.value}`;
    directEmail.value = '';
  }
};

// 직접 입력된 이메일 처리
const updateDirectEmail = () => {
  if (isDirectInput.value && !profile.email.includes('@')) {
    profile.email += '@';
  }
  if (directEmail.value.includes('@')) {
    directEmail.value = directEmail.value.replace('@', '');
  }
  if (isDirectInput.value) {
    profile.email = `${profile.email.split('@')[0]}@${directEmail.value}`;
  }
};

// 프로필 이미지 업데이트
const updateImage = (event) => {
  const file = event.target.files[0];
  if (file) {
    profileImageFile.value = file;
    const reader = new FileReader();
    reader.onload = e => {
      profileImageUrl.value = e.target.result;
    };
    reader.readAsDataURL(file);
  }
};

const sendVerificationCode = async () => {
  if (!member.email) {
    console.log('이메일이 입력되지 않았습니다.');
    return alert('이메일을 입력해 주세요.');
  }

  try {
    isLoading.value = true;
    console.log('이메일 중복 확인 시작:', member.email);

    // 이메일 중복 확인
    const isEmailExists = await auth.checkEmailDuplicate(member.email);
    console.log('이메일 중복 확인 결과:', isEmailExists);

    // 이메일이 존재하면 코드 발송 중단
    if (isEmailExists) {
      console.log('이미 존재하는 이메일입니다.');
      alert('이미 존재하는 이메일입니다.');
      isLoading.value = false;
      return; // 중복 확인되면 코드 발송 중단
    }

    // 중복되지 않은 경우 인증 코드 발송
    console.log('이메일 중복이 없음. 인증 코드 발송 시도.');
    const result = await auth.sendEmailVerification(member.email);
    console.log('인증 코드 발송 성공:', result);
    
    isVerificationCodeSent.value = true;
    alert('인증 코드가 발송되었습니다. 이메일을 확인하고 인증 코드를 입력해 주세요.');
  } catch (error) {
    console.log('인증 코드 전송 중 오류 발생:', error);
    alert('인증 코드 전송 중 오류가 발생했습니다.');
  } finally {
    console.log('인증 코드 발송 프로세스 종료.');
    isLoading.value = false;
  }
};

const verifyCode = async () => {
  if (!inputCode.value) {
    return alert('인증 코드를 입력해 주세요.');
  }

  try {
    isLoading.value = true;
    const result = await auth.verifyEmailCode(member.email, inputCode.value);
    
    if (result) {
      verificationSuccess.value = '이메일 인증이 완료되었습니다.';
      verificationFail.value = '';
      isVerifiedEmail.value = true;
    } else {
      verificationFail.value = '인증 코드가 올바르지 않습니다.';
      verificationSuccess.value = '';
      isVerifiedEmail.value = false;
    }
  } catch (error) {
    alert('인증 코드 확인 중 오류가 발생했습니다.');
    console.error('인증 코드 확인 오류:', error);
    verificationFail.value = '인증 코드 확인 중 오류가 발생했습니다.';
    isVerifiedEmail.value = false;
  } finally {
    isLoading.value = false;
  }
};

// 프로필 저장
const saveProfile = async () => {
  const formData = new FormData();
  formData.append('profileImage', profileImageFile.value);
  formData.append('password', password.value);
  formData.append('newPassword', newPassword.value);
  formData.append('email', profile.email);

  try {
    const response = await apiInstance.post('/member/info', formData);
    if (response.data.success) {
      alert('프로필이 성공적으로 업데이트되었습니다.');
    }
  } catch (error) {
    console.error('프로필 업데이트 오류:', error);
    alert('프로필 업데이트 중 오류가 발생했습니다.');
  }
};

// 프로필 이미지 삭제
const deleteImage = () => {
  profileImageUrl.value = 'C:/upload/profile.jpg';// 기본 이미지로 리셋
  profileImageFile.value = null; // 파일 데이터 초기화
};

</script>

<template>
  <div class="flex justify-center">
    <div class="w-1/3 px-16 py-10 bg-white border rounded-lg shadow">
      <div class="mb-5 font-bold text-2xl text-blue ">
        <div>프로필을 수정하세요</div>
      </div>
    
      <form @submit.prevent="saveProfile">
        <!-- 프로필 이미지 섹션 -->
        <div class="profile-image-section relative flex justify-center">
          <img :src="profileImageUrl" alt="프로필 이미지" class="profile-image" />
          
          <!-- 수정/삭제 버튼 -->
          <div class="absolute bottom-0 right-0 flex space-x-2">
            <button @click="() => $refs.profileImageInput.click()" class="btn-edit-image">수정</button>
            <button @click="deleteImage" class="btn-delete-image">삭제</button>
          </div>

          <input type="file" @change="updateImage" class="hidden" ref="profileImageInput" />
        </div>

        <!-- 이름 -->
        <div class="relative mb-6">
          <input
            v-model="profile.memberName"
            type="text"
            class="bg-gray border border-gray-300 text-gray-900 text-sm rounded-xl focus:ring-blue-500 focus:border-blue-500 block w-full p-4"
            placeholder="이름"
            readonly />
        </div>

        <!-- 아이디 (읽기 전용) -->
        <div class="relative mb-6">
          <input
            v-model="profile.memberId"
            type="text"
            class="bg-gray border border-gray-300 text-gray-900 text-sm rounded-xl focus:ring-blue-500 focus:border-blue-500 block w-full p-4"
            placeholder="아이디"
            readonly />
        </div>

        <!-- 비밀번호 -->
        <div class="relative mb-6">
          <label for="password" class="block mb-2 text-sm font-medium text-gray-900">현재 비밀번호</label>
          <input
            v-model="password"
            type="password"
            class="bg-gray border border-gray-300 text-gray-900 text-sm rounded-xl focus:ring-blue-500 focus:border-blue-500 block w-full p-4"
            placeholder="현재 비밀번호"
          />
          <button @click="verifyPassword" class="mt-2 px-4 py-2 bg-navy text-white rounded-lg">확인</button>
        </div>

        <!-- 새 비밀번호 -->
        <div v-if="isPasswordVerified" class="relative mb-6">
          <label for="newPassword" class="block mb-2 text-sm font-medium text-gray-900">새 비밀번호</label>
          <input
            v-model="newPassword"
            type="password"
            class="bg-gray border border-gray-300 text-gray-900 text-sm rounded-xl focus:ring-blue-500 focus:border-blue-500 block w-full p-4"
            placeholder="새 비밀번호"
          />
          <span v-if="!isPasswordValid(newPassword)" class="text-red-500">비밀번호가 안전하지 않습니다.</span>
          <button @click="changePassword" :disabled="!isPasswordValid(newPassword)" class="mt-2 px-4 py-2 bg-navy text-white rounded-lg">수정</button>
        </div>

        <!-- 생년월일 (읽기 전용) -->
        <div class="mb-6">
          <label for="birthDay" class="block mb-2 text-sm font-medium text-gray-900">생년월일</label>
          <input 
            v-model="profile.birthDay" 
            type="date" 
            class="bg-gray border border-gray-300 text-gray-900 text-sm rounded-xl focus:ring-blue-500 focus:border-blue-500 block p-4"
            readonly />
        </div>

        <!-- 이메일 및 인증 코드 발송 -->
        <div class="mb-6 flex flex-col">
          <div class="flex items-center">
            <input
              v-model="profile.email"
              type="email"
              class="bg-gray border border-gray-300 text-gray-900 text-sm rounded-l-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-4"
              placeholder="이메일"
              required
            />
            <select v-model="selectedDomain" @change="handleDomainChange"
              class="border border-gray-300 rounded-r-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500 block p-3">
              <option value="">도메인 선택</option>
              <option v-for="domain in allowedDomains" :key="domain" :value="domain">{{ domain }}</option>
              <option value="직접입력">직접 입력</option>
            </select>
            <button @click="sendVerificationCode" class="cursor-pointer ml-2 px-2 my-2 bg-navy text-white rounded-lg text-sm">
              인증 코드 전송
            </button>
          </div>
          <input 
            v-if="isDirectInput" 
            type="text" 
            class="mt-2 border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500" 
            placeholder="직접 도메인을 입력해 주세요" 
            v-model="directEmail" 
            @input="updateDirectEmail" 
          />
        </div>

        <!-- 인증 코드 입력 -->
        <div v-if="isVerificationCodeSent" class="mt-2">
          <input
            v-model="inputCode"
            type="text"
            placeholder="인증 코드를 입력해 주세요"
            class="border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button @click="verifyCode" class="cursor-pointer ml-2 px-2 my-2 bg-navy text-white rounded-lg text-sm">
            인증 코드 확인
          </button>
          <div v-if="verificationFail" class="text-red-500">{{ verificationFail }}</div>
          <div v-if="verificationSuccess" class="text-green-500">{{ verificationSuccess }}</div>
        </div>

        <button
          type="submit"
          class="cursor-pointer w-full bg-navy text-white py-1 rounded-xl flex justify-center items-center">
          <span class="ml-2">프로필 저장하기</span>
        </button>
      </form>
    </div>

    <div class="text-center mt-4">
      <div class="inline-block p-3 bg-navy text-white rounded-lg">
        <router-link to="/mypage/asset">연결된 자산 보기</router-link>
      </div>
    </div>
  </div>
</template>

<style scoped>
.profile-image {
  @apply w-72 h-72 rounded-full border-2 border-gray-200 mb-2;
}

.btn-edit-image {
  @apply bg-gray-200 text-sm px-3 py-1 rounded hover:bg-gray-300;
}

.text-blue {
  color: #0B1573;
}

.bg-navy {
  background-color: #0B1573;
}
</style>


<style scoped>
.profile-image {
  @apply w-72 h-72 rounded-full border-2 border-gray-200 mb-2;
}

.btn-edit-image {
  @apply bg-gray-200 text-sm px-3 py-1 rounded hover:bg-gray-300;
}

.text-blue {
  color: #0B1573;
}

.bg-navy {
  background-color: #0B1573;
}
</style>
