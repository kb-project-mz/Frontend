<script setup>
import { ref, onMounted } from "vue";
import { useDailyConsumptionHistoryDailyStore } from "@/stores/consumption-history-daily"; // 하루 소비 스토어
import { useConsumptionHistoryStore } from "@/stores/consumption-history"; // 월별 소비 스토어
import { useAccountHistoryStore } from "@/stores/account-history";
import MostAndMaximumUsed from "@/components/consumption/MostAndMaximumUsed.vue";
import CategoryChart from "@/components/consumption/CategoryChart.vue";
import TotalOutcome from "@/components/consumption/TotalOutcome.vue";
import TotalIncome from "@/components/consumption/TotalIncome.vue";
import AverageConsumption from "@/components/consumption/AverageConsumption.vue";
import AIRecommendation from "@/components/consumption/AIRecommendation.vue";
import ConsumptionCalendar from "@/components/consumption/ConsumptionCalendar.vue";

const memberId = 1;
const dailyConsumptionStore = useDailyConsumptionHistoryDailyStore(); // 하루 소비 스토어
const consumptionHistoryStore = useConsumptionHistoryStore(); // 월별 소비 스토어
const accountHistoryStore = useAccountHistoryStore(); // 계좌 히스토리 스토어

const historyData = ref([]);
const historyThisMonthData = ref([]);
const historySelectedPeriodData = ref([]);
const accountHistoryData = ref([]);
const accountHistoryThisMonthData = ref([]);
const accountHistorySelectedPeriodData = ref([]);
const thisMonth = ref("이번 달");
const selectedPeriod = ref("이 기간 동안");
const today = new Date();
const year = today.getFullYear();
const month = today.getMonth() + 1;

// 월의 마지막 날짜 가져오기
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

// 데이터가 중복으로 불려오는 것을 방지하기 위한 플래그
let dataFetched = ref(false);

// 소비 내역 불러오기 함수
const fetchConsumptionHistory = async (memberId) => {
    if (!dataFetched.value) {
        // 한 번만 호출되도록 보장
        await consumptionHistoryStore.getCardHistoryList(memberId);
        historyData.value = consumptionHistoryStore.cardHistory;
        historyThisMonthData.value = consumptionHistoryStore.cardHistoryThisMonth;

        await accountHistoryStore.getAccountHistoryList(memberId);
        accountHistoryData.value = accountHistoryStore.accountHistory;
        accountHistoryThisMonthData.value = accountHistoryStore.accountHistoryThisMonth;

        // 하루 소비 내역도 가져오기
        await dailyConsumptionStore.getCardHistoryForDate(memberId, today);

        // 데이터가 한 번만 불러와졌음을 표시
        dataFetched.value = true;
    }
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

// 컴포넌트가 마운트될 때 데이터 불러오기
onMounted(async () => {
    await fetchConsumptionHistory(memberId);
    fetchSelectedPeriodConsumptionHistory();
});
</script>

<template>
    <div class="mx-32 mt-10">
        <div class="flex">
            <div class="flex-1">
                <div class="text-lg mb-1">이번 달 홍길동 님의 소비 패턴을 분석해보았어요.</div>
                <div class="text-xl font-semibold mb-6">{{ year }}년 {{ month }}월</div>
                <MostAndMaximumUsed :period="thisMonth" />
                <div class="flex mt-8">
                    <div class="w-1/2 mr-4">
                        <CategoryChart />
                    </div>
                    <div class="w-1/2 ml-4">
                        <div>
                            <TotalOutcome :historyData="historyThisMonthData" :accountHistoryData="accountHistoryThisMonthData" />
                        </div>
                        <div class="mt-8">
                            <TotalIncome :accountHistoryData="accountHistoryThisMonthData" />
                        </div>
                        <div class="mt-8"><AverageConsumption /></div>
                    </div>
                </div>
                <div class="flex mt-8">
                    <div class="w-1/2 mr-4">
                        <ConsumptionList />
                    </div>
                    <div class="w-1/2 ml-4">
                        <div>
                            <ConsumptionCalendar :historyData="dailyConsumptionStore.cardHistoryToday" />
                        </div>
                    </div>
                </div>
            </div>
            <div class="mx-8 border-l border-gray-300"></div>
            <div class="flex-1">
                <div class="text-lg mb-1">이번 달 나의 소비 습관을 다른 달과 비교해볼까요?</div>
                <div class="text-xl font-semibold mb-6">{{ startYear }}년 {{ startMonth }}월 {{ startDay }}일 - {{ endYear }}년 {{ endMonth }}월 {{ endDay }}일</div>
                <MostAndMaximumUsed :period="selectedPeriod" />
                <div class="flex mt-8">
                    <div class="w-1/2 mr-4">
                        <CategoryChart />
                    </div>
                    <div class="w-1/2 ml-4">
                        <LineChart />
                        <div class="mt-8"><SomeChart /></div>
                    </div>
                </div>
            </div>
        </div>
        <div class="mt-20 mb-80">
            <AIRecommendation />
        </div>
    </div>
</template>

<style scoped>
.btn-gray {
    border-color: #656363;
    color: #656363;
}
</style>
