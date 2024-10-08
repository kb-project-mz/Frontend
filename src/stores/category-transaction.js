import { defineStore } from "pinia";
import apiInstance from "@/util/axios-instance";

export const useCategoryTransactionStore = defineStore("categoryTransaction", {
  state: () => ({
    categoryData: [],
    mostSpentCategoryData: "",
  }),

  actions: {
    async fetchCategoryTransactionCount(memberIdx) {
      try {
        const res = await apiInstance.get(`/transaction/category-count/${memberIdx}`, {
          headers: {
            Authorization: localStorage.getItem("accessToken"),
          },
        });

        if (res.data && res.data.data) {
          this.categoryData = res.data.data;
        }
      } catch (error) {
        console.error("Error fetching category data:", error);
      }
    },

    async fetchMostSpentCategory(memberIdx) {
      try {
        const res = await apiInstance.get(`/transaction/most-spent-category/${memberIdx}`, {
          headers: {
            Authorization: localStorage.getItem("accessToken"),
          },
        });

        if (res.data && res.data.data) {
          this.mostSpentCategoryData = res.data.data;

          return res.data.data;
        } else {
          console.error("응답 데이터가 없습니다.");
        }
      } catch (error) {
        console.error("Error fetching most spent category data:", error);
      }
    },
  },
});
