<script setup>
import { ref, onMounted } from 'vue';

const currentYear = ref(new Date().getFullYear());
const currentMonth = ref(new Date().getMonth());
const daysInMonth = ref([]);
const expenses = ref([
  { date: '2024-09-01', amount: 2000 },
  { date: '2024-09-05', amount: 5000 },
]);
const incomes = ref([
  { date: '2024-09-01', amount: 3000 },
  { date: '2024-09-03', amount: 7000 },
]);

const generateCalendar = () => {
  const days = new Date(
    currentYear.value,
    currentMonth.value + 1, 0
  ).getDate();
  daysInMonth.value = Array.from({ length: days }, (v, i) => {
    return {
      date: new Date(currentYear.value, currentMonth.value, i + 1)
        .toISOString()
        .split('T')[0],
    };
  });
};

const nextMonth = () => {
  if (currentMonth.value === 11) {
    currentMonth.value = 0;
    currentYear.value++;
  } else {
    currentMonth.value++;
  }
  generateCalendar();
};

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
  const expense = expenses.value.find((e) => e.date === date);
  return expense ? expense.amount : 0;
};

const getIncome = (date) => {
  const income = incomes.value.find((i) => i.date === date);
  return income ? income.amount : 0;
};

onMounted(() => {
  generateCalendar();
});
</script>

<template>
  <div class="p-8 bg-white border border-gray-200 rounded-2xl shadow h-full">
    <div class="calendar">
      <div class="calendar-header">
        <button @click="prevMonth">이전</button>
        <h2 style="font-weight: bold">
          {{ currentYear }}년 {{ currentMonth + 1 }}월
        </h2>
        <button @click="nextMonth">다음</button>
      </div>
      <div class="calendar-grid">
        <div class="day" v-for="day in daysInMonth" :key="day.date">
          <div class="date">{{ new Date(day.date).getDate() }}</div>
          <div class="expenses" v-if="getExpense(day.date) > 0">
            {{ getExpense(day.date) }}
          </div>
          <div class="income" v-if="getIncome(day.date) > 0">
            {{ getIncome(day.date) }}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.calendar {
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.calendar-header {
  display: flex;
  justify-content: space-between;
  width: 100%;
  margin-bottom: 12px;
  font-size: 0.9rem;
}

.calendar-grid {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 5px;
  /* 간격 줄임 */
}

.day {
  padding: 5px;
  /* 박스 크기 줄임 */
  border: 1px solid #ffffff;
  text-align: center;
  font-size: 0.8rem;
}

.date {
  font-weight: bold;
}

.expenses,
.income {
  margin-top: 3px;
  font-size: 0.8rem;
}

.expenses {
  color: #f55151;
}

.income {
  color: #0e9cff;
}
</style>
