import { defineStore } from 'pinia';
import apiInstance from '@/util/axios-instance';
import { setLocalStorage, clearTokens } from '@/util/token';

export const useAuthStore = defineStore("auth", {
  state: () => ({
    member: {
      memberIdx: null,
      memberName: null,
      memberId: null,
      imageUrl: null,
      accessToken: null,
      role: null,
    },
  }),

  actions: {
    async login(memberId, password) {
      try {
        const response = await apiInstance.post("/member/login", {
          memberId,
          password,
        });

        console.log(response);
        if (response.data.success) {
          const loginData = response.data.data;
          setLocalStorage(loginData);
          this.loadAuthState();
        }
        return response.data;
      } catch (error) {
        throw error;
      }
    },

    async create(member) {
      try {
        const response = await apiInstance.post("/member/join", member);
        return response.data.data;
      } catch (error) {
        throw error;
      }
    },

    async checkMemberId(memberId) {
      try {
        const response = await apiInstance.get(
          `/member/check-memberId/${memberId}`
        );
        return response.data.data;
      } catch (error) {
        throw error;
      }
    },

    async checkEmailDuplicate(email) {
      try {
        const response = await apiInstance.get(`/member/email/duplicate`, {
          params: { email: email },
        });

        if (response && response.data) {
          return response.data.exists;
        } else {
          return false;
        }
      } catch (error) {
        console.error("이메일 중복 확인 오류:", error);
        throw error;
      }
    },

    async sendEmailVerification(email) {
      try {
        const response = await apiInstance.post("/member/email/code", {
          email
        });
        return response.data;
      } catch (error) {
        console.error(
          "인증코드 전송 오류:",
          error.response ? error.response.data : error.message
        );
        throw new Error("인증코드 전송 실패");
      }
    },

    async verifyEmailCode(email, code) {
      try {
        const response = await apiInstance.post("/member/email/verification", {
          email,
          inputCode: code
        });
        return response.data.success;
      } catch (err) {
        console.error(err);
      }
    },

    async logout() {
      try {
        const authStore = useAuthStore();
        const response = await apiInstance.post('/member/logout', null, {
          headers: {
            Authorization: authStore.member.accessToken
          }
        });
        clearTokens();
        localStorage.clear();
        this.clearAuthState();
      } catch (error) {
        console.error(
          '로그아웃 중 오류:',
          error.response ? error.response.data : error.message
        );
      }
    },

    clearAuthState() {
      this.member.memberIdx = null;
      this.member.memberName = null;
      this.member.memberId = null;
      this.member.accessToken = null;
      this.member.imageUrl = null;
      localStorage.clear();
    },

    updateImageUrl(imageUrl) {
      this.member.imageUrl = imageUrl;
      const authData = JSON.parse(localStorage.getItem('auth') || '{}');
      authData.imageUrl = imageUrl;
      localStorage.setItem('auth', JSON.stringify(authData));
    },

    loadAuthState() {
      const authData = JSON.parse(localStorage.getItem('auth'));
      if (authData && authData.memberId) {
        this.member.memberId = authData.memberId;
        this.member.memberName = authData.memberName;
        this.member.accessToken = authData.accessToken;
        this.member.memberIdx = authData.memberIdx;
        this.member.imageUrl = authData.imageUrl || "";
        this.member.role = authData.role;
      }
    },

    isLogin() {
      const authData = localStorage.getItem('auth');
      console.log("isLogin 실행", authData);
      return !!authData;
    },

    async verifyPassword(password) {
      try {
        const response = await apiInstance.post('/member/info', { password });
        return response.data.isPasswordCorrect;
      } catch (error) {
        console.error('비밀번호 확인 중 오류 발생:', error);
        throw new Error('비밀번호 확인 중 오류가 발생했습니다.');
      }
    },

  },
});
