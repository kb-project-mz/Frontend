import { defineStore } from 'pinia';
import apiInstance from '@/util/axios-instance';
import { useAuthStore } from '@/stores/auth.js';

export const useTransactionStore = defineStore('transaction', {
  state: () => ({

  }),

  actions: {
    async fetchTransaction() {
      try {
        const authStore = useAuthStore();
        const response = await apiInstance.post(`/transaction`, {}, {
          headers: {
            Authorization: authStore.member.accessToken
          }
        });
        console.log("개수: ", response.data.data);
        return response.data.data;
      } catch(err) {
        console.error(err);
      }
    },
    async getRecommendation() {
      try {
        const authStore = useAuthStore();
        const response = await apiInstance.get(`/transaction/recommendation`, {
          headers: {
            Authorization: authStore.member.accessToken
          }
        });
        return response.data.data;
      } catch(err) {
        console.error(err);
      }
    },
    async getCardTransactionListByCardIdx() {
      try {
        if (
          !this.cardTransactionThisMonth ||
          this.cardTransactionThisMonth.length === 0
        ) {
          const authData = JSON.parse(localStorage.getItem('auth'));
          const memberIdx = authData.memberIdx;
          await this.getCardTransactionList(memberIdx);
        }

        const cardAmountBycardIdx = {};

        this.cardTransactionThisMonth.forEach((transaction) => {
          const { cardIdx: transactionCardIdx, amount } = transaction;

          if (!cardAmountBycardIdx[transactionCardIdx]) {
            cardAmountBycardIdx[transactionCardIdx] = 0;
          }

          cardAmountBycardIdx[transactionCardIdx] += amount;
        });

        this.cardAmountBycardIdx = cardAmountBycardIdx;
      } catch (error) {
        console.error('Error in getCardTransactionListByCardIdx:', error);
      }
    },
  },
});
