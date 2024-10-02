import { defineStore } from "pinia";
import apiInstance from "@/util/axios-instance";

export const useChallengeTop3Store = defineStore("challengeTop3", {
  state: () => ({
    ChallengeTop3List: [],
  }),
  actions: {
    async getChallengeTop3(memberIdx) {
      try {
        const response = await apiInstance.get(`/home/challenge/${memberIdx}`);
        this.ChallengeTop3List = response.data.data;
      } catch(error) {
        console.log('Failed to fetch challenge top 3: ', error);
        throw error;
      }
    }
  }
});
