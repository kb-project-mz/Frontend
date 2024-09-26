import { defineStore } from 'pinia';
import apiInstance from './axios-instance';

export const useBalanceStore = defineStore('balance', {
  state: () => ({
    TotalBalanceList: [],
  }),
  actions: {
    async getTotalBalance() {
      try {
        const response = await apiInstance.get(`/home/balance`);
        this.TotalBalanceList = response.data.data;
      } catch (error) {
        console.error('Failed to fetch total balance: ', error);
        throw error;
      }
    },
  },
});
