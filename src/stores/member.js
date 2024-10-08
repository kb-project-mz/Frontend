import { defineStore } from "pinia";
import apiInstance from "@/util/axios-instance";
import { useAuthStore } from "@/stores/auth.js";

export const useMemberStore = defineStore("memberStore", {
  state: () => ({
    member: {
      memberId:'',
      memberName:'',
      birthday:'',
      gender:'',
      email:'',
      imageUrl:'',
    }
  }),

  actions: {
    async getProfile() {
      try {
        const authStore = useAuthStore();
        const response = await apiInstance.get(`/member/info`, {
          headers: {
            Authorization: authStore.member.accessToken
          },
        });
        this.member = response.data.data;
        console.log('111111111111', this.member);
        return response.data.data;
      } catch (error) {
        console.error('Failed to profile data', error);
        throw error;
      }
    },
  },
});
