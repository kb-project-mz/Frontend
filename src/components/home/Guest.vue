<script setup>
import Button from "@/components/home/Button.vue";
import testImage from "@/assets/테스트.png";
import chartImage from "@/assets/차트.png";
import challengeImage from "@/assets/챌린지.png";

const alertLogin = () => {
  alert("로그인해야 이용할 수 있는 서비스입니다.");
}
</script>

<template>
  <div>
    <div class="max-w-7.5xl mx-auto flex font-jamsil">
      <div class="text-left">
        <p class="text-7xl font-black text-transparent blue mt-10 mb-6 font-jamsil">
          MZ 세대인 당신,
        </p>
        <span class="text-7xl font-bold blue mb-6"></span>
        <span class="text-7xl font-bold blue mb-6">&nbsp;&nbsp;&nbsp;지금 당신의 </span>
        <span class="text-7xl font-black text-transparent stroke">자산</span>
        <p class="text-7xl font-bold blue ml-48 mt-6 mb-52 font-jamsil">안녕하신가요?</p>
      </div>
    </div>

    <!-- 버튼 -->
    <div class="max-w-7.5xl mx-auto space-x-12 flex font-jamsil">
      <Button
        :img-src="testImage"
        :router-to="{ name: 'testStart' }"
        text-above="소비 심리"
        text-below="테스트"
      />

      <Button
        @click="alertLogin"
        :img-src="chartImage"
        :router-to="{ name: 'homePage' }"
        text-above="나의 소비"
        text-below="습관 분석"
      />

      <Button
        @click="alertLogin"
        :img-src="challengeImage"
        :router-to="{ name: 'homePage' }"
        text-above="돈과의 전쟁"
        text-below="챌린지의 서막"
      />

      <span class="flex-grow text-right">
        <div class="text-5xl font-bold blue mb-4">즐겁게</div>
        <div class="text-5xl font-bold blue mb-4">똑똑하게</div>
        <div class="text-5xl font-bold blue">나를 들여다 보는 방법</div>
      </span>
    </div>
  </div>
</template>

<style setup>
@font-face {
    font-family: 'TheJamsil5Bold';
    src: url('https://fastly.jsdelivr.net/gh/projectnoonnu/noonfonts_2302_01@1.0/TheJamsil5Bold.woff2') format('woff2');
    font-weight: 700;
    font-style: normal;
}
.font-jamsil {
    font-family: 'TheJamsil5Bold', sans-serif; /* sans-serif 대체 폰트 추가 */
}
</style>
