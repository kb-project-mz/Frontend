import { defineStore } from 'pinia';
import apiInstance from '@/util/axios-instance';

export const useAccountTransactionStore = defineStore("accountTransaction", {
  state: () => ({
    accountTransaction: [],
    accountTransactionThisMonth: [],
  }),

  actions: {
    async getAccountTransactionList(memberIdx) {
      try {
        const res = await apiInstance.get(`/transaction/account/${memberIdx}`, {
          headers: {
            Authorization: localStorage.getItem("accessToken")
          },
        });
        this.accountTransaction = res.data.data;

        const now = new Date();
        const thisYear = now.getFullYear();
        const thisMonth = now.getMonth() + 1;

        this.accountHistoryThisMonth = this.accountTransaction.filter((transaction) => {
          const accountTransactionDate = new Date(transaction.accountTransactionDate);
          const accountTransactionYear = accountTransactionDate.getFullYear();
          const accountTransactionMonth = accountTransactionDate.getMonth() + 1;

          return accountTransactionYear === thisYear && accountTransactionMonth == thisMonth;
        });

        console.log(this.accountTransaction);
      } catch (err) {
        console.error(err);
      }
    },
  },
});
