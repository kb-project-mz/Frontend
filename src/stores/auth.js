import { defineStore } from 'pinia';
import apiInstance from '@/util/axios-instance';
import { setTokens, clearTokens } from '@/util/token'; // 토큰 관련 함수 불러오기

function setLocalStorage(loginData) {
  localStorage.setItem('memberId', loginData.memberId);
  setTokens(loginData.accessToken, loginData.refreshToken); // 토큰 저장
  localStorage.setItem('auth', JSON.stringify(loginData));
  localStorage.setItem('id', loginData.id);
  localStorage.setItem('memberName', loginData.memberName);
}

export const useAuthStore = defineStore('auth', {
  state: () => ({
    member: {
      id: localStorage.getItem('id') || null,
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
          console.error('응답에 accessToken이 없습니다.', loginData);
          return null;
        }

        setLocalStorage(loginData);
        console.log('로그인 성공:', loginData);
        return loginData;
      } catch (error) {
        console.error('로그인 중 오류:', error.response ? error.response.data : error.message);
        throw error;
      }
    },

    async googleLogin(googleIdToken) {
      try {
        const response = await apiInstance.post('/member/login/google/callback', {
          id_token: googleIdToken
        });

        const loginData = response.data.data;

        if (response.data.success && loginData) {
          setLocalStorage(loginData);
          console.log('로그인 성공:', loginData);
          return { success: true };
        } else {
          console.error('로그인 실패:', response.data.error);
          return { success: false };
        }
      } catch (error) {
        console.error('로그인 중 오류:', error.response ? error.response.data : error.message);
        return { success: false, error: error.response ? error.response.data : error.message };
      }
    },

    async create(member) {
      try {
        const response = await apiInstance.post('/member/join', member);
        return response.data.data;
      } catch (error) {
        console.error('회원가입 중 오류:', error.response ? error.response.data : error.message);
        throw error;
      }
    },

    async checkMemberId(memberId) {
      try {
        const response = await apiInstance.get(`/member/check-memberId/${memberId}`);
        return response.data.data;
      } catch (error) {
        console.error('ID 중복 확인 중 오류:', error.response ? error.response.data : error.message);
        throw error;
      }
    },

    async checkEmail(email) {
      try {
        const response = await apiInstance.get(`/member/check-email?email=${encodeURIComponent(email)}`);
        return response.data.data;
      } catch (error) {
        console.error('이메일 체크 중 오류:', error.response ? error.response.data : error.message);
        throw error;
      }
    },

    async logout() {
      try {
        await apiInstance.post('/member/logout');
        clearTokens(); // 토큰 삭제
        this.clearAuthState();
        console.log('로그아웃 성공');
      } catch (error) {
        console.error('로그아웃 중 오류:', error.response ? error.response.data : error.message);
      }
    },

    clearAuthState() {
      this.member.id = null;
      this.member.memberName = null;
      this.member.memberId = null;
      localStorage.clear(); // 로컬 스토리지 초기화
    },

    loadAuthState() {
      const authData = localStorage.getItem('auth');
      if (authData) {
        this.member = JSON.parse(authData);
      }
    },

    isLogin() {
      const authData = localStorage.getItem('auth');
      return !!authData; // 인증 상태 여부 확인
    }
  }
});
