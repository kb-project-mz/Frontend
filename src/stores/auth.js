import { defineStore } from 'pinia';
import apiInstance from './axios-instance';

export const useAuthStore = defineStore('auth', {
  state: () => ({
    member: {
      memberName: '',
      memberId: '',
      password: '',
      email: '',
      birthday: '',
      gender: ''
    }
  }),
  actions: {
    async login() {
      try {
        const response = await apiInstance.post('/member/login', {
          memberId: this.member.memberId,
          password: this.member.password
        });
        return response.data.data;
      } catch (error) {
        console.error('로그인 중 오류:', error);
        throw error;
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
        console.log("API 응답:", response);
        return response.data.data;
      } catch (error) {
        console.error('ID 중복 확인 중 오류:', error);
        throw error;
      }
    },
    async checkEmail(email) {
      try {
        const response = await apiInstance.get(`/member/check-email?email=${encodeURIComponent(email)}`);
        return response.data.data;
      } catch (error) {
        console.error('이메일 체크 중 오류:', error);
        throw error;
      }
    },
  },
});
