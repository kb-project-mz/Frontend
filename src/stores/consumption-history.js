import { defineStore } from 'pinia';
import apiInstance from './axios-instance';

export const useConsumptionHistoryStore = defineStore('consumptionHistory', {
  state: () => ({
    cardHistory: []
  }),

  actions: {
    async getCardHistoryList(memberId) {
      try {
        const res = await apiInstance.get(`/consumption/card/history/${memberId}`);
        this.cardHistory = res.data;
      } catch (err) {
        console.error(err);
      }
    }
  },
});
