<script setup>
import { ref, onMounted, computed, watch } from "vue";
import Chart from "chart.js/auto"; // 차트를 그리기 위한 Chart.js

const props = defineProps({
    accountTransactionData: {
        type: Array,
        required: true,
    },
    cardTransactionData: {
        type: Array,
        required: true,
    },
});

const memberName = localStorage.getItem("memberName");

// 현재 날짜 고정 (필요시 new Date()로 변경)
const now = new Date();
const currentYear = ref(now.getFullYear());
const currentMonth = ref(now.getMonth() + 1); // 현재 월

// 차트 인스턴스를 참조하는 변수
const chartInstance = ref(null);

// 필터링된 계좌 지출 내역
const filteredAccountExpenses = computed(() => {
    if (!props.accountTransactionData || props.accountTransactionData.length === 0) {
        console.log("No account transaction data");
        return [];
    }

    // 로그 추가 - 데이터 확인
    console.log("Account Transaction Data:", props.accountTransactionData);

    return props.accountTransactionData.filter((item) => {
        const itemDate = new Date(item.accountTransactionDate); // 정확한 날짜 객체 생성
        console.log("Account transaction date:", item.accountTransactionDate, "Parsed date:", itemDate); // 로그 추가
        return itemDate.getFullYear() === currentYear.value && itemDate.getMonth() + 1 === currentMonth.value && item.amount < 0;
    });
});

// 필터링된 카드 지출 내역
const filteredCardExpenses = computed(() => {
    if (!props.cardTransactionData || props.cardTransactionData.length === 0) {
        console.log("No card transaction data");
        return [];
    }

    // 로그 추가 - 데이터 확인
    console.log("Card Transaction Data:", props.cardTransactionData);

    return props.cardTransactionData.filter((item) => {
        const itemDate = new Date(item.cardTransactionDate); // 정확한 날짜 객체 생성
        console.log("Card transaction date:", item.cardTransactionDate, "Parsed date:", itemDate); // 로그 추가
        return itemDate.getFullYear() === currentYear.value && itemDate.getMonth() + 1 === currentMonth.value && item.amount > 0;
    });
});

// 일별 지출 총합 계산 함수 (계좌 지출 + 카드 지출)
const getDailyExpenses = () => {
    const daysInMonth = new Date(currentYear.value, currentMonth.value, 0).getDate(); // 현재 월의 총 일 수
    const dailyExpenses = Array(daysInMonth).fill(0); // 날짜별로 초기값 0으로 설정된 배열

    // 계좌 지출 데이터
    filteredAccountExpenses.value.forEach((e) => {
        const date = new Date(e.accountTransactionDate).getDate();
        dailyExpenses[date - 1] += Math.abs(e.amount); // 날짜별로 금액 합산
    });

    // 카드 지출 데이터
    filteredCardExpenses.value.forEach((e) => {
        const date = new Date(e.cardTransactionDate).getDate();
        dailyExpenses[date - 1] += e.amount; // 날짜별로 금액 합산
    });

    console.log("일별 지출 데이터: ", dailyExpenses); // 로그 추가하여 확인
    return dailyExpenses;
};

// 차트를 초기화하거나 새로 그리는 함수
const renderChart = () => {
    const canvasElement = document.getElementById("monthlyExpenseChart"); // canvas 요소를 가져옴

    if (!canvasElement) {
        console.error("Canvas element not found");
        return; // canvas가 존재하지 않을 경우 함수 종료
    }

    const ctx = canvasElement.getContext("2d"); // canvas의 2d 컨텍스트를 가져옴
    if (!ctx) {
        console.error("Unable to get canvas context");
        return; // 컨텍스트가 없을 경우 함수 종료
    }

    // 차트가 이미 존재하는 경우, 이전 차트를 삭제하고 새로 그립니다.
    if (chartInstance.value) {
        chartInstance.value.destroy();
    }

    const dailyExpenses = getDailyExpenses();
    const dates = Array.from({ length: dailyExpenses.length }, (_, i) => `${i + 1}일`);

    chartInstance.value = new Chart(ctx, {
        type: "bar",
        data: {
            labels: dates, // x축 레이블 (날짜)
            datasets: [
                {
                    label: "일별 지출액",
                    data: dailyExpenses, // 일별 지출 데이터
                    backgroundColor: "#0B1573", // 막대 색상
                    borderColor: "#0B1573",
                    borderWidth: 1,
                },
            ],
        },
        options: {
            plugins: {
                legend: {
                    display: false, // 레이블 숨김
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

// 컴포넌트가 처음 로드될 때 차트 생성
onMounted(() => {
    // 데이터가 undefined인지 확인
    if (props.accountTransactionData && props.cardTransactionData) {
        renderChart(); // 차트 렌더링
    } else {
        console.log("No transaction data available at mount");
    }
});

// 데이터가 변경될 때 차트를 다시 렌더링
watch([props.accountTransactionData, props.cardTransactionData], ([newAccountData, newCardData]) => {
    if (newAccountData && newCardData) {
        renderChart(); // 데이터가 준비되었을 때 차트 렌더링
    }
});
</script>

<template>
    <div class="py-6 px-8 bg-navy text-white border border-gray-200 rounded-2xl shadow">
        <div class="flex justify-between items-center mb-3">
            <div class="font-medium">하루 평균 소비 금액</div>
            <div class="font-bold text-lg">12,100원</div>
        </div>
        <div class="py-12 px-10 bg-white mb-2">
            <canvas id="monthlyExpenseChart"></canvas>
        </div>
    </div>
</template>

<style scoped>
.bg-navy {
    background-color: #0b1573;
}
</style>
