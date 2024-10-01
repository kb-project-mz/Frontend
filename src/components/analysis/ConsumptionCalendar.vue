<script setup>
import { ref, onMounted, computed, watch } from "vue";

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

// TODO: 10월 소비 내역이 없는 관계로 now를 9월로 고정, 추후 new Date()로 변경해야 함
const now = new Date(2024, 8, 30);
const currentYear = ref(now.getFullYear());
const currentMonth = ref(now.getMonth());

const weekDays = ["일", "월", "화", "수", "목", "금", "토"];

const daysInMonth = ref([]);

// 필터링된 계좌 지출 내역
const filteredAccountExpenses = computed(() => {
  return props.accountTransactionData.filter((item) => {
    const itemDate = new Date(item.accountTransactionDate);
    return (
      itemDate.getFullYear() === currentYear.value &&
      itemDate.getMonth() === currentMonth.value &&
      item.amount < 0 &&
      (!item.accountTransactionDescription || !item.accountTransactionDescription.includes(memberName)) // memberName이 content에 포함되지 않은 경우
    );
  });
});

// 필터링된 카드 지출 내역
const filteredCardExpenses = computed(() => {
  return props.cardTransactionData.filter((item) => {
    const itemDate = new Date(item.cardTransactionDate);
    return (
      itemDate.getFullYear() === currentYear.value &&
      itemDate.getMonth() === currentMonth.value && item.amount > 0 // 카드 지출 (양수)
    );
  });
});

// 필터링된 수입 내역
const filteredIncomes = computed(() => {
  return props.accountTransactionData.filter((item) => {
    const itemDate = new Date(item.accountTransactionDate);
    return (
      itemDate.getFullYear() === currentYear.value &&
      itemDate.getMonth() === currentMonth.value &&
      item.amount > 0 && // 수입
      (!item.accountTransactionDescription || !item.accountTransactionDescription.includes(memberName)) // memberName이 content에 포함되지 않은 경우
    );
  });
});

// 월의 시작 요일과 마지막 날짜 계산
const getMonthInfo = (year, month) => {
  const startDay = new Date(year, month, 1).getDay();
  const endDate = new Date(year, month + 1, 0).getDate();
  return { startDay, endDate };
};

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
  // 계좌 지출 필터링 (accountHistoryData에서 음수 값)
  const accountExpensesForDate = filteredAccountExpenses.value.filter((e) => {
    const accountDate = new Date(e.accountTransactionDate).toISOString().split("T")[0];
    return accountDate === date; // 일별 필터링
  });

  // 카드 지출 필터링 (historyData에서 양수 값)
  const cardExpensesForDate = filteredCardExpenses.value.filter((e) => {
    const cardDate = new Date(e.cardTransactionDate).toISOString().split("T")[0];
    return cardDate === date;
  });

  const totalAccountExpenses = accountExpensesForDate.reduce((sum, e) => sum + Math.abs(e.amount), 0);
  const totalCardExpenses = cardExpensesForDate.reduce((sum, e) => sum + e.amount, 0);
  const totalExpenses = totalAccountExpenses + totalCardExpenses;
  return totalExpenses ? totalExpenses.toLocaleString() : 0;
};

const getIncome = (date) => {
  // 해당 날짜에 해당하는 모든 수입 데이터를 필터링 (amount가 양수인 경우만)
  const incomesForDate = filteredIncomes.value.filter((e) => e.accountTransactionDate === date && e.amount > 0);
  const totalAmount = incomesForDate.reduce((sum, e) => sum + e.amount, 0);

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
  justify-content: center;
  align-items: center;
  margin-bottom: 12px;
  margin-top: 20px;
}

button {
  background: none;
  border: none;
  font-size: 1rem;
  margin: 0 10px;
}

.calendar-title {
  font-size: 1.2rem;
  font-weight: bold;
  text-align: center;
}

table {
  width: 100%;
  border-collapse: collapse;
  table-layout: fixed;
}

th,
td {
  text-align: center;
  padding: 10px;
  border: none;
  height: 60px;
  width: 60px;
}

thead th {
  font-weight: bold;
  background-color: white;
}

tbody td {
  font-weight: bold;
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
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
  height: 100%;
}

/* 반응형을 위한 미디어 쿼리 */
@media (max-width: 600px) {

  th,
  td {
    height: 50px;
    font-size: 0.8rem;
  }
}
</style>
