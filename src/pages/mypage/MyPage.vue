<script setup>
import { reactive, ref, onMounted, computed } from 'vue';
import { useAuthStore } from '@/stores/auth.js';
import { useMemberStore } from '@/stores/member.js';
import apiInstance from '@/util/axios-instance';

const auth = useAuthStore();
const memberStore = useMemberStore();

const profile = reactive({
  memberId: '',
  memberName: '',
  socialType: '',
  email: '',
  birthday: '',
  imageUrl: '',
});

const isSocialLogin = ref(false);
const selectedImage = ref(null);

const password = ref('');
const newPassword = ref('');
const confirmNewPassword = ref('');
const isPasswordStrong = ref(false);
const isPasswordVerified = ref(false);
const isPasswordMatch = ref(false);

const isEditingEmail = ref(false);
const isVerificationCodeSent = ref(false);
const inputCode = ref('');
const verificationFail = ref('');
const verificationSuccess = ref('');
const isVerifiedEmail = ref(false);
const isEmailChanged = ref(false);

const isLoading = ref(false);

onMounted(async () => {
  await fetchProfile();
});

// 프로필 정보를 API에서 불러오는 함수
const fetchProfile = async () => {
  isLoading.value = true; // 로딩 시작
  try {
    const profileData = await memberStore.getProfile();
    profile.memberId = profileData.memberId;
    profile.memberName = profileData.memberName;
    profile.birthday = profileData.birthday;
    profile.socialType = profileData.socialType;
    profile.email = profileData.email;
    const imageUrl = `https://fingertips-bucket-local.s3.ap-northeast-2.amazonaws.com/${profileData.imageUrl}`;
    profile.imageUrl = imageUrl;

    if (profile.socialType === 'GOOGLE') {
      isSocialLogin.value = true;
    }
  } catch (error) {
    console.log(error);
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
  if (enhancedSecurityPassword(newPassword.value)) {
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
    const authStore = useAuthStore();
    const response = await apiInstance.post(
      '/member/verification/password',
      {
        inputPassword: password.value,
      },
      {
        headers: {
          Authorization: authStore.member.accessToken,
        },
      }
    );
    if (response.data.success) {
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
    const authStore = useAuthStore();
    const response = await apiInstance.post(
      '/member/verification/newPassword',
      {
        memberId: authStore.member.memberId,
        newPassword: newPassword.value,
      },
      {
        headers: {
          Authorization: authStore.member.accessToken,
        },
      }
    );
    if (response.data.success) {
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
};
const sendVerificationCode = async () => {
  if (!profile.email) {
    return alert('이메일을 입력해 주세요.');
  }

  // 이메일 유효성 검사
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(profile.email)) {
    return alert(
      '유효하지 않은 이메일 형식입니다. 올바른 이메일을 입력해 주세요.'
    );
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
    alert(
      '인증 코드가 해당 이메일로 발송되었습니다. 인증 코드를 입력해 이메일 변경을 완료해주세요.'
    );
  } catch (error) {
    console.log('인증 코드 전송 중 오류 발생:', error);
    alert('인증 코드 전송 중 오류가 발생했습니다.');
  } finally {
    isLoading.value = false;
  }
};
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
    verificationFail.value = '인증 코드가 일치하지 않습니다.';
    isVerifiedEmail.value = false;
  } finally {
    isLoading.value = false;
  }
};
const saveEmail = async () => {
  console.log('이메일', profile.email);
  console.log('isVerifiedEmail', isVerifiedEmail.value);
  console.log('isEmailChanged', isEmailChanged.value);
  if (!isVerifiedEmail.value) {
    return alert('이메일 인증을 완료해 주세요.');
  }
  try {
    const authStore = useAuthStore();
    const response = await apiInstance.post(
      '/member/email',
      {
        newEmail: profile.email,
      },
      {
        headers: {
          Authorization: authStore.member.accessToken,
        },
      }
    );
    if (response.data.success) {
      isEmailChanged.value = true;
      console.log('이메일', profile.email);
      console.log('isVerifiedEmail', isVerifiedEmail.value);
      console.log('isEmailChanged', isEmailChanged.value);
      console.log(profile.email);
      alert('이메일이 성공적으로 변경되었습니다.');
      setTimeout(() => {
        window.location.reload();
      }, 2000);
    } else {
      alert('이메일 변경에 실패하였습니다.');
    }
  } catch (error) {
    console.error('이메일 변경 중 오류 발생:', error);
    alert('이메일 변경 중 오류가 발생했습니다.');
  }
};

// 이미지
const uploadImage = async (event) => {
  const file = event.target.files[0];
  console.log('Selected Image:', file);
  if (!file) {
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
    const authStore = useAuthStore();
    const response = await apiInstance.post(`/member/image`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
        Authorization: authStore.member.accessToken,
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
  try {
    const authStore = useAuthStore();
    const response = await apiInstance.delete(`/member/image`, {
      params: {
        fileUrl: profileImage,
      },
      headers: {
        Authorization: authStore.member.accessToken,
      },
    });
    console.log('Response Data:', response.data);
    if (response.data.success) {
      profile.imageUrl = 'basic.jpg';
      await fetchProfile();
    }
  } catch (error) {
    console.error('파일 삭제 실패');
  }
};
</script>

<template>
  <div class="mx-[20%] lg:mx-[35%]">
    <div class="px-16 py-10 bg-white border rounded-xl shadow">
      <div class="mb-5 font-bold text-2xl text-blue">
        <div>나만의 프로필을</div>
        <div>완성해보세요</div>
      </div>

      <div>
      <div class="profile-image-section flex flex-col items-center">
        <img :src="profile.imageUrl" alt="P" class="w-40 h-40 rounded-full" />

        <div class="flex space-x-2">
          <button @click="() => $refs.profileImageInput.click()">
            
            <font-awesome-icon :icon="['fas', 'pen']" style="color: #0b1573;" />
          </button>

          <button @click="deleteImage(profile.imageUrl)"
            :disabled="profile.imageUrl === 'https://fingertips-bucket-local.s3.ap-northeast-2.amazonaws.com/basic.jpg'">
            기본 이미지로 변경
          </button>
        </div>
        <input type="file" @change="uploadImage" class="hidden" ref="profileImageInput" />
      </div>

      <!-- <div>{{ profile.memberName }}</div>

      <div class="relative mb-6">
        <label for="memberId" class="block mb-2 text-sm font-medium text-gray-900">아이디</label>
        <input v-model="profile.memberId" type="text"
          class="bg-gray border border-gray-300 text-gray-900 text-sm rounded-xl focus:ring-blue-500 focus:border-blue-500 block w-full p-4"
          placeholder="아이디" readonly autocomplete="username" />
      </div>

      <label for="password" class="block mb-2 text-sm font-medium text-gray-900">현재 비밀번호</label>
      <div class="relative mb-6 flex items-center space-x-3">
        <input v-model="password" type="password" autocomplete="current-password"
          class="bg-gray border border-gray-300 text-gray-900 text-sm rounded-xl focus:ring-blue-500 focus:border-blue-500 block w-full p-4"
          placeholder="현재 비밀번호" :disabled="isSocialLogin" />
        <button @click.prevent="verifyPassword" class="mt-7 px-4 py-1 bg-navy text-white rounded-xl text-sm"
          :disabled="isSocialLogin">
          확인
        </button>
      </div>

      <div v-if="isPasswordVerified" class="relative mb-6">
        <label for="newPassword" class="block mb-2 text-sm font-medium text-gray-900">새 비밀번호</label>
        <input v-model="newPassword" type="password" autocomplete="new-password" id="newPassword"
          class="bg-gray border border-gray-300 text-gray-900 text-sm rounded-xl focus:ring-blue-500 focus:border-blue-500 block w-full ps-10 p-4"
          placeholder="새 비밀번호" @input="checkPasswordStrength" required />
        <p v-if="isPasswordStrong === true" class="text-green-500">
          비밀번호가 강합니다.
        </p>
        <p v-else-if="isPasswordStrong == false && newPassword.length > 0" class="text-red-500">
          비밀번호가 약합니다.
        </p>
        <p v-else-if="isPasswordStrong == false && newPassword.length === 0" class="text-red-500">
          대소문자, 숫자, 특수문자를 모두 포함한 8글자 이상이어야 합니다.
        </p>
      </div>

      <div v-if="isPasswordVerified" class="relative mb-6">
        <label for="confirmNewPassword" class="block mb-2 text-sm font-medium text-gray-900">새 비밀번호 확인</label>
        <input v-model="confirmNewPassword" type="password" autocomplete="new-password" id="confirmNewPassword"
          class="bg-gray border border-gray-300 text-gray-900 text-sm rounded-xl focus:ring-blue-500 focus:border-blue-500 block w-full p-4"
          placeholder="새 비밀번호 확인" @input="checkPasswordConfirmation" />
        <p v-if="isPasswordMatch === true" class="text-green-500">
          비밀번호가 일치합니다.
        </p>
        <p v-else-if="isPasswordMatch === false && confirmNewPassword.length > 0" class="text-red-500">
          비밀번호가 일치하지 않습니다.
        </p>
      </div>

      <div v-if="isPasswordVerified" class="flex justify-center mt-6">
        <button @click="changePassword" class="mt-2 px-4 py-2 bg-navy text-white rounded-lg"
          :disabled="!isPasswordStrong || newPassword !== confirmNewPassword">
          비밀번호 변경
        </button>
      </div>

      <div class="mb-6">
        <label for="birthDay" class="block mb-2 text-sm font-medium text-gray-900">생년월일</label>
        <input :value="formattedBirthDay" type="date"
          class="bg-gray border border-gray-300 text-gray-900 text-sm rounded-xl focus:ring-blue-500 focus:border-blue-500 block w-full p-4"
          readonly />
      </div>

      <div class="mb-4 flex flex-col">
        <label for="email" class="block mb-2 text-sm font-medium text-gray-900">이메일</label>
        <div class="relative mb-6 flex items-center space-x-3">
          <input v-model="profile.email" type="text"
            class="bg-gray border border-gray-300 text-gray-900 text-sm rounded-xl focus:ring-blue-500 focus:border-blue-500 block w-full p-4"
            placeholder="이메일" :readonly="!isEditingEmail" />
          <button @click.prevent="editEmail" class="mt-7 px-4 py-1 bg-navy text-white rounded-lg text-sm"
            :disabled="isSocialLogin">
            수정
          </button>
          <button v-if="isEditingEmail" @click="sendVerificationCode"
            class="cursor-pointer ml-2 px-2 my-2 bg-navy text-white rounded-lg text-sm">
            인증 코드 전송
          </button>
        </div>
      </div>

      <div v-if="isVerificationCodeSent" class="mt-2">
        <input v-model="inputCode" type="text" placeholder="인증 코드를 입력해 주세요"
          class="border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500" />
        <button @click="verifyCode" class="cursor-pointer ml-2 px-2 my-2 bg-navy text-white rounded-lg text-sm"
          :disabled="isVerifiedEmail">
          인증 코드 확인
        </button>
        <div v-if="verificationFail" class="text-red-500">
          {{ verificationFail }}
        </div>
        <div v-if="verificationSuccess" class="text-green-500">
          {{ verificationSuccess }}
        </div>

        <button @click="saveEmail"
          class="cursor-pointer w-1/2 bg-navy text-white py-1 rounded-xl flex justify-center items-center"
          :disabled="isEmailChanged">
          <span class="ml-2">이메일 변경 완료하기</span>
        </button>
      </div>

      <div class="text-center mt-4">
        <div class="inline-block p-3 bg-navy text-white rounded-lg">
          <router-link to="/mypage/asset">연결된 자산 보기</router-link>
        </div>
      </div> -->
    </div>
    </div>
  </div>
</template>

<style scoped>
.btn-edit-image {
  @apply bg-gray-200 text-sm px-3 py-1 rounded hover:bg-gray-300;
}

.text-blue {
  color: rgb(11, 21, 115);
}

.bg-navy {
  background-color: #0b1573;
}
</style>
