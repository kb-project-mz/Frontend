<script setup>
import Header from "@/components/common/Header.vue";
</script>

<template>
  <Header />

  <!-- 상단 글자 -->
  <div class="max-w-7.5xl mx-auto flex">
    <div class="text-left">
      <p class="text-7xl font-black text-transparent blue mt-10 mb-6">
        MZ 세대인
      </p>
      <span class="text-7xl font-black text-transparent stroke">당신, </span>
      <span class="text-7xl font-bold blue mb-6">지금 당신의 자산은</span>
      <p class="text-7xl font-bold blue ml-48 mt-6 mb-52">안녕하신가요?</p>
    </div>
  </div>

  <!-- 버튼 -->
  <div class="max-w-7.5xl mx-auto space-x-12 flex">
    <button
      class="bg-transparent hover:bg-customBlue blue font-bold hover:text-white py-14 px-16 border shadow-lg hover:border-transparent rounded whitespace-normal w-50 h-50 flex flex-col items-center justify-center"
    >
      소비 심리 <br />
      테스트
      <img src="/src/assets/테스트.png" alt="Logo" class="h-8 w-auto mt-4" />
    </button>
    <button
      class="bg-transparent hover:bg-customBlue blue font-bold hover:text-white py-14 px-16 border shadow-lg hover:border-transparent rounded whitespace-normal w-50 h-50 flex flex-col items-center justify-center"
    >
      나의 소비 <br />
      습관 분석
      <img src="/src/assets/파이차트.png" alt="Logo" class="h-8 w-auto mt-4" />
    </button>

    <button
      class="bg-transparent hover:bg-customBlue blue font-bold hover:text-white py-14 px-12 border shadow-lg hover:border-transparent rounded whitespace-normal w-50 h-50 flex flex-col items-center justify-center"
    >
      돈과의 전쟁 <br />
      챌린지의 서막
      <img src="/src/assets/챌린지.png" alt="Logo" class="h-8 w-auto mt-4" />
    </button>

    <!-- 버튼 우측 글자 -->
    <span class="flex-grow text-right">
      <div class="text-5xl font-bold blue mb-4">즐겁게</div>
      <div class="text-5xl font-bold blue mb-4">똑똑하게</div>
      <div class="text-5xl font-bold blue">나를 들여다 보는 방법</div>
    </span>
  </div>
</template>

<style setup></style>