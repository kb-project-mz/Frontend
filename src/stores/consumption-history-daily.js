// stores/consumption-history-daily.js
import { defineStore } from "pinia";
import apiInstance from "./axios-instance";

export const useDailyConsumptionHistoryDailyStore = defineStore("dailyConsumptionHistory", {
    state: () => ({
        cardHistoryToday: [], // 오늘 소비 내역을 저장할 상태
    }),

    actions: {
        // 특정 날짜의 소비 내역을 가져오는 액션
        async getCardHistoryForDate(memberId, targetDate) {
            try {
                const res = await apiInstance.get(`/consumption/card/history/${memberId}`);

                // targetDate로 필터링
                const target = new Date(targetDate);
                this.cardHistoryToday = res.data.filter((history) => {
                    const consumptionDate = new Date(history.consumptionDate);
                    return (
                        consumptionDate.getFullYear() === target.getFullYear() && consumptionDate.getMonth() === target.getMonth() && consumptionDate.getDate() === target.getDate()
                    );
                });
            } catch (err) {
                console.error("Error fetching card history for date:", err);
            }
        },
    },
});
