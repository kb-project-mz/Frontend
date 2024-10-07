<script setup>
import Button from "@/components/home/Button.vue";
import testImage from "@/assets/테스트.png";
import chartImage from "@/assets/차트.png";
import challengeImage from "@/assets/챌린지.png";
import Challenge from "@/components/home/Challenge.vue";
import { useAuthStore } from "@/stores/auth";

const authStore = useAuthStore();
// const memberIdx = computed(() => authStore.member.memberIdx);
const memberIdx = localStorage.getItem("memberIdx");
</script>

<template>
  <div class="max-w-6xl mx-auto space-x-12">
    <div class="flex justify-between">
      <div>
        <h1>[소비 테스트 결과지]</h1>
      </div>
      <div class="flex space-x-16">
        <div>
          <h1>[challenge top3]</h1>
          <Challenge />
        </div>
        <div class="flex space-x-16">
          <div>
            <h1>[Account]</h1>
            <Account />
          </div>
        </div>
      </div>
    </div>

    <div class="max-w-6xl mx-auto space-x-12 flex justify-center">
      <Button
        :img-src="testImage"
        :router-to="{ name: 'testStart' }"
        text-above="소비 심리"
        text-below="테스트"
      />

      <Button
        :img-src="chartImage"
        :router-to="{ name: 'analysis' }"
        text-above="나의 소비"
        text-below="습관 분석"
      />

      <Button
        :img-src="challengeImage"
        :router-to="{ name: 'challenge' }"
        text-above="돈과의 전쟁"
        text-below="챌린지의 서막"
      />
    </div>
  </div>
</template>

<style setup></style>
