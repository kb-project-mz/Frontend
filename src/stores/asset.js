import { defineStore } from 'pinia';
import apiInstance from './axios-instance';

export const useAssetStore = defineStore('asset', {
  state: () => ({
    allAssetList: [],
    allAccountList: [],
    connectedAccountList: [],
    allCardList: [],
    connectedCardList: [],
  }),
  actions: {
    async getAssetList(id) {
      try {
        const response = await apiInstance.get(`/connection/asset/${id}`);
        this.allAssetList = response.data.data;
        this.allAccountList = this.allAssetList.filter(asset => asset.financeKind === 2);
        this.allCardList = this.allAssetList.filter(asset => asset.financeKind === 1);
        this.connectedAccountList = this.allAccountList.filter(asset => asset.connStatus === 1);
        this.connectedCardList = this.allCardList.filter(asset => asset.connStatus === 1);
        console.log(this.allAssetList);
      } catch (error) {
        console.error('Failed to fetch asset list:', error);
        throw error;
      }
    },

    async updateAccountStatus(selectedAccount) {
      try {
        const id = selectedAccount.prdtId;
        const response = await apiInstance.post(`/connection/account/${id}`);
        this.connectedAccountList.push(selectedAccount);
        console.log(this.connectedAccountList);
        return response.data;
      } catch (error) {
        console.error('Failed to update account status:', error);
        throw error;
      }
    },
    
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
