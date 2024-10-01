import { defineStore } from 'pinia';
import apiInstance from '@/util/axios-instance';

export const useTransactionAnalysisStore = defineStore('transactionAnalysis', {
  state: () => ({
    mostAndMaximum: ""
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
          }
        });

        this.mostAndMaximum = res.data.data;
      } catch (err) {
        console.error(err);
      }
    }
  },
});
