import { defineStore } from 'pinia';
import apiInstance from './axios-instance';

export const useConsumptionAnalysisStore = defineStore('consumptionAnalysis', {
  state: () => ({
    mostAndMaximum: ""
  }),

  actions: {
    async getMostAndMaximumUse(memberId, startYear, startMonth, startDay, endYear, endMonth, endDay) {
      try {
        const res = await apiInstance.get(`/consumption/test`, {
          params: {
            memberId: memberId,
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
