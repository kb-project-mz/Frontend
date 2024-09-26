import { defineStore } from "pinia";
import apiInstance from "./axios-instance";

export const useBalanceStore = defineStore("balance", {
  state: () => ({
    TotalBalance: 0,
  }),
  actions: {
    async getTotalBalance(memberId) {
      try {
        const reponse = await apiInstance.get(`/home/balance/${memberId}`);
        this.TotalBalance = response.data.data;
      } catch (error) {
        console.error("Failed to fetch total balance: ", error);
        throw error;
      }
    },
  },
});
