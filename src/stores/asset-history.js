import { defineStore } from 'pinia';
import apiInstance from './axios-instance';

export const useAssetStore = defineStore('asset', {
  state: () => ({
    assetList: [],
  }),
  actions: {
    async getAssetList(memberId) {
      try {
        const response = await apiInstance.get(`/connection/asset/${memberId}`);
        this.assetList = response.data;
      } catch (error) {
        console.error('Failed to fetch asset list:', error);
        throw error;
      }
    },
  },
});