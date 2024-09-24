import { defineStore } from 'pinia';
import apiInstance from './axios-instance';

export const useAssetStore = defineStore('asset', {
  state: () => ({
    AllAssetList: [],
    ConnAssetList: [],
  }),
  actions: {
    async getAssetList(id) {
      try {
        const response = await apiInstance.get(`/connection/asset/${id}`);
        this.AllAssetList = response.data.data;
      } catch (error) {
        console.error('Failed to fetch asset list:', error);
        throw error;
      }
    },

    async getConnAssetList(id) {
        try {
          const response = await apiInstance.get(`/connection/asset/connected/${id}`);
          this.ConnAssetList = response.data.data;
        } catch (error) {
          console.error('Failed to fetch asset list:', error);
          throw error;
        }
      },
  },
});