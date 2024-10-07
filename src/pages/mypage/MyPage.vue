<script setup>
import { reactive, ref, onMounted, computed } from 'vue';
import { useAuthStore } from "@/stores/auth.js";
import apiInstance from '@/util/axios-instance';

const auth = useAuthStore(); 

const profile = reactive({
  memberId: '',
  memberName: '',
  email: '',
  birthday: '',
  imageUrl: '',
});

const selectedImage = ref(null);

const password = ref('');
const newPassword = ref('');
const confirmNewPassword = ref('');
const isPasswordStrong = ref(false);
const isPasswordVerified = ref(false);
const isPasswordMatch = ref(false); 

const allowedDomains = ['gmail.com', 'naver.com', 'daum.net'];
const selectedDomain = ref('');
const isDirectInputEmail = ref(false); // 직접입력 여부
const isEditingEmail = ref(false);
const inputDomain = ref('');

const emailId = ref('');
const currDomain = ref('');
const currEmail = ref('');

const isVerificationCodeSent = ref(false);
const inputCode = ref('');
const verificationFail = ref('');
const verificationSuccess = ref('');
const isVerifiedEmail = ref(false);

const isLoading = ref(false);

onMounted( async () => {
  await fetchProfile();
});

// 프로필 정보를 API에서 불러오는 함수
const fetchProfile = async () => {
  try {
    const profileData = await auth.getProfile();
    profile.memberId = profileData.memberId;
    profile.memberName = profileData.memberName;
    profile.birthday = profileData.birthday;
    profile.email = profileData.email;
    currEmail.value = profileData.email;
    console.log('현재 이메읾ㅁㅁㅁ', currEmail.value);
    emailId.value = profileData.email.split('@')[0];
    currDomain.value = profileData.email.split('@')[1];
    const imageUrl = `https://fingertips-bucket-local.s3.ap-northeast-2.amazonaws.com/${profileData.imageUrl}`;
    profile.imageUrl = imageUrl;
    console.log('이메일ㄹㄹㄹ',profile.email);
  } catch (error) {
    alert('프로필 정보를 불러오는 중 오류가 발생했습니다.');
  }
};
// 생일
 const formattedBirthDay = computed(() => {
      if (!profile.birthday) return ''; 
      const date = new Date(profile.birthday);
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const day = String(date.getDate()).padStart(2, '0');
      return `${year}-${month}-${day}`;
    });

// 비밀번호
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
  if(enhancedSecurityPassword(newPassword.value)){
    isPasswordStrong.value = true;
  } else {
    isPasswordStrong.value = false;
  }
};
const checkPasswordConfirmation = () => {
  if (newPassword.value === confirmNewPassword.value) {
    isPasswordMatch.value = true;
  } else {
    isPasswordMatch.value = false;
  }
};
const verifyPassword = async () => {
  if (!password.value) {
    return alert('비밀번호를 입력해주세요.');
  }
  try {
    const response = await apiInstance.post('/member/verification/password', {
      inputPassword: password.value,
    }, {
      headers: { Authorization: localStorage.getItem("accessToken") }
    }
  );
    if(response.data.success){
      alert('비밀번호 인증 성공');
      isPasswordVerified.value = true;
    } else {
      alert('비밀번호 인증 실패');
    }
  } catch (error) {
    alert('기존의 비밀번호와 같지 않습니다.');
  }
};
const changePassword = async () => {
  try {
    const response = await apiInstance.post('/member/verification/newPassword', {
      memberId: localStorage.getItem("memberId"),
      newPassword: newPassword.value,
    }, {
      headers: { Authorization: localStorage.getItem("accessToken") }
    }
  );
    if(response.data.success){
      alert('비밀번호가 성공적으로 변경되었습니다.');
    } else {
      alert('이전과 같은 비밀번호는 사용하실 수 없습니다.');
    }
  } catch (error) {
    alert('이전과 같은 비밀번호는 사용하실 수 없습니다.');
  }
};

// 이메일
const editEmail = () => {
  isEditingEmail.value = !isEditingEmail.value;
}
const handleDomainChange = () => {
  if (selectedDomain.value === '직접입력') {
      isDirectInputEmail.value == true;
      profile.email += profile.email.split('@')[0];
      console.log("직접입력 도메인 선택됨, 현재 이메일 ID: ", profile.email);
  } else { 
      isDirectInputEmail.value = false;
      profile.email = `${emailId.value('@')[0]}@${selectedDomain.value}`; 
      console.log("도메인 선택됨, 전체 이메일: ", profile.email);
  } 
};

// 직접 입력
const updateInputDomain = () => {
 if (isDirectInputEmail.value && inputDomain.value) {
  profile.email = `${emailId.value('@')[0]}@${inputDomain.value}`;
  console.log("직접 입력 도메인 사용 중, 전체 이메일: ", profile.email);
 }
};

