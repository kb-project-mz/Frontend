import { defineStore } from 'pinia';
import apiInstance from '@/util/axios-instance';

export const useTestResultStore = defineStore('testResult', {
  state: () => ({
    TestResult: [],
  }),

  actions: {
    async getTestResult(memberIdx) {
      try {
        const response = await apiInstance.get(`/home/test/${memberIdx}`);
        this.TestResult = response.data.data;
        console.log('1111111111111',this.TestResult);
      } catch (error) {
        console.error('Failed to fetch test result : ', error);
        throw error;
      }
    },
  },
});
