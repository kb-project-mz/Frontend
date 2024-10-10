<script setup>
import { onMounted } from 'vue';
import { useAdminMetricsStore } from '@/stores/adminMetrics';

// Pinia 스토어 사용
const adminMetricsStore = useAdminMetricsStore();

// 컴포넌트 마운트 시 데이터를 불러옴
onMounted(() => {
  adminMetricsStore.fetchCumulativeSignUpCount();
  adminMetricsStore.fetchCumulativeLoginCount();
  adminMetricsStore.fetchCumulativeVisitCount();
  adminMetricsStore.fetchCumulativeWithdrawalCount();
  adminMetricsStore.fetchGrowthMetrics(); // 증가율 데이터 불러오기
});

// 증가율에 따라 CSS 클래스를 다르게 적용 (올라가면 파란색, 떨어지면 빨간색)
const growthClasses = (growth) => {
  return growth > 0 ? 'text-blue-500' : 'text-red-500';
};

// 증가율에 따라 화살표 아이콘을 다르게 적용 (올라가면 위쪽, 떨어지면 아래쪽)
const growthIcon = (growth) => {
  return growth > 0 ? 'fa-arrow-up' : 'fa-arrow-down';
};
</script>

<template>
  <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
    <!-- 누적 회원 수 카드 (User Sign-Ups) -->
    <div class="bg-pink-200 text-gray-800 rounded-lg shadow-md p-6 flex items-center justify-between card hover:scale-105">
      <div>
        <p class="text-sm font-semibold">회원 수</p>
        <p class="text-4xl font-bold mt-2">{{ adminMetricsStore.totalMembers }}</p>
        <p :class="growthClasses(adminMetricsStore.growthMetrics.signUpGrowth)">
          <i :class="`fas ${growthIcon(adminMetricsStore.growthMetrics.signUpGrowth)}`"></i>
          {{ adminMetricsStore.growthMetrics.signUpGrowth.toFixed(1) }}%
        </p>
      </div>
      <div>
        <i class="fas fa-user h-16 w-16 text-pink-500"></i>
      </div>
    </div>

    <!-- 누적 방문자 수 카드 (Visitors) -->
    <div class="bg-blue-200 text-gray-800 rounded-lg shadow-md p-6 flex items-center justify-between card hover:scale-105">
      <div>
        <p class="text-sm font-semibold">방문자 수</p>
        <p class="text-4xl font-bold mt-2">{{ adminMetricsStore.totalVisitors }}</p>
        <p :class="growthClasses(adminMetricsStore.growthMetrics.visitGrowth)">
          <i :class="`fas ${growthIcon(adminMetricsStore.growthMetrics.visitGrowth)}`"></i>
          {{ adminMetricsStore.growthMetrics.visitGrowth.toFixed(1) }}%
        </p>
      </div>
      <div>
        <i class="fas fa-eye h-16 w-16 text-blue-500"></i>
      </div>
    </div>

    <!-- 누적 로그인 수 카드 (Logins) -->
    <div class="bg-purple-200 text-gray-800 rounded-lg shadow-md p-6 flex items-center justify-between card hover:scale-105">
      <div>
        <p class="text-sm font-semibold">로그인 수</p>
        <p class="text-4xl font-bold mt-2">{{ adminMetricsStore.totalLogins }}</p>
        <p :class="growthClasses(adminMetricsStore.growthMetrics.loginGrowth)">
          <i :class="`fas ${growthIcon(adminMetricsStore.growthMetrics.loginGrowth)}`"></i>
          {{ adminMetricsStore.growthMetrics.loginGrowth.toFixed(1) }}%
        </p>
      </div>
      <div>
        <i class="fas fa-sign-in-alt h-16 w-16 text-purple-500"></i>
      </div>
    </div>

    <!-- 누적 탈퇴 수 카드 (Withdrawals) -->
    <div class="bg-yellow-200 text-gray-800 rounded-lg shadow-md p-6 flex items-center justify-between card hover:scale-105">
      <div>
        <p class="text-sm font-semibold">탈퇴 수</p>
        <p class="text-4xl font-bold mt-2">{{ adminMetricsStore.totalWithdrawals }}</p>
        <p :class="growthClasses(adminMetricsStore.growthMetrics.withdrawalGrowth)">
          <i :class="`fas ${growthIcon(adminMetricsStore.growthMetrics.withdrawalGrowth)}`"></i>
          {{ adminMetricsStore.growthMetrics.withdrawalGrowth.toFixed(1) }}%
        </p>
      </div>
      <div>
        <i class="fas fa-user-minus h-16 w-16 text-yellow-500"></i>
      </div>
    </div>
  </div>
</template>

<style scoped>
@import url('https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.4/css/all.min.css');

body {
  font-family: 'Inter', sans-serif;
}

.card {
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.card:hover {
  transform: scale(1.05);
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
}
</style>
