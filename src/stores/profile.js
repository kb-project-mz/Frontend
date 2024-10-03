import { defineStore } from 'pinia';
import apiInstance from '@/util/axios-instance';

export const useProfileStore = defineStore('profile', {
  state: () => ({
    profile: {},
    
  }),
  actions: {
    async getProfile() {
      try {
        const response = await apiInstance.get(`/member/info`, {
          headers: {
            Authorization: localStorage.getItem("accessToken")
          },
        });

        this.profile = response.data.data;
        console.log("프로필 데이터 불러옴", this.profile);
      } catch (error) {
        console.error('Failed to profile data', error);
        throw error;
      }
    },

  },
});
