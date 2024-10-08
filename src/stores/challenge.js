import { defineStore } from "pinia";
import apiInstance from "@/util/axios-instance";




export const useChallengeStore = defineStore("challenge", {
  state: () => ({
    challengeList: [],
    detailedCategories: [],
    chartData: [],
    peerChallengeList: [],
  }),

  actions: {
    async getChallengeList(memberIdx) {
      try {
        const authData = JSON.parse(localStorage.getItem("auth"));
        const res = await apiInstance.get(`/challenge/${memberIdx}`, {
          headers: {
            Authorization: `Bearer ${authData.accessToken}`,
          },
        });
        this.challengeList = res.data.data;
      } catch (error) {
        console.error("Error fetching challenges:", error);
        throw error;
      }
    },

    async insertChallenge(challengeData) {
      try {
        const authData = JSON.parse(localStorage.getItem("auth"));
        const res = await apiInstance.post(`/challenge`, challengeData, {
          headers: {
            Authorization: `Bearer ${authData.accessToken}`,
          },
        });

        this.challengeList.push(challengeData);
      } catch (error) {
        console.error("Error adding challenge:", error);
        throw error;
      }
    },

    async deleteChallenge(challengeId) {
      try {
        const authData = JSON.parse(localStorage.getItem("auth"));
        const res = await apiInstance.post(
          `/challenge/${challengeId}`,
          {},
          {
            headers: {
              Authorization: `Bearer ${authData.accessToken}`,
            },
          }
        );

        const index = this.challengeList.findIndex(
          (item) => item.id === challengeId
        );
        if (index !== -1) {
          this.challengeList.splice(index, 1);
        }
      } catch (error) {
        console.error("Error deleting challenge:", error);
        throw error;
      }
    },

    async getDetailedCategory(memberIdx, categoryId) {
      try {
        const authData = JSON.parse(localStorage.getItem("auth"));
        const res = await apiInstance.get(
          `/challenge/detailed-category/${memberIdx}/${categoryId}`,
          {
            headers: {
              Authorization: `Bearer ${authData.accessToken}`,
            },
          }
        );
        this.detailedCategories = res.data.data;
      } catch (errpt) {
        console.error("Error fetching detailed categories:", errpt);
      }
    },

    async getChallengeStatus(memberIdx) {
      try {
        const authData = JSON.parse(localStorage.getItem("auth"));
        const res = await apiInstance.get(`/challenge/status/${memberIdx}`, {
          headers: {
            Authorization: `Bearer ${authData.accessToken}`,
          },
        });
        this.chartData = res.data.data;
      } catch (error) {
        console.error("Error fetching chart data:", error);
      }
    },

    async getPeerChallengeList(memberIdx) {
      try {
				const authData = JSON.parse(localStorage.getItem("auth"));
        const res = await apiInstance.get(`/challenge/peer/${memberIdx}`, {
          headers: {
            Authorization: `Bearer ${authData.accessToken}`,
          },
        });
        this.peerChallengeList = res.data.data;
      } catch (error) {
        console.error("Error fetching peer challenge data:", error);
      }
    },
  },
});