// 이메일 중복 확인 및 인증 코드 발송
const sendVerificationCode = async () => {
  if (!profile.email) {
    return alert('이메일을 입력해 주세요.');
  }
  try {
    isLoading.value = true;
    const isEmailExists = await auth.checkEmailDuplicate(profile.email);
    console.log('이메일 중복 확인 결과:', isEmailExists);
    if (isEmailExists) {
      alert('이미 존재하는 이메일입니다.');
      isLoading.value = false;
      return; 
    }
    console.log('이메일 중복이 없음. 인증 코드 발송 시도.');
    const result = await auth.sendEmailVerification(profile.email);
    console.log('인증 코드 발송 성공:', result);

    isVerificationCodeSent.value = true;
    alert('인증 코드가 발송되었습니다. 이메일을 확인하고 인증 코드를 입력해 주세요.');
  } catch (error) {
    console.log('인증 코드 전송 중 오류 발생:', error);
    alert('인증 코드 전송 중 오류가 발생했습니다.');
  } finally {
    isLoading.value = false;
  }
};

// 인증 코드 검증
const verifyCode = async () => {
  if (!inputCode.value) {
    return alert('인증 코드를 입력해 주세요.');
  }

  try {
    isLoading.value = true;
    const result = await auth.verifyEmailCode(profile.email, inputCode.value);

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
    console.error('인증 코드 확인 오류:', error);
    verificationFail.value = '인증 코드 확인 중 오류가 발생했습니다.';
    isVerifiedEmail.value = false;
  } finally {
    isLoading.value = false;
  }
};
// 이미지 
const uploadImage = async (event) => {
  const file = event.target.files[0];
  console.log('Selected Image:', file);
  if(!file) {
    alert('이미지를 선택해주세요.');
    return;
  }
  selectedImage.value = file;
  const previewUrl = URL.createObjectURL(file);
  profile.imageUrl = previewUrl; 
  const formData = new FormData();
  formData.append('file', selectedImage.value);
  alert('업로드 하시겠습니까?');
  try {
    const response = await apiInstance.post(`/member/image`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
        'Authorization': localStorage.getItem("accessToken")
      },
    });

    if (response.data.success) {
      alert('이미지 업로드에 성공했습니다.');
      const imageUrl = `https://fingertips-bucket-local.s3.ap-northeast-2.amazonaws.com/${response.data.data.storeFileName}`;
      profile.imageUrl = imageUrl; 
      Object.assign(profile, { imageUrl: imageUrl });
      await fetchProfile(); 
    }
  } catch (error) {
    console.error('이미지 업로드 실패:', error);
    alert('이미지 업로드에 실패하셨습니다.');
  }
};
const deleteImage = async (profileImage) => {
  alert('삭제 하시겠습니까? 삭제하시면 기본 이미지로 변경됩니다.');
  console.log('지울 이미지ㅣㅣㅣㅣㅣㅣㅣㅣㅣㅣㅣ', profileImage);
  try {
    const response = await apiInstance.delete(`/member/image`, {
      params: {
        fileUrl: profileImage
      },
      headers: {
        'Authorization': localStorage.getItem("accessToken")
      }
    });
    console.log('Response Data:', response.data); // 서버 응답 로그 추가
    if(response.data.success){
      profile.imageUrl = "basic.jpg";
      await fetchProfile(); 
    }
  } catch (error) {
    console.error('파일 삭제 실패');
  }
};


</script>

