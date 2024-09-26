import { defineStore } from 'pinia';
import apiInstance from '@/util/axios-instance';

export const useConsumptionAnalysisStore = defineStore('consumptionAnalysis', {
  state: () => ({
    mostAndMaximum: ""
  }),

  actions: {
    async getMostAndMaximumUse(memberId, startYear, startMonth, startDay, endYear, endMonth, endDay) {
      try {
        const res = await apiInstance.get(`/consumption/most`, {
          headers: {
            "Authorization": "Bearer eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJkbGVrZHVkMDEwMiIsInJvbGUiOiJST0xFX1VTRVIiLCJpYXQiOjE3MjY5OTAzODMsImV4cCI6MTcyNzA3Njc4M30.ccTmv2HYPALzTt26S2p0Z53YshnRdVidP9finaNG4rs"
          }
        },
        {
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
