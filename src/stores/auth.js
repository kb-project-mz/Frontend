import { defineStore } from 'pinia';
import apiInstance from '@/util/axios-instance';
import { setTokens, clearTokens, setGoogleIdToken } from '@/util/token';

function setLocalStorage(loginData) {
    console.log('setLocalStorage 호출:', loginData);
    localStorage.setItem('memberId', loginData.memberId);

    // expires_in 값 확인 및 로컬 스토리지에 저장
    if (loginData.expiresIn) {
        localStorage.setItem('expires_in', loginData.expiresIn);
        console.log('expires_in 값 저장됨:', loginData.expiresIn);
    } else {
        console.warn('expires_in 값이 없습니다.');
    }
    
    setTokens(loginData.accessToken, loginData.refreshToken);
    
    localStorage.setItem('auth', JSON.stringify(loginData));
    localStorage.setItem('id', loginData.id);
    localStorage.setItem('memberName', loginData.memberName);
    
    console.log('로컬 스토리지에 로그인 데이터 설정 완료');
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
      console.log('login 호출: memberId=', memberId);
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

    async create(member) {
      console.log('create 호출: member=', member);
      try {
        const response = await apiInstance.post('/member/join', member);
        console.log('회원가입 성공:', response.data.data);
        return response.data.data;
      } catch (error) {
        console.error('회원가입 중 오류:', error.response ? error.response.data : error.message);
        throw error;
      }
    },

    async checkMemberId(memberId) {
      console.log('checkMemberId 호출: memberId=', memberId);
      try {
        const response = await apiInstance.get(`/member/check-memberId/${memberId}`);
        console.log('ID 중복 확인 성공:', response.data.data);
        return response.data.data;
      } catch (error) {
        console.error('ID 중복 확인 중 오류:', error.response ? error.response.data : error.message);
        throw error;
      }
    },

    async checkEmail(email) {
      console.log('checkEmail 호출: email=', email);
      try {
        const response = await apiInstance.get(`/member/check-email?email=${encodeURIComponent(email)}`);
        console.log('이메일 체크 성공:', response.data.data);
        return response.data.data;
      } catch (error) {
        console.error('이메일 체크 중 오류:', error.response ? error.response.data : error.message);
        throw error;
      }
    },

    async logout() {
      console.log('logout 호출');
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
      console.log('clearAuthState 호출');
      this.member.id = null;
      this.member.memberName = null;
      this.member.memberId = null;
      localStorage.clear(); // 로컬 스토리지 초기화
      console.log('로컬 스토리지 초기화 완료');
    },

    loadAuthState() {
      console.log('loadAuthState 호출');
      const authData = localStorage.getItem('auth');
      if (authData) {
        this.member = JSON.parse(authData);
        console.log('인증 데이터 로드 완료:', this.member);
      } else {
        console.log('인증 데이터가 없습니다.');
      }
    },

    isLogin() {
      const authData = localStorage.getItem('auth');
      const isLoggedIn = !!authData; // 인증 상태 여부 확인
      console.log('로그인 상태:', isLoggedIn);
      return isLoggedIn;
    }
  }
});
