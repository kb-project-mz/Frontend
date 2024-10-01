import { defineStore } from "pinia";
import apiInstance from "@/util/axios-instance";

export const useBalanceStore = defineStore("balance", {
  state: () => ({
    TotalBalanceList: [],
  }),
  actions: {
    async getTotalBalance(memberIdx) {
      try {
        const response = await apiInstance.post(`/home/balance/${memberIdx}`);
        this.TotalBalanceList = response.data.data;
      } catch (error) {
        console.error("Failed to fetch total balance: ", error);
        throw error;
      }
    },
  },
});
