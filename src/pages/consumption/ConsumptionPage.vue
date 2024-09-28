<script setup>
import { ref, onMounted } from "vue";
import { useConsumptionHistoryStore } from "@/stores/consumption-history";
import { useAccountHistoryStore } from "@/stores/account-history";
import { useAuthStore } from "@/stores/auth.js";
import AIRecommendation from "@/components/consumption/AIRecommendation.vue";
import ConsumptionCalendar from "@/components/consumption/ConsumptionCalendar.vue";
import LineChart from "@/components/consumption/LineChart.vue";
import AnalysisThisMonth from "@/components/consumption/AnalysisThisMonth.vue";
import AnalysisSelectedPeriod from "@/components/consumption/AnalysisSelectedPeriod.vue";
import ConsumptionList from "@/components/consumption/ConsumptionList.vue";
import BarChart from "@/components/consumption/BarChart.vue";

const memberId = localStorage.getItem("id");
const consumptionHistoryStore = useConsumptionHistoryStore(); // 월별 소비 스토어
const accountHistoryStore = useAccountHistoryStore(); // 계좌 히스토리 스토어

const historyData = ref([]);
const historyThisMonthData = ref([]); //이번달 카드 내역
const historySelectedPeriodData = ref([]);
const accountHistoryData = ref([]); //이번달 계좌 입출금 내역
const accountHistoryThisMonthData = ref([]);
const accountHistorySelectedPeriodData = ref([]);

const authStore = useAuthStore();
const user = authStore.member; // 로그인 사용자 데이터

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
    <div class="mx-[22%] mt-10">
        <button @click="toggleCardFlip" class="p-2 bg-navy text-white rounded">뒤집기</button>
        <div class="flip w-full h-[400px] inline-block perspective-[1100px]">
            <div class="card w-full inline-block relative transition duration-400 transform-style-[preserve-3d]" :class="{ 'rotate-y-180': isFlipped }">
                <div class="front absolute w-full backface-visibility-hidden">
                    <AnalysisThisMonth :history-this-month-data="historyThisMonthData" :account-history-this-month-data="accountHistoryThisMonthData" />
                </div>
                <div class="back absolute w-full backface-visibility-hidden rotate-y-180">
                    <AnalysisSelectedPeriod />
                </div>
            </div>
        </div>

        <div class="flex gap-[30px] mt-8">
            <div class="w-2/5 mt-8 border border-gray-200 rounded-2xl shadow-lg h-[300px] p-5">
                <LineChart />
            </div>
            <div class="w-3/5 mt-8 border border-gray-200 rounded-2xl shadow-lg h-[300px] p-5">
                <BarChart :account-history-data="accountHistoryData" :history-data="historyData" :auth="{ memberName: user.memberName }" />
            </div>
        </div>

        <div class="flex mt-8 gap-[30px]">
            <div class="w-3/5 border border-gray-200 rounded-2xl shadow-lg h-[500px] overflow-auto">
                <ConsumptionCalendar :account-history-data="accountHistoryData" :history-data="historyData" :auth="{ memberName: user.memberName }" />
            </div>

            <div class="w-2/5 border border-gray-200 rounded-2xl shadow-lg h-[500px] overflow-hidden">
                <ConsumptionList :history-data="historyData" />
            </div>
        </div>

        <div class="mt-16 mb-80 gap-[30px]">
            <AIRecommendation />
        </div>
    </div>
</template>

<style scoped>
.bg-navy {
    background-color: #0b1573;
}

.flip {
    perspective: 1100px;
}

.card {
    transition: 0.4s;
    transform-style: preserve-3d;
}

.front,
.back {
    backface-visibility: hidden;
}

.back {
    transform: rotateY(180deg);
}

.card.rotate-y-180 {
    transform: rotateY(180deg);
}
</style>
