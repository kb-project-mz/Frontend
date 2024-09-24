<script setup>
import { ref, onMounted, computed, watch } from "vue";

// 달력의 현재 연도와 월
const currentYear = ref(new Date().getFullYear());
const currentMonth = ref(new Date().getMonth());

// 요일을 나타내는 배열 (한국어)
const weekDays = ["일", "월", "화", "수", "목", "금", "토"];

const daysInMonth = ref([]);
const expenses = ref([
    { date: "2024-09-01", amount: 2000 },
    { date: "2024-09-05", amount: 5000 },
]);
const incomes = ref([
    { date: "2024-09-01", amount: 300000 },
    { date: "2024-09-03", amount: 70000 },
]);

// 월의 시작 요일과 마지막 날짜 계산
const getMonthInfo = (year, month) => {
    const startDay = new Date(year, month, 1).getDay(); // 월 시작 요일 (0: 일요일)
    const endDate = new Date(year, month + 1, 0).getDate(); // 월 마지막 날짜
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

// 특정 날짜의 지출을 가져오는 함수
const getExpense = (date) => {
    const expense = expenses.value.find((e) => e.date === date);
    return expense ? expense.amount.toLocaleString() : 0;
};

// 특정 날짜의 수입을 가져오는 함수
const getIncome = (date) => {
    const income = incomes.value.find((i) => i.date === date);
    return income ? income.amount.toLocaleString() : 0;
};

// 컴포넌트가 처음 로드될 때 달력 생성
onMounted(() => {
    generateCalendar();
});
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
                        <!-- 빈칸을 위한 처리 -->
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
