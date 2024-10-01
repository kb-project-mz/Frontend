<script setup>
import {ref} from 'vue';
import axios from 'axios';
import apiInstance from '@/util/axios-instance';

const fileInput = ref(null);

const uploadFile = async () => {
  const file = fileInput.value.files[0];
  if(!file) {
    alert('파일을 선택해주세요.');
    return;
  }

  const formData = new FormData();
  formData.append('profileImage', file);

  try {
    const response = await apiInstance.post(`/member/info`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    console.log('파일 업로드 성공');
    alert('파일 업로드 성공');
  } catch (error) {
    console.error('파일 업로드 실패:', error);
    alert('파일 업로드 실패!');
  }
}
</script>

<template>
  <div class="text-center">
    <div class="inline-block p-3 bg-navy text-white rounded-lg">
      <router-link to="/mypage/asset">연결된 자산 보기</router-link>
    </div>
    <form @submit.prevent="uploadFile" enctype="multipart/form-data">
      <li>파일 <input type="file" name="file" ref="fileInput"> </li>
      <button type="submit" class="p-2 bg-blue-500 text-white rounded-lg"></button>
    </form>
  </div>
</template>

<style scoped>
.bg-navy {
  background-color: #0B1573;
}
</style>
