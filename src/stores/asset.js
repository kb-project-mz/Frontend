import { defineStore } from 'pinia';
import apiInstance from '@/util/axios-instance';
import { useAuthStore } from '@/stores/auth.js';

export const useAssetStore = defineStore('asset', {
  state: () => ({
    allAssetList: [],
    allAccountList: [],
    connectedAccountList: [],
    allCardList: [],
    connectedCardList: [],
  }),
  actions: {
    async getAssetList(memberIdx) {
      try {
        const authStore = useAuthStore();
        const response = await apiInstance.get(`/asset/${memberIdx}`, {
          headers: {
            Authorization: authStore.member.accessToken,
          },
        });
        this.allAssetList = response.data.data;
        this.allAccountList = this.allAssetList.filter(
          (asset) => asset.financeKind === 2
        );
        this.allCardList = this.allAssetList.filter(
          (asset) => asset.financeKind === 1
        );
        this.connectedAccountList = this.allAccountList.filter(
          (asset) => asset.connectedStatus === 1
        );
        this.connectedCardList = this.allCardList.filter(
          (asset) => asset.connectedStatus === 1
        );
      } catch (error) {
        console.error('Failed to fetch asset list:', error);
        throw error;
      }
    },

    async updateAccountStatus(selectedAccount) {
      try {
        const accountIdx = selectedAccount.prdtId;
        const authStore = useAuthStore();
        const response = await apiInstance.post(
          `/asset/account/${accountIdx}`,
          {},
          {
            headers: {
              Authorization: authStore.member.accessToken,
            },
          }
        );
        this.connectedAccountList.push(selectedAccount);
        return response.data;
      } catch (error) {
        console.error('Failed to update account status:', error);
        throw error;
      }
    },

    async updateCardStatus(selectedCard) {
      try {
        const cardIdx = selectedCard.prdtId;
        const authStore = useAuthStore();
        const response = await apiInstance.post(
          `/asset/card/${cardIdx}`,
          {},
          {
            headers: {
              Authorization: authStore.member.accessToken,
            },
          }
        );
        this.connectedCardList.push(selectedCard);
        return response.data;
      } catch (error) {
        console.error('Failed to update card status:', error);
        throw error;
      }
    },
  },
});
