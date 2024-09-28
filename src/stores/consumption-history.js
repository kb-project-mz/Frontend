import { defineStore } from 'pinia';
import apiInstance from './axios-instance';

export const useConsumptionHistoryStore = defineStore('consumptionHistory', {
  state: () => ({
    cardHistory: [],
    cardHistoryThisMonth: [],
    cardHistoryLastMonth: []
  }),

  actions: {
    async getCardHistoryList(memberId) {
      try {
        const res = await apiInstance.get(`/history/card/${memberId}`, {
          headers: {
            Authorization: localStorage.getItem("accessToken")
          },
        });
        this.cardHistory = res.data.data;

        const now = new Date();
        const thisYear = now.getFullYear();
        const thisMonth = now.getMonth() + 1;

        this.cardHistoryThisMonth = this.cardHistory.filter((history) => {
            const consumptionDate = new Date(history.consumptionDate);
            const consumptionYear = consumptionDate.getFullYear();
            const consumptionMonth = consumptionDate.getMonth() + 1;

            return consumptionYear === thisYear && consumptionMonth == thisMonth;
        });

        let lastYear = thisYear;
        let lastMonth = thisMonth - 1;

        if (thisMonth == 1) {
          lastYear = thisYear - 1;
          lastMonth = 12;
        }

        this.cardHistoryLastMonth = this.cardHistory.filter((history) => {
            const consumptionDate = new Date(history.consumptionDate);
            const consumptionYear = consumptionDate.getFullYear();
            const consumptionMonth = consumptionDate.getMonth() + 1;

            return consumptionYear === lastYear && consumptionMonth == lastMonth;
        });
      } catch (err) {
        console.error(err);
      }
    },
  },
});
