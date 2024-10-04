import { defineStore } from "pinia";
import apiInstance from "@/util/axios-instance";

export const useCategoryTransactionStore = defineStore("categoryTransaction", {
    state: () => ({
        categoryData: [], // 카테고리별 거래 데이터 저장
        mostSpentCategoryData: "",
    }),

    actions: {
        // 백엔드에서 일별로 합산된 카테고리 데이터를 가져오는 함수
        async fetchCategoryTransactionCount(memberIdx) {
            try {
                const res = await apiInstance.get(`/transaction/category-count/${memberIdx}`, {
                    headers: {
                        Authorization: localStorage.getItem("accessToken"),
                    },
                });

                if (res.data && res.data.data) {
                    this.categoryData = res.data.data; // 합산된 카테고리 데이터를 저장
                }
            } catch (error) {
                console.error("Error fetching category data:", error);
            }
        },

        // 백엔드에서 가장 많이 지출한 카테고리 데이터를 가져오는 함수
        // Pinia store에서 데이터를 가져오는 부분에 로그 추가
        async fetchMostSpentCategory(memberIdx) {
            try {
                const res = await apiInstance.get(`/transaction/most-spent-category/${memberIdx}`, {
                    headers: {
                        Authorization: localStorage.getItem("accessToken"),
                    },
                });

                // 응답 데이터가 제대로 들어왔는지 확인
                console.log("API 응답 데이터:", res.data);

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
