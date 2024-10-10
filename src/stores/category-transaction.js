import { defineStore } from 'pinia';
import apiInstance from '@/util/axios-instance';
import { useAuthStore } from '@/stores/auth.js';

export const useCategoryTransactionStore = defineStore("categoryTransaction", {
  state: () => ({
    categoryData: [],
    mostSpentCategoryData: "",
  }),

  actions: {
    async fetchCategoryTransactionCount(memberIdx, startYear, startMonth, startDay, endYear, endMonth, endDay) {
      const authStore = useAuthStore();
      try {
        const res = await apiInstance.get(`/transaction/category-count`, {
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

        if (res.data && res.data.data) {
          this.categoryData = res.data.data;
        }
      } catch (error) {
        console.error("Error fetching category data:", error);
      }
    },

    async fetchMostSpentCategory(memberIdx, startYear, startMonth, startDay, endYear, endMonth, endDay) {
      const authStore = useAuthStore();
      try {
        const res = await apiInstance.get(`/transaction/most-spent-category`, {
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

        if (res.data && res.data.data) {
          this.mostSpentCategoryData = res.data.data;

          return res.data.data;
        } else {
          console.error("응답 데이터가 없습니다.");
        }
      } catch (error) {
        console.error("Error fetching most spent category data:", error);
      }
    },
  },
});