<template>
  <div class="flex justify-center">
    <div class="w-1/3 px-16 py-10 bg-white border rounded-lg shadow">
      <div class="mb-5 font-bold text-2xl text-blue ">
        <div>나만의 프로필을 완성해보세요</div>
      </div>
    
      <form @submit.prevent="saveProfile">
        <!-- 프로필 이미지 섹션 -->
        <div class="profile-image-section relative flex justify-center">
          <img :src="profile.imageUrl" alt="Profile Image" class="profile-image" />
          
          <div class="absolute bottom-0 right-0 flex space-x-2">
            <button @click="() => $refs.profileImageInput.click()" class="btn-edit-image">수정</button>
            
            <button 
              @click="deleteImage(profile.imageUrl)" 
              class="btn-delete-image" 
              :disabled="profile.imageUrl === 'https://fingertips-bucket-local.s3.ap-northeast-2.amazonaws.com/basic.jpg'">
              삭제
            </button>
          </div>
          <input type="file" @change="uploadImage" class="hidden" ref="profileImageInput" />
        </div>

        <!-- 이름 (읽기 전용) -->
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

        <!-- 현재 비밀번호 검증 -->
        <div class="relative mb-6">
          <label for="password" class="block mb-2 text-sm font-medium text-gray-900">현재 비밀번호</label>
          <input
            v-model="password"
            type="password"
            class="bg-gray border border-gray-300 text-gray-900 text-sm rounded-xl focus:ring-blue-500 focus:border-blue-500 block w-full p-4"
            placeholder="현재 비밀번호"
          />
          <button @click.prevent="verifyPassword" class="mt-2 px-4 py-2 bg-navy text-white rounded-lg">확인</button>
        </div>

        <!-- 새 비밀번호 -->
        <div v-if="isPasswordVerified" class="relative mb-6">
          <label for="newPassword" class="block mb-2 text-sm font-medium text-gray-900">새 비밀번호</label>
            <input
              v-model="newPassword"
              type="password"
              id="newPassword"
              class="bg-gray border border-gray-300 text-gray-900 text-sm rounded-xl focus:ring-blue-500 focus:border-blue-500 block w-full ps-10 p-4"
              placeholder="새 비밀번호"
              @input="checkPasswordStrength"
              required />
              <p v-if="isPasswordStrong === true" class="text-green-500">비밀번호가 강합니다.</p>
              <p v-else-if="isPasswordStrong == false && newPassword.length > 0" class="text-red-500">비밀번호가 약합니다.</p>
              <p v-else-if="isPasswordStrong == false && newPassword.length === 0" class="text-red-500">대소문자, 숫자, 특수문자를 모두 포함한 8글자 이상이어야 합니다.</p>
        </div>

        <!-- 새 비밀번호 확인 -->
        <div v-if="isPasswordVerified" class="relative mb-6">
          <label for="confirmNewPassword" class="block mb-2 text-sm font-medium text-gray-900">새 비밀번호 확인</label>
            <input
              v-model="confirmNewPassword"
              type="password"
              id="confirmNewPassword"
              class="bg-gray border border-gray-300 text-gray-900 text-sm rounded-xl focus:ring-blue-500 focus:border-blue-500 block w-full p-4"
              placeholder="새 비밀번호 확인"
              @input="checkPasswordConfirmation" /> 
              <p v-if="isPasswordMatch === true" class="text-green-500">비밀번호가 일치합니다.</p>
              <p v-else-if="isPasswordMatch === false && confirmNewPassword.length > 0" class="text-red-500">비밀번호가 일치하지 않습니다.</p>
        </div>

        <!-- 비밀번호 변경 버튼 -->
        <div v-if="isPasswordVerified" class="flex justify-center mt-6">
          <button @click="changePassword" class="mt-2 px-4 py-2 bg-navy text-white rounded-lg" :disabled="!isPasswordStrong || newPassword !== confirmNewPassword">
            비밀번호 변경
          </button>
        </div>

        <!-- 생년월일 (읽기 전용) -->
        <div class="mb-6">
          <label for="birthDay" class="block mb-2 text-sm font-medium text-gray-900">생년월일</label>
          <input 
            :value="formattedBirthDay" 
            type="date" 
            class="bg-gray border border-gray-300 text-gray-900 text-sm rounded-xl focus:ring-blue-500 focus:border-blue-500 block w-full p-4"
            readonly />
        </div>

        <!-- 이메일 입력 -->
        <div class="mb-4 flex flex-col">
          <div class="relative mb-6">
            <input
              v-model="currEmail"
              type="text"
              class="bg-gray border border-gray-300 text-gray-900 text-sm rounded-xl focus:ring-blue-500 focus:border-blue-500 block w-full p-4"
              placeholder="이메일"
              readonly />
              <button @click.prevent="editEmail" class="mt-2 px-4 py-2 bg-navy text-white rounded-lg">수정</button>
          </div>
          
          <div v-if="isEditingEmail" class="flex items-center space-x-2">
            <input
              v-model="emailId"
              type="text"
              class="bg-gray border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-4"
              placeholder="이메일"
              required
            />

            <span>@</span>

            <select v-model="selectedDomain" @change="handleDomainChange"
              class="border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500 block">
              <option value="">도메인 선택</option>
              <option v-for="domain in allowedDomains" :key="domain" :value="domain">{{ domain }}</option>
              <option value="직접입력">직접 입력</option>
            </select>

            <button @click="sendVerificationCode" class="cursor-pointer ml-2 px-2 my-2 bg-navy text-white rounded-lg text-sm">
              인증 코드 전송
            </button>
          </div>

          <input 
            v-if="isDirectInputEmail" 
            type="text" 
            class="mt-2 border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500" 
            placeholder="직접 도메인을 입력해 주세요" 
            v-model="inputDomain" 
            @input="updateInputDomain" 
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

        <button @click="saveProfile" class="cursor-pointer w-full bg-navy text-white py-1 rounded-xl flex justify-center items-center">
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
