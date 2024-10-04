

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


//날짜 계산 UTC 기준으로 설정
const getStartOfMonth = () => {
    const now = new Date();
    return new Date(Date.UTC(now.getFullYear(), now.getMonth(), 1));
};

const getEndOfMonth = () => {
    const now = new Date();
    return new Date(Date.UTC(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59, 999));
};


const renderChart = () => {
    const ctx = document.getElementById("doughnutChart").getContext("2d");

    if (doughnutChartInstance) {
        // 기존 차트를 제거
        doughnutChartInstance.destroy();
    }

    // 새로운 차트를 생성
    doughnutChartInstance = new Chart(ctx, {
        type: "doughnut",
        data: chartData.value,
        options: chartOptions.value,
    });
};

onMounted(async () => {
    const memberIdx = localStorage.getItem("memberIdx");

    if (memberIdx) {
        await categoryTransactionStore.fetchCategoryTransactionCount(memberIdx);
        console.log("categoryData:", categoryTransactionStore.categoryData);
        if (categoryTransactionStore.categoryData.length > 0) {
            const startOfMonth = getStartOfMonth().toISOString().split("T")[0]; // YYYY-MM-DD 형식으로 변환
            const endOfMonth = getEndOfMonth().toISOString().split("T")[0];
            console.log("Start of Month:", startOfMonth); // 시작일 출력
            console.log("End of Month:", endOfMonth); // 마지막 날짜 출력

            const filteredData = categoryTransactionStore.categoryData.filter((item) => {
    const transactionDate = new Date(item.transactionDate).toISOString().split("T")[0]; // YYYY-MM-DD 형식으로 변환
    return transactionDate >= startOfMonth && transactionDate <= endOfMonth;


});


            console.log("Filtered Data:", filteredData); // 필터링된 데이터 로그

            if (filteredData.length === 0) {
                console.error("필터링된 데이터가 없습니다.");
                return;
            }

            const uniqueCategories = [...new Set(filteredData.map((item) => item.categoryName))];

            const totalTransactions = filteredData.reduce((acc, item) => acc + item.totalSpent, 0);

chartData.value.labels = uniqueCategories;
chartData.value.datasets[0].data = uniqueCategories.map((category) => {
    const categoryTransactions = filteredData
        .filter((item) => item.categoryName === category)
        .reduce((acc, item) => acc + item.totalSpent, 0);

    if (totalTransactions === 0) {
        return 0; // 전체 거래 금액이 0이면 비율을 0으로 설정
    }

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
