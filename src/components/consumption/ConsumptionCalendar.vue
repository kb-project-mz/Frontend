<script setup>
import { ref, onMounted, computed, watch } from "vue";

// Props로 accountHistoryData와 historyData를 받아옵니다.
const props = defineProps({
    accountHistoryData: {
        type: Array,
        required: true,
    },
    historyData: {
        type: Array,
        required: true,
    },
});

// 달력의 현재 연도와 월
const currentYear = ref(new Date().getFullYear());
const currentMonth = ref(new Date().getMonth());

// 요일을 나타내는 배열 (한국어)
const weekDays = ["일", "월", "화", "수", "목", "금", "토"];

const daysInMonth = ref([]);

// 필터링된 지출 내역 (현재 연도와 월에 맞는 데이터만 필터링)
const filteredExpenses = computed(() => {
    return props.accountHistoryData.filter((item) => {
        const itemDate = new Date(item.accountDate);
        return (
            itemDate.getFullYear() === currentYear.value && itemDate.getMonth() === currentMonth.value && item.amount < 0 // 지출만 필터링 (필요에 따라 수정 가능)
        );
    });
});

// 필터링된 수입 내역 (현재 연도와 월에 맞는 데이터만 필터링)
const filteredIncomes = computed(() => {
    return props.accountHistoryData.filter((item) => {
        const itemDate = new Date(item.accountDate);
        return (
            itemDate.getFullYear() === currentYear.value && itemDate.getMonth() === currentMonth.value && item.amount > 0 // 수입만 필터링 (필요에 따라 수정 가능)
        );
    });
});

// 월의 시작 요일과 마지막 날짜 계산
const getMonthInfo = (year, month) => {
    const startDay = new Date(year, month, 1).getDay();
    const endDate = new Date(year, month + 1, 0).getDate();
    return { startDay, endDate };
};

// 날짜를 yyyy-MM-dd 형식의 문자열로 반환하는 함수
const getDateString = (day) => {
    const year = currentYear.value;
    const month = currentMonth.value + 1; // month는 0부터 시작하므로 +1
    const dayString = day < 10 ? `0${day}` : day;
    const monthString = month < 10 ? `0${month}` : month;
    return `${year}-${monthString}-${dayString}`;
};

// 달력을 생성하는 함수
const calendarGenerator = (year, month) => {
    const { endDate, startDay } = getMonthInfo(year, month);
    const weekNumber = Math.ceil((startDay + endDate) / 7);
    const calendar = [];

    let nowDate = 0;
    let nowDay = 0;

    for (let i = 0; i < weekNumber; i++) {
        const nowWeek = [];
        for (let j = 0; j < 7; j++) {
            if (startDay <= nowDay && nowDate < endDate) {
                nowDate++;
                nowWeek.push(nowDate);
            } else {
                nowWeek.push(0);
            }
            nowDay++;
        }
        calendar.push(nowWeek);
    }

    return calendar;
};

// 현재 월에 맞는 달력 생성
const generateCalendar = () => {
    daysInMonth.value = calendarGenerator(currentYear.value, currentMonth.value);
};

// 월을 넘길 때 다음 월로 이동
const nextMonth = () => {
    if (currentMonth.value === 11) {
        currentMonth.value = 0;
        currentYear.value++;
    } else {
        currentMonth.value++;
    }
    generateCalendar();
};

// 월을 넘길 때 이전 월로 이동
const prevMonth = () => {
    if (currentMonth.value === 0) {
        currentMonth.value = 11;
        currentYear.value--;
    } else {
        currentMonth.value--;
    }
    generateCalendar();
};

const getExpense = (date) => {
    // 해당 날짜에 해당하는 모든 지출 데이터를 필터링 (amount가 음수인 경우만)
    const expensesForDate = filteredExpenses.value.filter((e) => e.accountDate === date && e.amount < 0);

    // 해당 날짜에 지출이 있는 경우 amount를 모두 절대값으로 합산
    const totalAmount = expensesForDate.reduce((sum, e) => sum + Math.abs(e.amount), 0);

    // 합산된 금액을 반환, 없으면 0 반환
    return totalAmount ? totalAmount.toLocaleString() : 0;
};

