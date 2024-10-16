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

const authData = JSON.parse(localStorage.getItem("auth"));
const memberName = authData.memberName;

const now = new Date();
const currentYear = ref(now.getFullYear());
const currentMonth = ref(now.getMonth());

const weekDays = ["일", "월", "화", "수", "목", "금", "토"];

const daysInMonth = ref([]);

const filteredAccountExpenses = computed(() => {
  return props.accountTransactionData.filter((item) => {
    const itemDate = new Date(item.accountTransactionDate);
    return (
      itemDate.getFullYear() === currentYear.value &&
      itemDate.getMonth() === currentMonth.value &&
      item.amount < 0 &&
      (!item.accountTransactionDescription ||
        !item.accountTransactionDescription.includes(memberName)) // memberName이 content에 포함되지 않은 경우
    );
  });
});

const filteredCardExpenses = computed(() => {
  return props.cardTransactionData.filter((item) => {
    const itemDate = new Date(item.cardTransactionDate);
    return (
      itemDate.getFullYear() === currentYear.value &&
      itemDate.getMonth() === currentMonth.value &&
      item.amount > 0 
    );
  });
});

const filteredIncomes = computed(() => {
  return props.accountTransactionData.filter((item) => {
    const itemDate = new Date(item.accountTransactionDate);
    return (
      itemDate.getFullYear() === currentYear.value &&
      itemDate.getMonth() === currentMonth.value &&
      item.amount > 0 && // 수입
      (!item.accountTransactionDescription ||
        !item.accountTransactionDescription.includes(memberName)) 
    );
  });
});

const getMonthInfo = (year, month) => {
  const startDay = new Date(year, month, 1).getDay();
  const endDate = new Date(year, month + 1, 0).getDate();
  return { startDay, endDate };
};

const getDateString = (day) => {
  const year = currentYear.value;
  const month = currentMonth.value + 1; 
  const dayString = day < 10 ? `0${day}` : day;
  const monthString = month < 10 ? `0${month}` : month;
  return `${year}-${monthString}-${dayString}`;
};

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

const generateCalendar = () => {
  daysInMonth.value = calendarGenerator(currentYear.value, currentMonth.value);
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
  const accountExpensesForDate = filteredAccountExpenses.value.filter((e) => {
    const accountDate = new Date(e.accountTransactionDate)
      .toISOString()
      .split("T")[0];
    return accountDate === date;
  });

  const cardExpensesForDate = filteredCardExpenses.value.filter((e) => {
    const cardDate = new Date(e.cardTransactionDate)
      .toISOString()
      .split("T")[0];
    return cardDate === date;
  });

  const totalAccountExpenses = accountExpensesForDate.reduce(
    (sum, e) => sum + Math.abs(e.amount),
    0
  );
  const totalCardExpenses = cardExpensesForDate.reduce(
    (sum, e) => sum + e.amount,
    0
  );
  const totalExpenses = totalAccountExpenses + totalCardExpenses;
  return totalExpenses ? totalExpenses.toLocaleString() : 0;
};

const getIncome = (date) => {
  const incomesForDate = filteredIncomes.value.filter(
    (e) => e.accountTransactionDate === date && e.amount > 0
  );
  const totalAmount = incomesForDate.reduce((sum, e) => sum + e.amount, 0);

  return totalAmount ? totalAmount.toLocaleString() : 0;
};

onMounted(() => {
  generateCalendar();
});

watch([currentYear, currentMonth], generateCalendar);
</script>

<template>
  <div class="py-6 w-full border rounded-xl shadow overflow-auto">
    <div class="flex justify-center items-center text-lg">
      <button class="px-3" @click="prevMonth"><font-awesome-icon :icon="['fas', 'chevron-left']" /></button>
      <span class="font-bold text-center">{{ currentYear }}년 {{ currentMonth + 1 }}월</span>
      <button class="px-3" @click="nextMonth"><font-awesome-icon :icon="['fas', 'chevron-right']" /></button>
    </div>

    <table class="w-full table-fixed border-none">
      <thead>
        <tr>
          <th class="p-5" v-for="day in weekDays" :key="day">{{ day }}</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(week, index) in daysInMonth" :key="index">
          <td v-for="(day, dayIndex) in week" :key="dayIndex" class="text-center py-2">
            <div v-if="day !== 0" class="mb-1">
              <div class="mb-1">{{ day }}</div>
              <div>
                <div class="text-customBlue text-xs mb-1">
                  {{ getIncome(getDateString(day)) !== 0 ? getIncome(getDateString(day)) : "&nbsp;"}}
                </div>
                <div class="text-customRed text-xs">
                  {{ getExpense(getDateString(day)) !== 0 ? getExpense(getDateString(day)) : "&nbsp;" }}
                </div>
              </div>
            </div>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<style scoped>

</style>
