import { defineStore } from 'pinia';
import axios from 'axios';
import apiInstance from './axios-instance';

export const useChallengeStore = defineStore('challenge', {
  state: () => ({
    challengeList: [],
    detailedCategories: [],
    chartData: []
  }),

  actions: {
    async getChallengeList(memberIdx) {
      try {
        const res = await apiInstance.get(`/challenge/${memberIdx}`, {
          headers: {
            Authorization: localStorage.getItem("accessToken")
          }
        });

        this.challengeList = res.data.data;
      } catch (error) {
        console.error('Error fetching challenges:', error);
        throw error;
      }
    },

    async insertChallenge(challengeData) {
      try {
        const res = await apiInstance.post(`/challenge`, challengeData, {
          headers: {
            Authorization: localStorage.getItem("accessToken")
          }
        });

        this.challengeList.push(challengeData);
      } catch (error) {
        console.error('Error adding challenge:', error);
        throw error;
      }
    },

    async deleteChallenge(challengeId) {
      try {
        const res = await apiInstance.post(`/challenge/${challengeId}`, {}, {
          headers: {
            Authorization: localStorage.getItem("accessToken")
          }
        });

        const index = this.challengeList.findIndex((item) => item.id === challengeId);
        if (index !== -1) {
          this.challengeList.splice(index, 1);
        }
      } catch (error) {
        console.error('Error deleting challenge:', error);
        throw error;
      }
    },

    async getDetailedCategory(memberIdx, categoryId) {
      try {
        const res = await apiInstance.get(`/challenge/detailed-category/${memberIdx}/${categoryId}`, {
          headers: {
            Authorization: localStorage.getItem("accessToken")
          }
        });
        console.log(res.data.data);
        this.detailedCategories = res.data.data;
      } catch (errpt) {
        console.error("Error fetching detailed categories:", errpt);
      }
    },

    async getChallengeStatus(memberIdx) {
      try {
        const res = await apiInstance.get(`/challenge/status/${memberIdx}`, {
          headers: {
            Authorization: localStorage.getItem("accessToken")
          }
        });
        this.chartData = res.data.data;
      } catch (error) {
        console.error("Error fetching chart data:", error);
      }
    },
  },
});
