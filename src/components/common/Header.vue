<script setup></script>

<template>
  <nav class="bg-white shadow-lg p-4 rounded-xl max-w-9xl mt-4 mx-auto">
    <div class="max-w-7.5xl mx-auto flex justify-between items-center">
      <router-link to="/" class="flex items-center">
        <img src="/src/assets/로고.png" alt="Logo" class="h-8 w-auto" />
      </router-link>

      <div class="flex space-x-4">
        <a href="#" class="gray">로그인</a>
        <span class="gray">|</span>
        <a href="#" class="gray">회원가입</a>
      </div>
    </div>
  </nav>
</template>
