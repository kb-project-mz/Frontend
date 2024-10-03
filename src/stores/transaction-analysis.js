import { defineStore } from 'pinia';
import apiInstance from '@/util/axios-instance';

export const useTransactionAnalysisStore = defineStore('transactionAnalysis', {
  state: () => ({
    mostAndMaximum: "",
    recommendation: ""
  }),

  actions: {
    async getMostAndMaximumUse(memberIdx, startYear, startMonth, startDay, endYear, endMonth, endDay) {
      try {
        const res = await apiInstance.get(`/transaction/most`, {
          params: {
            memberIdx: memberIdx,
            startYear: startYear,
            startMonth: startMonth,
            startDay: startDay,
            endYear: endYear,
            endMonth: endMonth,
            endDay: endDay
          },
          headers: {
            Authorization: localStorage.getItem("accessToken")
          }
        });

        this.mostAndMaximum = res.data.data;
      } catch (err) {
        console.error(err);
      }
    },

    async fetchAiRecommendation (memberIdx, startYear, startMonth, endDay) {
      try {
        const res = await apiInstance.get(`/transaction/recommendation`, {
          params: {
            memberIdx: memberIdx,
            startYear: startYear,
            startMonth: startMonth,
            startDay: 1,
            endYear: startYear,
            endMonth: startMonth,
            endDay: endDay
          },
          headers: {
            Authorization: localStorage.getItem("accessToken")
          }
        });
        
        this.recommendation = res.data.data;
        return this.recommendation;
      } catch (err) {
        console.error(err);
      }
    }
  },
});
