<script setup>
import { ref, onMounted, computed, watch } from "vue";
import Chart from "chart.js/auto";
const props = defineProps({
  chartId: {
    type: String,
    required: true,
  },
  accountTransactionData: {
    type: Array,
    required: true,
  },
  cardTransactionData: {
    type: Array,
    required: true,
  },
});
const authData = JSON.parse(localStorage.getItem("auth"));
const memberName = authData.memberName;
const chartInstance = ref(null);
const now = new Date();
const thirtyDaysAgo = new Date(now.setDate(now.getDate() - 30)); // 현재 날짜 기준 30일 전
const today = new Date(); // 오늘 날짜
// 필터링된 계좌 지출 내역 (최근 30일간, memberName을 포함하지 않는 경우)
const filteredAccountExpenses = computed(() => {
  return props.accountTransactionData.filter((item) => {
    const itemDate = new Date(item.accountTransactionDate);
    return (
      itemDate >= thirtyDaysAgo &&
      itemDate <= today &&
      item.amount < 0 && // 지출 (음수)
      (!item.accountTransactionDescription ||
        !item.accountTransactionDescription.includes(memberName)) // memberName이 포함되지 않은 경우
    );
  });
});
// 필터링된 카드 지출 내역 (최근 30일간, memberName을 포함하지 않는 경우)
const filteredCardExpenses = computed(() => {
  return props.cardTransactionData.filter((item) => {
    const itemDate = new Date(item.cardTransactionDate);
    return (
      itemDate >= thirtyDaysAgo &&
      itemDate <= today &&
      item.amount > 0 && // 카드 지출 (양수)
      (!item.cardTransactionDescription ||
        !item.cardTransactionDescription.includes(memberName)) // memberName이 포함되지 않은 경우
    );
  });
});
// 30일 동안의 총 지출액 계산 (계좌 지출 + 카드 지출)
const getTotalExpensesFor30Days = () => {
  let totalExpenses = 0;
  // 계좌 지출 데이터
  filteredAccountExpenses.value.forEach((e) => {
    totalExpenses += Math.abs(e.amount); // 계좌 지출 합산
  });
  // 카드 지출 데이터
  filteredCardExpenses.value.forEach((e) => {
    totalExpenses += e.amount; // 카드 지출 합산
  });
  return totalExpenses;
};
// 30일간의 일평균 지출액 계산
const dailyAverageExpense = computed(() => {
  const totalExpenses = getTotalExpensesFor30Days();
  return Math.round(totalExpenses / 30).toLocaleString();
});
// 일별 지출 총합 계산 함수 (차트에 사용할 데이터)
const getDailyExpenses = () => {
  const dailyExpenses = Array(30).fill(0); // 30일 동안의 지출 데이터
  // 계좌 지출 데이터
  filteredAccountExpenses.value.forEach((e) => {
    const date = Math.floor(
      (today - new Date(e.accountTransactionDate)) / (1000 * 60 * 60 * 24)
    ); // 일 수 계산
    if (date < 30) {
      dailyExpenses[29 - date] += Math.abs(e.amount); // 날짜별로 금액 합산
    }
  });
  // 카드 지출 데이터
  filteredCardExpenses.value.forEach((e) => {
    const date = Math.floor(
      (today - new Date(e.cardTransactionDate)) / (1000 * 60 * 60 * 24)
    ); // 일 수 계산
    if (date < 30) {
      dailyExpenses[29 - date] += e.amount; // 날짜별로 금액 합산
    }
  });
  return dailyExpenses;
};
// 날짜 배열을 생성하는 함수 (30일간의 실제 날짜를 생성)
const getLast30DaysDates = () => {
  const dates = [];
  for (let i = 0; i < 30; i++) {
    const date = new Date();
    date.setDate(date.getDate() - i);
    dates.unshift(date.toISOString().split("T")[0]); // YYYY-MM-DD 형식으로 변환
  }
  return dates;
};
// 차트를 초기화하거나 새로 그리는 함수
const renderChart = () => {
  const canvasElement = document.getElementById(props.chartId);
  if (chartInstance.value) {
    console.log("차트 존재");
    chartInstance.value.destroy();
  }
  if (!canvasElement) {
    return;
  }
  const ctx = canvasElement.getContext("2d");
  if (!ctx) {
    return;
  }
  const dailyExpenses = getDailyExpenses();
  const dates = getLast30DaysDates(); // 30일간의 실제 날짜 배열
  chartInstance.value = new Chart(ctx, {
    type: "bar",
    data: {
      labels: dates,
      datasets: [
        {
          label: "일별 지출액",
          data: dailyExpenses,
          backgroundColor: "#0B1573",
          borderColor: "#0B1573",
          borderWidth: 1,
        },
      ],
    },
    options: {
      plugins: {
        legend: {
          display: false,
        },
      },
      scales: {
        y: {
          beginAtZero: true,
        },
      },
    },
  });
};
onMounted(() => {
  if (
    props.accountTransactionData?.length &&
    props.cardTransactionData?.length
  ) {
    renderChart();
  }
});
// 데이터가 변경될 때 차트를 다시 렌더링
watch(
  [props.accountTransactionData, props.cardTransactionData],
  ([newAccountData, newCardData]) => {
    if (newAccountData?.length && newCardData?.length) {
      renderChart();
    }
  }
);
</script>
<template>
  <div
    class="py-6 px-8 bg-navy text-white border border-gray-200 rounded-2xl shadow"
  >
    <div class="flex justify-between items-center mb-3">
      <div class="font-medium">하루 평균 소비 금액</div>
      <div class="font-bold text-lg">{{ dailyAverageExpense }}원</div>
    </div>
    <div class="py-12 px-10 bg-white mb-2">
      <!-- <canvas :id="chartId"></canvas> -->
    </div>
  </div>
</template>
<style scoped>
.bg-navy {
  background-color: #0B1573;
}
</style>