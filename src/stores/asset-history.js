import { defineStore } from 'pinia';
import axios from 'axios';

export const useAssetStore = defineStore('asset', {
  state: () => ({
    assetList: [],
  }),
  actions: {
    async getAssetList(memberId) {
      try {
        const response = await axios.get(`/api/assets/${memberId}`);
        this.assetList = response.data;
      } catch (error) {
        console.error('Failed to fetch asset list:', error);
        throw error;
      }
    },
  },
});