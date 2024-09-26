import { defineStore } from 'pinia';
import apiInstance from '@/util/axios-instance';

export const useAssetStore = defineStore('asset', {
  state: () => ({
    AllAssetList: [],
    ConnAssetList: [],
  }),
  actions: {
    async getAssetList(memberId) {
      try {
        const response = await apiInstance.get(`/connection/asset/${memberId}`);
        this.AllAssetList = response.data.data;
      } catch (error) {
        console.error('Failed to fetch asset list:', error);
        throw error;
      }
    },

    async getConnAssetList(memberId) {
        try {
          const response = await apiInstance.get(`/connection/asset/connected/${memberId}`);
          this.ConnAssetList = response.data.data;
        } catch (error) {
          console.error('Failed to fetch asset list:', error);
          throw error;
        }
      },
  },
});