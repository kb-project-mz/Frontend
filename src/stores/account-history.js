import { defineStore } from 'pinia';
import apiInstance from '@/util/axios-instance';

export const useAccountHistoryStore = defineStore('accountHistory', {
  state: () => ({
    accountHistory: [],
    accountHistoryThisMonth: [],
  }),

  actions: {
    async getAccountHistoryList(memberId) {
      try {
        const res = await apiInstance.get(`/history/account/${memberId}`, {
          headers: {
            "Authorization":
              "Bearer eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJkbGVrZHVkMDEwMiIsInJvbGUiOiJST0xFX1VTRVIiLCJpYXQiOjE3MjcwOTMxMDQsImV4cCI6MTcyNzQzODcwNH0.CDpk_rBMERwApocgtppe8EtnuQkbxRpjLAJK2A7wBBo"
          }
        });
        this.accountHistory = res.data.data;

        const now = new Date();
        const thisYear = now.getFullYear();
        const thisMonth = now.getMonth() + 1;

        this.accountHistoryThisMonth = this.accountHistory.filter(history => {
          const accountDate = new Date(history.accountDate);
          const accountYear = accountDate.getFullYear();
          const accountMonth = accountDate.getMonth() + 1;

          return accountYear === thisYear && accountMonth == thisMonth;
        });
      } catch (err) {
        console.error(err);
      }
    }
  },
});
