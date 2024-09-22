import { defineStore } from 'pinia';
import apiInstance from './axios-instance';

export const useAccountHistoryStore = defineStore('accountHistory', {
  state: () => ({
    accountHistory: [],
    accountHistoryThisMonth: [],
  }),

  actions: {
    async getAccountHistoryList(memberId) {
      try {
        const res = await apiInstance.get(`/consumption/account/history/${memberId}`, {
          headers: {
            "Authorization": "Bearer eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJkbGVrZHVkMDEwMiIsInJvbGUiOiJST0xFX1VTRVIiLCJpYXQiOjE3MjY5OTAzODMsImV4cCI6MTcyNzA3Njc4M30.ccTmv2HYPALzTt26S2p0Z53YshnRdVidP9finaNG4rs"
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
