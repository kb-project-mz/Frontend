import { defineStore } from 'pinia';
import apiInstance from '@/util/axios-instance';
import { useAuthStore } from '@/stores/auth.js';

export const useTransactionAnalysisStore = defineStore('transactionAnalysis', {
  state: () => ({
    mostAndMaximum: '',
    recommendation: '',
    fixedExpenses: '',
  }),

  actions: {
    async getMostAndMaximumUse(memberIdx, startYear, startMonth, startDay, endYear, endMonth, endDay) {
      try {
        const authStore = useAuthStore();
        const res = await apiInstance.get(`/transaction/top-usage`, {
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

        this.mostAndMaximum = res.data.data;
      } catch (err) {
        console.error(err);
      }
    },

    async fetchAiRecommendation(memberIdx, startYear, startMonth, endDay) {
      try {
        const authStore = useAuthStore();
        const res = await apiInstance.get(`/transaction/recommendation`, {
          params: {
            memberIdx: memberIdx,
            startYear: startYear,
            startMonth: startMonth,
            startDay: 1,
            endYear: startYear,
            endMonth: startMonth,
            endDay: endDay,
          },
          headers: {
            Authorization: authStore.member.accessToken,
          },
        });

        this.recommendation = res.data.data;
        return this.recommendation;
      } catch (err) {
        console.error(err);
      }
    },

    async fetchFixedExpenses(memberIdx) {
      try {
        const authStore = useAuthStore();
        const res = await apiInstance.get(`/transaction/fixed/${memberIdx}`, {
          headers: {
            Authorization: authStore.member.accessToken,
          },
        });

        this.fixedExpenses = res.data.data;
      } catch (err) {
        console.error(err);
      }
    },
  },
});
