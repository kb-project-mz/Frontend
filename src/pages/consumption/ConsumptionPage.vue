<script setup>
import { ref, onMounted, onBeforeUnmount } from "vue";
import { useConsumptionHistoryStore } from "@/stores/consumption-history"; // 월별 소비 스토어
import { useAccountHistoryStore } from "@/stores/account-history";
import AIRecommendation from "@/components/consumption/AIRecommendation.vue";
import ConsumptionCalendar from "@/components/consumption/ConsumptionCalendar.vue";
import Header from "@/components/common/Header.vue";
import LineChart from "@/components/consumption/LineChart.vue";
import AnalysisThisMonth from "@/components/consumption/AnalysisThisMonth.vue";
import AnalysisSelectedPeriod from "@/components/consumption/AnalysisSelectedPeriod.vue";
import ConsumptionList from "@/components/consumption/ConsumptionList.vue";

const memberId = 1;
const consumptionHistoryStore = useConsumptionHistoryStore(); // 월별 소비 스토어
const accountHistoryStore = useAccountHistoryStore(); // 계좌 히스토리 스토어

const historyData = ref([]);
const historyThisMonthData = ref([]); //이번달 카드 내역
const historySelectedPeriodData = ref([]);
const accountHistoryData = ref([]); //이번달 계좌 입출금 내역
const accountHistoryThisMonthData = ref([]);
const accountHistorySelectedPeriodData = ref([]);

const isFlipped = ref(false);

const toggleCardFlip = () => {
    isFlipped.value = !isFlipped.value;
};

const today = new Date();
const year = today.getFullYear();
const month = today.getMonth() + 1;

// 월의 마지막 날짜 가져오기 함수
const getEndDay = (year, month) => {
    const isLeapYear = (year) => (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0;
    const daysInMonth = [31, isLeapYear(year) ? 29 : 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
    return daysInMonth[month - 1];
};

const startYear = ref(year);
const startMonth = ref(month - 1);
const startDay = ref(1);
const endYear = ref(year);
const endMonth = ref(month - 1);
const endDay = ref(getEndDay(endYear.value, endMonth.value));

// 소비 내역 불러오기 함수
const fetchConsumptionHistory = async (memberId) => {
    await consumptionHistoryStore.getCardHistoryList(memberId);
    historyData.value = consumptionHistoryStore.cardHistory;
    historyThisMonthData.value = consumptionHistoryStore.cardHistoryThisMonth;

    await accountHistoryStore.getAccountHistoryList(memberId);
    accountHistoryData.value = accountHistoryStore.accountHistory;
    accountHistoryThisMonthData.value = accountHistoryStore.accountHistoryThisMonth;
};

// 선택한 기간 동안의 소비 내역 필터링
const fetchSelectedPeriodConsumptionHistory = () => {
    const startDate = new Date(startYear.value, startMonth.value - 1, startDay.value);
    const endDate = new Date(endYear.value, endMonth.value - 1, endDay.value, 23, 59, 59);

    const filteredHistoryData = historyData.value.filter((item) => {
        const consumptionDate = new Date(item.consumptionDate);
        return consumptionDate >= startDate && consumptionDate <= endDate;
    });

    const filteredAccountHistoryData = accountHistoryData.value.filter((item) => {
        const accountDate = new Date(item.accountDate);
        return accountDate >= startDate && accountDate <= endDate;
    });

    historySelectedPeriodData.value = filteredHistoryData;
    accountHistorySelectedPeriodData.value = filteredAccountHistoryData;
};

onMounted(async () => {
    // 데이터 불러오기
    await fetchConsumptionHistory(memberId);

    // 만약 상태가 계속 변경되면 무한 렌더링이 발생할 수 있음
    fetchSelectedPeriodConsumptionHistory();
});
</script>

<template>
    <Header />
    <div class="mx-[25%] mt-10">
        <button @click="toggleCardFlip" class="mt-4 p-2 bg-blue-500 text-white rounded">뒤집기</button>
        <div class="flip">
            <div class="card" :class="{ flipped: isFlipped }">
                <div class="front"><AnalysisThisMonth /></div>
                <div class="back"><AnalysisSelectedPeriod /></div>
            </div>
        </div>

        <div class="flex">
            <div class="flex-1 mt-8 mr-4">
                <LineChart />
            </div>
            <div class="flex-1 mt-8 ml-4">
                <LineChart />
            </div>
        </div>

        <div class="h-6"></div>
        <div class="flex">
            <div class="w-3/5 mr-4 border border-gray-200 rounded-2xl shadow">
                <ConsumptionCalendar :account-history-data="accountHistoryData" :history-data="historyData" />
            </div>
            <div class="w-2/5 ml-4 border border-gray-200 rounded-2xl shadow">
                <ConsumptionList />
            </div>
        </div>

        <div class="mt-16 mb-80">
            <AIRecommendation />
        </div>
    </div>
</template>

<style scoped>
.btn-gray {
    border-color: #656363;
    color: #656363;
}
.flip {
    width: 100%;
    height: 720px;
    display: table;
    perspective: 1100px;
}
.card {
    width: 100%;
    position: relative;
    display: table;
    transition: 0.4s;
    transform-style: preserve-3d;
}
.front,
.back {
    display: table-row;
    position: absolute;
    width: 100%;
    height: auto;
    backface-visibility: hidden;
}
.back {
    transform: rotateY(180deg);
}
.card.flipped {
    transform: rotateY(180deg);
}
</style>
