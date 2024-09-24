<script setup>
import { ref, onMounted } from 'vue';

const id = ref(null);
const memberId = ref(null);
const memberName = ref(null);

// 컴포넌트가 마운트될 때 localStorage에서 id 값을 가져옴
onMounted(() => {
  // localStorage.setItem("id", 1);
  // localStorage.setItem("memberId", 'dlekdud0102');
  // localStorage.setItem("memberName", '이다영');

  id.value = localStorage.getItem("id");
  memberId.value = localStorage.getItem("memberId");
  memberName.value = localStorage.getItem("memberName");
});

// 로그아웃 함수 (예: id 삭제)
const logout = () => {
  localStorage.removeItem("id");
  localStorage.removeItem("memberId");
  localStorage.removeItem("memberName");
  id.value = null;
  memberId.value = null;
  membername.value = null;
};
</script>

<template>
  <nav class="bg-white shadow-lg p-4 rounded-xl max-w-9xl mt-4 mx-auto">
    <div class="max-w-7.5xl mx-auto flex justify-between items-center">
      <router-link to="/" class="flex items-center">
        <img src="/src/assets/로고.png" alt="Logo" class="h-8 w-auto" />
      </router-link>

    <div v-if="id">
      <router-link to="/mypage">
        {{ memberName }}님
      </router-link>
      <button @click="logout" class="gray">로그아웃</button>
    </div>

    <div v-else>
      <div class="flex space-x-4">
      <router-link to="/login" class="flex items-center">
        <a href="#" class="gray">로그인</a>
      </router-link>
      <span class="gray">|</span>
      <router-link to="/join" class="flex items-center">
        <a href="#" class="gray">회원가입</a>
      </router-link>
    </div>
    </div>
    </div>
  </nav>
</template>
