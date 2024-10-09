import { defineStore } from "pinia";
import apiInstance from "@/util/axios-instance";
import { useAuthStore } from "@/stores/auth";

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
        surveyInfo: null,
        birthYear: null,
        selectedGender: null,
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
                    console.error("데이터 전송 성공", response.data.error);
                }
            } catch (error) {
                console.error("데이터 전송 실패", error.message);
            }
        },
        async sendType(result) {
            const authStore = useAuthStore(); 
            const memberIdx = authStore.member.memberIdx || null; 
            const typeIdx = result;
            const birthYear = this.birthYear;
            const selectedGender = this.selectedGender;

            console.log('여기서도 찍히나', birthYear);
            console.log('이곳에서도', selectedGender);
            try {
                const response = await apiInstance.post("/test/result", {
                    typeIdx: typeIdx,
                    memberIdx: memberIdx,
                    birthYear: birthYear,  
                    gender: selectedGender, 
                });
                console.log("데이터 전송 성공:", response.data);
            } catch (error) {
                console.error("데이터 전송 실패:", error);
            }
        },

        async fetchSurveyInfo(memberId) {
            try {
                const response = await apiInstance.get(`/test/survey/${memberId}`);
                if (response.data.success) {
                    this.surveyInfo = response.data.data; // 받아온 데이터를 상태에 저장
                    this.birthYear = this.surveyInfo.birthYear.split('-')[0];
                    this.selectedGender = this.surveyInfo.gender;
                } else {
                    console.error("정보를 가져오는 데 실패했습니다.", response.data.error);
                }
            } catch (error) {
                console.error("정보를 가져오는 중 오류가 발생했습니다:", error.message);
            }
        },

        setBirthYear(year) {
            this.birthYear = year;
        },
        setSelectedGender(gender) {
            this.selectedGender = gender;
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
