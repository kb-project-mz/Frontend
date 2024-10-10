import { defineStore } from 'pinia';
import apiInstance from '@/util/axios-instance';
import { useAuthStore } from '@/stores/auth.js';

export const useCategoryTransactionStore = defineStore("categoryTransaction", {
  state: () => ({
    categoryDataThisMonth: [],
    categoryDataSelectedPeriod: [],
    mostSpentCategoryThisMonth: "",
    mostSpentCategorySelectedPeriod: "",
  }),

  actions: {
    async fetchCategoryTransactionCount(memberIdx, startYear, startMonth, startDay, endYear, endMonth, endDay) {
      const authStore = useAuthStore();
      try {
        const res = await apiInstance.get(`/transaction/category`, {
          params: {
            memberIdx: memberIdx,
            startYear: startYear,
            startMonth: startMonth + 1,
            startDay: startDay,
            endYear: endYear,
            endMonth: endMonth + 1,
            endDay: endDay,
          },
          headers: {
            Authorization: authStore.member.accessToken,
          },
        });

        const getEndDay = (year, month) => {
          const isLeapYear = (year) => (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0;
          const daysInMonth = [31, isLeapYear(year) ? 29 : 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
          return daysInMonth[month];
        }

        const today = new Date();
        const start = new Date(today.getFullYear(), today.getMonth(), 1); 
        const last = new Date(today.getFullYear(), today.getMonth(), getEndDay(today.getFullYear(), today.getMonth()));

        if (res.data.data && res.data.data.length > 0) {
          if (new Date(startYear, startMonth, startDay).getTime() == start.getTime() && new Date(endYear, endMonth, endDay).getTime() == last.getTime()) {
            this.categoryDataThisMonth = res.data.data;
            this.mostSpentCategoryThisMonth = res.data.data[0].categoryName;
            console.log(this.categoryDataThisMonth);
          } else {
            this.categoryDataSelectedPeriod = res.data.data;
            this.mostSpentCategorySelectedPeriod = res.data.data[0].categoryName;
            console.log(this.categoryDataSelectedPeriod);
          }
        } else if (res.data.data) {
          if (new Date(startYear, startMonth, startDay).getTime() == start.getTime() && new Date(endYear, endMonth, endDay).getTime() == last.getTime()) {
            this.categoryDataThisMonth = [];
            this.mostSpentCategoryThisMonth = "";
            console.log(this.categoryDataThisMonth);
          } else {
            this.categoryDataSelectedPeriod = [];
            this.mostSpentCategorySelectedPeriod = "";
            console.log(this.categoryDataSelectedPeriod);
          }
        }
      } catch (error) {
        console.error("Error fetching category data:", error);
      }
    }
  },
});