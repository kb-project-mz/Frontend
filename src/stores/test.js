import { defineStore } from "pinia";
import apiInstance from "@/util/axios-instance";

export const useTestStore = defineStore("testStore", {
    state: () => ({
        questions: [],
        types: [],
        selectedType: null,
        options: new Map(),
        score: 0,
        impulseScore: 0,
        plannedScore: 0,
        costEffective: 0,
        goodForSatisfaction: 0,
        material: 0,
        experiential: 0,
    }),
    actions: {
        async fetchQuestions() {
            try {
                const response = await apiInstance.get("/test/questions");
                if (response.data.success) {
                    this.questions = response.data.data;

                    return response.data.data;
                } else {
                    console.error("질문을 가져오는 데 실패했습니다.", response.data.error);
                }
            } catch (error) {
                console.error("질문을 가져오는 중 오류가 발생했습니다:", error.message);
            }
        },
        async fetchOptions(questionIdx) {
            try {
                const response = await apiInstance.get(`/test/options/${questionIdx}`);
                if (response.data.success) {
                    this.options.set(questionIdx, response.data.data);
                    return response.data.data;
                } else {
                    console.error("질문을 가져오는 중 오류가 발생했습니다:", error.message);
                }
            } catch (error) {
                console.error("질문을 가져오는 중 오류가 발생했습니다:", error.message);
            }
        },
        async fetchTypes() {
            try {
                const response = await apiInstance.get("/test/result");
                if (response.data.success) {
                    this.types = response.data.data;
                    return response.data.data;
                } else {
                    console.error("질문을 가져오는 데 실패했습니다.", response.data.error);
                }
            } catch (error) {
                console.error("질문을 가져오는 중 오류가 발생했습니다:", error.message);
            }
        },
        selectType(type) {
            this.selectedType = type; // 선택된 타입을 상태로 저장
        },

        async sendSelectedType() {
            if (this.selectedType) {
                try {
                    const response = await apiInstance.post("/test/saveResult", { type: this.selectedType });
                    if (response.data.success) {
                        console.log("백엔드에 결과 저장 성공:", response.data);
                    } else {
                        console.error("백엔드에 결과 저장 실패:", response.data.error);
                    }
                } catch (error) {
                    console.error("백엔드에 결과 저장 중 오류 발생:", error.message);
                }
            } else {
                console.log("선택된 타입이 없습니다.");
            }
        },
        getOptionsByQuestionIdx(questionIdx) {
            return this.options.get(questionIdx) || [];
        },
        incrementScore(value) {
            this.score += value;
        },
        resetScore() {
            this.score = 0;
            this.impulseScore = 0;
            this.plannedScore = 0;
            this.costEffective = 0;
            this.goodForSatisfaction = 0;
            this.material = 0;
            this.experiential = 0;
        },
        incrementImpulseScore(value) {
            this.impulseScore += value;
        },
        incrementPlannedScore(value) {
            this.plannedScore += value;
        },
        incrementCostEffective(value) {
            this.costEffective += value;
        },
        incrementGoodForSatisfaction(value) {
            this.goodForSatisfaction += value;
        },
        incrementMaterialScore(value) {
            this.material += value;
        },
        incrementExperientialScore(value) {
            this.experiential += value;
        },
    },
});
