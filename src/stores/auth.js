import { defineStore } from 'pinia';
import apiInstance from '@/util/axios-instance';
import { setLocalStorage, setTokens, clearTokens } from '@/util/token';

export const useAuthStore = defineStore('auth', {
  state: () => ({
    member: {
      memberIdx: localStorage.getItem('id') || null,
      memberName: localStorage.getItem('memberName') || null,
      memberId: localStorage.getItem('memberId') || null
    }
  }),

  actions: {
    async login(memberId, password) {
      try {
        const response = await apiInstance.post('/member/login', { memberId, password });
        const loginData = response.data.data;

        if (!loginData || !loginData.accessToken) {
          return null;
        }

        setLocalStorage(loginData);
        this.loadAuthState(); 
        
        return loginData;
      } catch (error) {
        throw error;
      }
    },

    async create(member) {
      try {
        const response = await apiInstance.post('/member/join', member);
        return response.data.data;
      } catch (error) {
        throw error;
      }
    },

    async checkMemberId(memberId) {
      try {
        const response = await apiInstance.get(`/member/check-memberId/${memberId}`);
        return response.data.data;
      } catch (error) {
        throw error;
      }
    },

    async checkEmail(email) {
      try {
        const response = await apiInstance.get(`/member/check-email?email=${encodeURIComponent(email)}`);
        return response.data.data;
      } catch (error) {
        throw error;
      }
    },

    async sendEmailVerification(email) {
      try {
        const response = await apiInstance.post('/member/email/code', { email });
        return response.data;
      } catch (error) {
        console.error('인증코드 전송 오류:', error.response ? error.response.data : error.message);
        throw new Error('인증코드 전송 실패');
      }
    },

    async verifyEmailCode(email, code) {
      try {
        const response = await apiInstance.post('/member/email/verification', { email, inputCode: code });
        return response.data.success;
      } catch (error) {
        console.error('인증코드 확인 오류:', error.response ? error.response.data : error.message);
        throw new Error('인증코드 확인 실패');
      }
    },

    async logout() {
      try {
        await apiInstance.post('/member/logout');
        clearTokens();
        this.clearAuthState();
      } catch (error) {
        console.error('로그아웃 중 오류:', error.response ? error.response.data : error.message);
      }
    },

    clearAuthState() {
      this.member.memberIdx = null;
      this.member.memberName = null;
      this.member.memberId = null;
      localStorage.clear();
    },

    loadAuthState() {
      const authData = JSON.parse(localStorage.getItem('auth'));
      if (authData && authData.memberId) {
        this.member.memberId = authData.memberId;
        this.member.memberName = authData.memberName;
      }
    },

    isLogin() {
      const authData = localStorage.getItem('auth');
      const isLoggedIn = !!authData;
      return isLoggedIn;
    }
  }
});
