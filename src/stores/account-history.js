import { defineStore } from 'pinia';
import apiInstance from '@/util/axios-instance';

export const useAccountHistoryStore = defineStore("accountHistory", {
  state: () => ({
    accountHistory: [],
    accountHistoryThisMonth: [],
  }),

  actions: {
    async getAccountHistoryList(memberIdx) {
      try {
        const res = await apiInstance.get(`/history/account/${memberIdx}`, {
          headers: {
            Authorization: localStorage.getItem("accessToken")
          },
        });
        this.accountHistory = res.data.data;

        const now = new Date();
        const thisYear = now.getFullYear();
        const thisMonth = now.getMonth() + 1;

        this.accountHistoryThisMonth = this.accountHistory.filter((history) => {
          const accountDate = new Date(history.accountDate);
          const accountYear = accountDate.getFullYear();
          const accountMonth = accountDate.getMonth() + 1;

          return accountYear === thisYear && accountMonth == thisMonth;
        });

        console.log(this.accountHistory);
      } catch (err) {
        console.error(err);
      }
    },
  },
});
