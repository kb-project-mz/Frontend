import { defineStore } from 'pinia';
import apiInstance from '@/util/axios-instance';
import { useAuthStore } from '@/stores/auth.js';

export const useAccountTransactionStore = defineStore('accountTransaction', {
  state: () => ({
    accountTransaction: [],
    accountTransactionThisMonth: [],
    accountTransactionLastMonth: [],
  }),

  actions: {
    async getAccountTransactionList(memberIdx) {
      try {
        const authStore = useAuthStore();
        const res = await apiInstance.get(`/transaction/account/${memberIdx}`, {
          headers: {
            Authorization: authStore.member.accessToken,
          },
        });
        this.accountTransaction = res.data.data;

        // TODO: 10월 소비 내역이 없는 관계로 now를 9월로 고정, 추후 new Date()로 변경해야 함
        const now = new Date(2024, 8, 30);
        const thisYear = now.getFullYear();
        const thisMonth = now.getMonth() + 1;

        this.accountTransactionThisMonth = this.accountTransaction.filter(
          (transaction) => {
            const accountTransactionDate = new Date(
              transaction.accountTransactionDate
            );
            const accountTransactionYear = accountTransactionDate.getFullYear();
            const accountTransactionMonth =
              accountTransactionDate.getMonth() + 1;

            return (
              accountTransactionYear === thisYear &&
              accountTransactionMonth == thisMonth
            );
          }
        );

        let lastYear = thisYear;
        let lastMonth = thisMonth - 1;

        if (thisMonth == 1) {
          lastYear = thisYear - 1;
          lastMonth = 12;
        }

        this.accountTransactionLastMonth = this.accountTransaction.filter(
          (transaction) => {
            const accountTransactionDate = new Date(
              transaction.accountTransactionDate
            );
            const accountTransactionYear = accountTransactionDate.getFullYear();
            const accountTransactionMonth =
              accountTransactionDate.getMonth() + 1;

            return (
              accountTransactionYear === lastYear &&
              accountTransactionMonth == lastMonth
            );
          }
        );
      } catch (err) {
        console.error(err);
      }
    },
    getSelectedPeriodAccountTransactionData(
      startYear,
      startMonth,
      startDate,
      endYear,
      endMonth,
      endDate
    ) {
      const start = new Date(startYear, startMonth - 1, startDate);
      const end = new Date(endYear, endMonth - 1, endDate, 23, 59, 59);

      const filteredAccountTransactionData = this.accountTransaction.filter(
        (item) => {
          const consumptionDate = new Date(item.accountTransactionDate);
          return consumptionDate >= start && consumptionDate <= end;
        }
      );

      return filteredAccountTransactionData;
    },
  },
});
