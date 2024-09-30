<template>
    <div>
        <div class="ml-8 mt-2 font-bold text-lg">월별 총 지출 내역</div>
        <div class="flex justify-center items-center h-full w-full bg-transparent">
            <canvas ref="canvasRef" width="400" height="230"></canvas>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted, computed, watch } from "vue";
import { Chart } from "chart.js/auto";

const props = defineProps({
    accountTransactionData: {
        type: Array,
        required: true,
    },
    cardTransactionData: {
        type: Array,
        required: true,
    },
    auth: {
        type: Object,
        required: true,
    },
});

// 현재 연도와 달을 초기화
const initialYear = new Date().getFullYear();
const initialMonth = new Date().getMonth();
const currentYear = ref(initialYear);
const currentMonth = ref(initialMonth);

const chartData = ref({
    labels: [],
    datasets: [
        {
            label: "월별 총 지출액",
            data: [],
            borderColor: "#CEE3FF",
            backgroundColor: "rgba(206, 227, 255, 0.3)", // Chart.js 배경 투명도 적용 (0.3 투명도)
            fill: true,
            tension: 0.4,
        },
    ],
});

// 각 달에 대한 지출 내역 필터링을 위한 함수
const filterExpensesForMonth = (year, month) => {
    const memberName = props.auth.memberName;

    const accountExpenses = props.accountTransactionData.filter((item) => {
        const itemDate = new Date(item.accountTransactionDate);
        return itemDate.getFullYear() === year && itemDate.getMonth() === month && item.amount < 0 && (!item.content || !item.content.includes(memberName));
    });

    const cardExpenses = props.cardTransactionData.filter((item) => {
        const itemDate = new Date(item.cardTransactionDate);
        return itemDate.getFullYear() === year && itemDate.getMonth() === month && item.amount > 0;
    });

    // 계좌 지출과 카드 지출을 합산
    const totalAccountExpenses = accountExpenses.reduce((sum, e) => sum + Math.abs(e.amount), 0);
    const totalCardExpenses = cardExpenses.reduce((sum, e) => sum + e.amount, 0);

    return totalAccountExpenses + totalCardExpenses;
};

// 지난 12개월 지출 내역 계산
const getLast12MonthsExpenses = () => {
    const expensesPerMonth = [];
    const labels = [];

    let year = initialYear; // 초기 연도 설정
    let month = initialMonth; // 초기 월 설정

    for (let i = 0; i < 12; i++) {
        const totalExpenses = filterExpensesForMonth(year, month);

        expensesPerMonth.push(totalExpenses ? totalExpenses : 0);
        labels.push(`${year}.${month + 1}`);

        // 월을 이전으로 이동
        month--;
        if (month < 0) {
            month = 11;
            year--;
        }
    }

    return { expensesPerMonth: expensesPerMonth.reverse(), labels: labels.reverse() };
};

const canvasRef = ref(null);
let chartInstance = null;

// 차트 업데이트
const updateChart = () => {
    if (chartInstance) {
        const { expensesPerMonth, labels } = getLast12MonthsExpenses();
        chartInstance.data.labels = labels;
        chartInstance.data.datasets[0].data = expensesPerMonth;
        chartInstance.update();
    }
};

// 차트 렌더링
const renderChart = () => {
    const { expensesPerMonth, labels } = getLast12MonthsExpenses();

    if (chartInstance) {
        chartInstance.destroy();
    }

    if (canvasRef.value) {
        const ctx = canvasRef.value.getContext("2d");
        chartInstance = new Chart(ctx, {
            type: "line",
            data: {
                labels: labels,
                datasets: [
                    {
                        label: "월별 총 지출액",
                        data: expensesPerMonth,
                        borderColor: "#CEE3FF",
                        backgroundColor: "rgba(206, 227, 255, 0.3)", // 배경 투명도 적용
                        fill: true,
                        tension: 0.4,
                    },
                ],
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    y: {
                        beginAtZero: true,
                        title: {
                            display: true,
                        },
                    },
                    x: {
                        title: {
                            display: true,
                        },
                    },
                },
            },
        });
    } else {
        console.error("canvasRef가 null입니다. 차트를 렌더링할 수 없습니다.");
    }
};

// 컴포넌트 마운트 시 차트 렌더링
onMounted(() => {
    renderChart();

    // 실시간으로 데이터를 감시하여 업데이트
    watch(
        () => [props.accountTransactionData, props.cardTransactionData],
        () => {
            updateChart(); // 데이터가 변경되면 차트 업데이트
        },
        { immediate: true }
    );
});
</script>
