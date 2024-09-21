import { defineStore } from 'pinia';
import apiInstance from './axios-instance';

export const useAssetStore = defineStore('asset', {
  state: () => ({
    AllAssetList: [],
    ConnAssetList: [],
  }),
  actions: {
    async getAssetList(memberId) {
      try {
        const response = await apiInstance.get(`/connection/asset/allAssets/${memberId}`);
        this.AllAssetList = response.data;
      } catch (error) {
        console.error('Failed to fetch asset list:', error);
        throw error;
      }
    },

    async getConnAssetList(memberId) {
        try {
          const response = await apiInstance.get(`/connection/asset/connAssets/${memberId}`);
          this.ConnAssetList = response.data;
        } catch (error) {
          console.error('Failed to fetch asset list:', error);
          throw error;
        }
      },
  },
});