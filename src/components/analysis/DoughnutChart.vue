<script setup>
import { ref, onMounted } from "vue";
import { Chart, DoughnutController, ArcElement, Tooltip, Legend } from "chart.js";
import { useCategoryTransactionStore } from "@/stores/category-transaction"; // Pinia store import

Chart.register(DoughnutController, ArcElement, Tooltip, Legend);

const categoryTransactionStore = useCategoryTransactionStore();
const chartData = ref({
    labels: [],
    datasets: [
        {
            data: [],
            backgroundColor: ["#FFB3BA", "#B3E5FC", "#FFCE99", "#C8E6C9", "#E1BEE7"], // 파스텔톤 색상
            hoverBackgroundColor: ["#FFB3BA", "#B3E5FC", "#FFCE99", "#C8E6C9", "#E1BEE7"],
        },
    ],
});

const chartOptions = ref({
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
        legend: {
            position: "top",
        },
    },
});

let doughnutChartInstance = null;

const getStartOfMonth = () => {
    // 현재 날짜를 기준으로 이번 달의 시작일 계산
    const now = new Date();
    return new Date(now.getFullYear(), now.getMonth(), 1);
};

const getEndOfMonth = () => {
    // 현재 날짜를 기준으로 이번 달의 마지막 날짜 계산
    const now = new Date();
    return new Date(now.getFullYear(), now.getMonth() + 1, 0);
};

const renderChart = () => {
    const ctx = document.getElementById("doughnutChart").getContext("2d");

    if (doughnutChartInstance) {
        // 차트가 이미 존재할 경우 데이터를 업데이트
        doughnutChartInstance.data.labels = chartData.value.labels;
        doughnutChartInstance.data.datasets[0].data = chartData.value.datasets[0].data;
        doughnutChartInstance.update(); // 차트 업데이트
    } else {
        // 처음 차트를 생성할 때
        doughnutChartInstance = new Chart(ctx, {
            type: "doughnut",
            data: chartData.value,
            options: chartOptions.value,
        });
    }
};

onMounted(async () => {
    const memberIdx = localStorage.getItem("memberIdx");

    if (memberIdx) {
        await categoryTransactionStore.fetchCategoryTransactionCount(memberIdx);

        if (categoryTransactionStore.categoryData.length > 0) {
            const startOfMonth = getStartOfMonth();
            const endOfMonth = getEndOfMonth();

            const filteredData = categoryTransactionStore.categoryData.filter((item) => {
                const transactionDate = new Date(item.transactionDate);
                return transactionDate >= startOfMonth && transactionDate <= endOfMonth;
            });

            const uniqueCategories = [...new Set(filteredData.map((item) => item.categoryName))];

            const totalTransactions = filteredData.reduce((acc, item) => acc + item.percentage, 0);

            chartData.value.labels = uniqueCategories;
            chartData.value.datasets[0].data = uniqueCategories.map((category) => {
                const categoryTransactions = filteredData.filter((item) => item.categoryName === category).reduce((acc, item) => acc + item.percentage, 0);

                // 전체 대비 비율 계산 후 소수점 첫째 자리까지만 표시
                return ((categoryTransactions / totalTransactions) * 100).toFixed(1);
            });

            renderChart();
        } else {
            console.error("카테고리 데이터가 없습니다.");
        }
    } else {
        console.error("memberIdx가 유효하지 않습니다.");
    }
});
</script>

<template>
    <div class="chart-container">
        <canvas id="doughnutChart"></canvas>
    </div>
</template>

<style scoped>
.chart-container {
    position: relative;
    width: 100%;
    height: 400px;
}
</style>
