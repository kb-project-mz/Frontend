import { defineStore } from "pinia";
import apiInstance from "@/util/axios-instance";

export const useCategoryTransactionStore = defineStore("categoryTransaction", {
    state: () => ({
        categoryData: [], // 카테고리별 거래 데이터 저장
    }),

    actions: {
        // 데이터를 가져오는 함수
        async fetchCategoryTransactionCount(memberIdx) {
            try {
                const res = await apiInstance.get(`/transaction/category-count/${memberIdx}`, {
                    headers: {
                        Authorization: localStorage.getItem("accessToken"),
                    },
                });

                // 응답 데이터가 존재하면 categoryData에 저장
                if (res.data && res.data.data) {
                    this.categoryData = res.data.data;
                }
            } catch (error) {
                console.error("Error fetching category data:", error);
            }
        },
    },
});
