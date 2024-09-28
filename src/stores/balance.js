import { defineStore } from "pinia";
import apiInstance from "./axios-instance";

export const useBalanceStore = defineStore("balance", {
  state: () => ({
    TotalBalanceList: [],
  }),
  actions: {
    async getTotalBalance(member_index) {
      try {
        const response = await apiInstance.get(`/home/balance/${member_index}`);
        this.TotalBalanceList = response.data.data;
      } catch (error) {
        console.error("Failed to fetch total balance: ", error);
        throw error;
      }
    },
  },
});
