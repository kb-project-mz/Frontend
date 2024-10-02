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

        // TODO: 10월 소비 내역이 없는 관계로 now를 9월로 고정, 추후 new Date()로 변경해야 함
        const now = new Date(2024, 8, 30);
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

    async getCardTransactionListByCardIdx(cardIdx) {
      try {
        // 데이터가 없을 경우, 로드
        if (!this.cardTransactionThisMonth || this.cardTransactionThisMonth.length === 0) {
          console.log("이번 달 카드 거래 내역이 없으므로 데이터를 가져옵니다.");
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
        console.log("최종 cardAmountBycardIdx:", this.cardAmountBycardIdx);
    
      } catch (error) {
        console.error("Error in getCardTransactionListByCardIdx:", error);
      }
    }
  },
});