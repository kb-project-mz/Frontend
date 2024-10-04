import { defineStore } from 'pinia';
import apiInstance from '@/util/axios-instance';

export const useCardTransactionStore = defineStore('cardTransaction', {
  state: () => ({
    cardTransaction: [],
    cardTransactionThisMonth: [],
    cardTransactionLastMonth: [],
    cardAmountBycardIdx: {},
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

        const now = new Date();
        const thisYear = now.getFullYear();
        const thisMonth = now.getMonth() + 1;

        // 이번 달 거래 내역 필터링
        this.cardTransactionThisMonth = this.cardTransaction.filter((transaction) => {
          const cardTransactionDate = new Date(transaction.cardTransactionDate);
          const cardTransactionYear = cardTransactionDate.getFullYear();
          const cardTransactionMonth = cardTransactionDate.getMonth() + 1;

          return cardTransactionYear === thisYear && cardTransactionMonth === thisMonth;
        });

        let lastYear = thisYear;
        let lastMonth = thisMonth - 1;

        if (thisMonth === 1) {
          lastYear = thisYear - 1;
          lastMonth = 12;
        }

        // 지난 달 거래 내역 필터링
        this.cardTransactionLastMonth = this.cardTransaction.filter((transaction) => {
          const cardTransactionDate = new Date(transaction.cardTransactionDate);
          const cardTransactionYear = cardTransactionDate.getFullYear();
          const cardTransactionMonth = cardTransactionDate.getMonth() + 1;

          return cardTransactionYear === lastYear && cardTransactionMonth === lastMonth;
        });
      } catch (err) {
        console.error(err);
      }
    },
    getSelectedPeriodCardTransactionData(startYear, startMonth, startDate, endYear, endMonth, endDate) {
      const start = new Date(startYear, startMonth - 1, startDate);
      const end = new Date(endYear, endMonth - 1, endDate, 23, 59, 59);

      const filteredCardTransactionData = this.cardTransaction.filter((item) => {
        const consumptionDate = new Date(item.cardTransactionDate);
        return consumptionDate >= start && consumptionDate <= end;
      });

      return filteredCardTransactionData;
    },
    async getCardTransactionListByCardIdx() {
      try {
        if (!this.cardTransactionThisMonth || this.cardTransactionThisMonth.length === 0) {
          const memberIdx = localStorage.getItem("memberIdx");
          await this.getCardTransactionList(memberIdx);
        }
    
        const cardAmountBycardIdx = {};
    
        // 이번 달 거래 내역을 기준으로 카드별 금액을 합산
        this.cardTransactionThisMonth.forEach(transaction => {
          const { cardIdx: transactionCardIdx, amount } = transaction;
    
          if (!cardAmountBycardIdx[transactionCardIdx]) {
            cardAmountBycardIdx[transactionCardIdx] = 0;
          }
    
          // 카드별로 금액을 합산
          cardAmountBycardIdx[transactionCardIdx] += amount;
        });
    
        this.cardAmountBycardIdx = cardAmountBycardIdx;    
      } catch (error) {
        console.error("Error in getCardTransactionListByCardIdx:", error);
      }
    }
  },
});
