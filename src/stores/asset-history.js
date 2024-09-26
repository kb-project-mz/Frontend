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

        console.log(this.AllAssetList);
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

     async updateAccountStatus(id) {
      try {
        const response = await apiInstance.post(`/connection/account/${id}`);
        this.AllAssetList.push(response.data.data);
        this.ConnAssetList.push(response.data.data);
        console.log(this.AllAssetList);
        return response.data; // 서버 응답 데이터 반환
      } catch (error) {
        console.error('Failed to update account status:', error);
        throw error;
      }
    }
    ,
    // 카드 연동 action 추가
    async updateCardStatus(id) {
      try {
        const response = await apiInstance.post(`/connection/card/${id}`);
        return response.data; 
      } catch (error) {
        console.error('Failed to update card status:', error);
        throw error;
      }
    }
  },
});