<script setup>

</script>

<template>
    <div class="calendar">
      <div class="calendar-header">
        <button @click="prevMonth">이전</button>
        <h2>{{ currentYear }}년 {{ currentMonth + 1 }}월</h2>
        <button @click="nextMonth">다음</button>
      </div>
      <div class="calendar-grid">
        <div class="day" v-for="day in daysInMonth" :key="day.date">
          <div class="date">{{ day.date }}</div>
          <div class="expenses">지출: {{ getExpense(day.date) }} 원</div>
          <div class="income">수입: {{ getIncome(day.date) }} 원</div>
        </div>
      </div>
    </div>
  </template>
  
  <script>
  export default {
    data() {
      return {
        currentYear: new Date().getFullYear(),
        currentMonth: new Date().getMonth(),
        daysInMonth: [],
        expenses: [
          // 이 데이터는 예시입니다. 실제 데이터는 API에서 가져와서 이곳에 할당할 수 있습니다.
          { date: '2024-09-01', amount: 2000 },
          { date: '2024-09-05', amount: 5000 }
        ],
        incomes: [
          { date: '2024-09-01', amount: 3000 },
          { date: '2024-09-03', amount: 7000 }
        ]
      };
    },
    created() {
      this.generateCalendar();
    },
    methods: {
      // 캘린더 날짜 생성
      generateCalendar() {
        const daysInMonth = new Date(this.currentYear, this.currentMonth + 1, 0).getDate();
        this.daysInMonth = Array.from({ length: daysInMonth }, (v, i) => {
          return { date: new Date(this.currentYear, this.currentMonth, i + 1).toISOString().split('T')[0] };
        });
      },
      // 다음 달로 이동
      nextMonth() {
        if (this.currentMonth === 11) {
          this.currentMonth = 0;
          this.currentYear++;
        } else {
          this.currentMonth++;
        }
        this.generateCalendar();
      },
      // 이전 달로 이동
      prevMonth() {
        if (this.currentMonth === 0) {
          this.currentMonth = 11;
          this.currentYear--;
        } else {
          this.currentMonth--;
        }
        this.generateCalendar();
      },
      // 특정 날짜의 지출 금액 반환
      getExpense(date) {
        const expense = this.expenses.find(e => e.date === date);
        return expense ? expense.amount : 0;
      },
      // 특정 날짜의 수입 금액 반환
      getIncome(date) {
        const income = this.incomes.find(i => i.date === date);
        return income ? income.amount : 0;
      }
    }
  };
  </script>
  
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
    margin-bottom: 20px;
  }
  
  .calendar-grid {
    display: grid;
    grid-template-columns: repeat(7, 1fr);
    gap: 10px;
  }
  
  .day {
    padding: 10px;
    border: 1px solid #ccc;
    text-align: center;
  }
  
  .date {
    font-weight: bold;
  }
  
  .expenses, .income {
    margin-top: 5px;
  }
  </style>