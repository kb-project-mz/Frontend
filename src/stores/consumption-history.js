// stores/consumption-history.js
import { defineStore } from "pinia";
import apiInstance from "./axios-instance";

export const useConsumptionHistoryStore = defineStore("consumptionHistory", {
    state: () => ({
        cardHistoryToday: [], // 오늘 소비 내역을 저장할 상태
    }),

<<<<<<< Updated upstream
  actions: {
    async getCardHistoryList(memberId) {
      try {
        const res = await apiInstance.get(`/consumption/card/history/${memberId}`, {
          headers: {
            "Authorization": "Bearer eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJkbGVrZHVkMDEwMiIsInJvbGUiOiJST0xFX1VTRVIiLCJpYXQiOjE3MjY5OTAzODMsImV4cCI6MTcyNzA3Njc4M30.ccTmv2HYPALzTt26S2p0Z53YshnRdVidP9finaNG4rs"
          }
        });
        this.cardHistory = res.data.data;

        const now = new Date();
        const thisYear = now.getFullYear();
        const thisMonth = now.getMonth() + 1;

        this.cardHistoryThisMonth = this.cardHistory.filter(history => {
          const consumptionDate = new Date(history.consumptionDate);
          const consumptionYear = consumptionDate.getFullYear();
          const consumptionMonth = consumptionDate.getMonth() + 1;

          return consumptionYear === thisYear && consumptionMonth == thisMonth;
        });

        let lastYear = thisYear;
        let lastMonth = thisMonth - 1;

        if (thisMonth == 1) {
          lastYear = thisYear - 1;
          lastMonth = 12;
        }

        this.cardHistoryLastMonth = this.cardHistory.filter(history => {
          const consumptionDate = new Date(history.consumptionDate);
          const consumptionYear = consumptionDate.getFullYear();
          const consumptionMonth = consumptionDate.getMonth() + 1;

          return consumptionYear === lastYear && consumptionMonth == lastMonth;
        });

      } catch (err) {
        console.error(err);
      }
    }
  },
=======
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
>>>>>>> Stashed changes
});