const getIncome = (date) => {
    // 해당 날짜에 해당하는 모든 수입 데이터를 필터링 (amount가 양수인 경우만)
    const incomesForDate = filteredIncomes.value.filter((e) => e.accountDate === date && e.amount > 0);

    // 해당 날짜에 수입이 있는 경우 amount를 모두 합산
    const totalAmount = incomesForDate.reduce((sum, e) => sum + e.amount, 0);

    // 합산된 금액을 반환, 없으면 0 반환
    return totalAmount ? totalAmount.toLocaleString() : 0;
};

// 컴포넌트가 처음 로드될 때 달력 생성
onMounted(() => {
    generateCalendar();
});

watch([currentYear, currentMonth], generateCalendar);
</script>

<template>
    <div>
        <div class="calendar-header">
            <button @click="prevMonth">◀</button>
            <span class="calendar-title">{{ currentYear }}년 {{ currentMonth + 1 }}월</span>
            <button @click="nextMonth">▶</button>
        </div>

        <table>
            <thead>
                <tr>
                    <th class="weekdays" v-for="day in weekDays" :key="day">{{ day }}</th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="(week, index) in daysInMonth" :key="index">
                    <td v-for="(day, dayIndex) in week" :key="dayIndex">
                        <div v-if="day !== 0">
                            <span>{{ day }}</span>
                            <div class="income" v-if="getIncome(getDateString(day))">{{ getIncome(getDateString(day)) }}</div>
                            <div class="expenses" v-if="getExpense(getDateString(day))">{{ getExpense(getDateString(day)) }}</div>
                        </div>
                        <span v-else>&nbsp;</span>
                    </td>
                </tr>
            </tbody>
        </table>
    </div>
</template>

<style scoped>
.calendar-header {
    display: flex;
    justify-content: center; /* 중앙 정렬 */
    align-items: center;
    margin-bottom: 12px; /* 헤더 하단 여백 */
    margin-top: 20px;
}

button {
    background: none;
    border: none;
    font-size: 1rem;
    margin: 0 10px; /* 버튼과 텍스트 사이의 여백을 줄임 */
}

.calendar-title {
    font-size: 1.2rem;
    font-weight: bold;
    text-align: center;
}

table {
    width: 100%;
    border-collapse: collapse; /* 테이블 셀 간격 없애기 */
    table-layout: fixed; /* 셀 크기를 고정 */
}

th,
td {
    text-align: center; /* 가운데 정렬 */
    padding: 10px; /* 셀 간의 여백 추가 */
    border: none; /* 셀 테두리 없애기 */
    background-color: white; /* 셀 배경을 흰색으로 설정 */
    height: 60px; /* 셀 높이 고정 */
    width: 60px; /* 셀 너비 고정 */
}

thead th {
    font-weight: bold; /* 요일을 굵게 설정 */
    background-color: white; /* 요일 배경색을 흰색으로 설정 */
}

tbody td {
    font-weight: bold; /* 날짜는 굵게 */
}

tbody td span {
    display: block;
    width: 100%;
    height: 100%;
}

.expenses,
.income {
    margin-top: 3px;
    font-size: 0.7rem;
}

.expenses {
    color: #f55151;
}

.income {
    color: #0e9cff;
}

.weekdays {
    text-align: center;
    font-weight: normal;
}

td div {
    display: flex;
    flex-direction: column; /* 세로로 배치 */
    justify-content: flex-start; /* 세로 방향에서 위쪽 정렬 */
    align-items: center; /* 가로 방향은 가운데 정렬 */
    height: 100%; /* 셀 전체 높이를 차지하도록 설정 */
}

/* 반응형을 위한 미디어 쿼리 */
@media (max-width: 600px) {
    th,
    td {
        height: 50px; /* 화면이 좁아지면 셀 높이 줄임 */
        font-size: 0.8rem; /* 텍스트 크기 줄임 */
    }

    .calendar-title {
        font-size: 1.2rem; /* 화면이 좁아지면 타이틀 폰트 크기 줄임 */
    }

    .weekdays {
        font-size: 0.8rem; /* 요일 폰트 크기 줄임 */
    }
}
</style>
