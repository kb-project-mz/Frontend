import { defineStore } from 'pinia';
import apiInstance from '@/util/axios-instance';

export const useCardTransactionStore = defineStore('cardTransaction', {
  state: () => ({
    cardTransaction: [],
    cardTransactionThisMonth: [],
    cardTransactionLastMonth: []
  }),

  actions: {
    async getCardTransactionList(memberIdx) {
      try {
        const res = await apiInstance.get(`/transaction/card/${memberIdx}`, {
          headers: {
            Authorization: localStorage.getItem("accessToken")
          },
        });
        this.cardTransaction = res.data.data;

        // TODO: 10월 소비 내역이 없는 관계로 now를 9월로 고정, 추후 new Date()로 변경해야 함
        const now = new Date(2024, 8, 30);
        const thisYear = now.getFullYear();
        const thisMonth = now.getMonth() + 1;

        this.cardTransactionThisMonth = this.cardTransaction.filter((transaction) => {
            const cardTransactionDate = new Date(transaction.cardTransactionDate);
            const cardTransactionYear = cardTransactionDate.getFullYear();
            const cardTransactionMonth = cardTransactionDate.getMonth() + 1;

            return cardTransactionYear === thisYear && cardTransactionMonth == thisMonth;
        });

        let lastYear = thisYear;
        let lastMonth = thisMonth - 1;

        if (thisMonth == 1) {
          lastYear = thisYear - 1;
          lastMonth = 12;
        }

        this.cardTransactionLastMonth = this.cardTransaction.filter((transaction) => {
            const cardTransactionDate = new Date(transaction.cardTransactionDate);
            const cardTransactionYear = cardTransactionDate.getFullYear();
            const cardTransactionMonth = cardTransactionDate.getMonth() + 1;

            return cardTransactionYear === lastYear && cardTransactionMonth == lastMonth;
        });
      } catch (err) {
        console.error(err);
      }
    },
  },
});
