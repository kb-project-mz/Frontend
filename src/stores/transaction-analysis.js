import { defineStore } from "pinia";
import apiInstance from "@/util/axios-instance";

export const useTransactionAnalysisStore = defineStore("transactionAnalysis", {
  state: () => ({
    mostAndMaximum: "",
    recommendation: "",
  }),

  actions: {
    async getMostAndMaximumUse(
      memberIdx,
      startYear,
      startMonth,
      startDay,
      endYear,
      endMonth,
      endDay
    ) {
      try {
        const authData = JSON.parse(localStorage.getItem("auth"));
        const res = await apiInstance.get(`/transaction/top-usage`, {
          params: {
            memberIdx: memberIdx,
            startYear: startYear,
            startMonth: startMonth + 1,
            startDay: startDay,
            endYear: endYear,
            endMonth: endMonth + 1,
            endDay: endDay,
          },
          headers: {
            Authorization: `Bearer ${authData.accessToken}`,
          },
        });

        this.mostAndMaximum = res.data.data;
        console.log(res.data.data);
      } catch (err) {
        console.error(err);
      }
    },

    async fetchAiRecommendation(memberIdx, startYear, startMonth, endDay) {
      try {
        const authData = JSON.parse(localStorage.getItem("auth"));
        const res = await apiInstance.get(`/transaction/recommendation`, {
          params: {
            memberIdx: memberIdx,
            startYear: startYear,
            startMonth: startMonth,
            startDay: 1,
            endYear: startYear,
            endMonth: startMonth,
            endDay: endDay,
          },
          headers: {
            Authorization: `Bearer ${authData.accessToken}`,
          },
        });

        this.recommendation = res.data.data;
        return this.recommendation;
      } catch (err) {
        console.error(err);
      }
    },
  },
});
