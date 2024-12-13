import { defineStore } from 'pinia';
import apiInstance from '@/util/axios-instance';
import { useAuthStore } from '@/stores/auth.js';

export const useTransactionStore = defineStore('transaction', {
  actions: {
    async fetchTransaction() {
      try {
        const authStore = useAuthStore();
        const response = await apiInstance.post(`/transaction`, {}, {
          headers: {
            Authorization: authStore.member.accessToken
          }
        });
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
    async getMonthlySummary(startDate, endDate) {
      try {
        const authStore = useAuthStore();
        const response = await apiInstance.get(`/transaction/summary?startDate=${startDate}&endDate=${endDate}`, {
          headers: {
            Authorization: authStore.member.accessToken
          }
        });
        return response.data.data;
      } catch(err) {
        console.error(err);
      }
    },
    async getMostAndMaximumUse(startDate, endDate) {
      try {
        const authStore = useAuthStore();
        const response = await apiInstance.get(`/transaction/top-usage?startDate=${startDate}&endDate=${endDate}`, {
          headers: {
            Authorization: authStore.member.accessToken
          }
        });
        return response.data.data;
      } catch(err) {
        console.error(err);
      }
    },
    async getFixedExpense() {
      try {
        const authStore = useAuthStore();
        const response = await apiInstance.get(`/transaction/fixed`, {
          headers: {
            Authorization: authStore.member.accessToken
          }
        });
        return response.data.data;
      } catch(err) {
        console.error(err);
      }
    },
    async getDailyExpense() {
      try {
        const authStore = useAuthStore();
        const response = await apiInstance.get(`/transaction/daily`, {
          headers: {
            Authorization: authStore.member.accessToken
          }
        });
        return response.data.data;
      } catch(err) {
        console.error(err);
      }
    },
    async getCategoryChartData(startDate, endDate) {
      try {
        const authStore = useAuthStore();
        const response = await apiInstance.get(`/transaction/category?startDate=${startDate}&endDate=${endDate}`, {
          headers: {
            Authorization: authStore.member.accessToken
          }
        });
        return response.data.data;
      } catch(err) {
        console.error(err);
      }
    }
  },
});
