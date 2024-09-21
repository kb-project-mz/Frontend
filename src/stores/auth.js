import { defineStore } from 'pinia';
import axios from 'axios';

export const useAuthStore = defineStore('auth', {
  state: () => ({
    member: {
      memberId: '',
      password: '',
      email: '',
      memberName: ''
    }
  }),
  actions: {
    async login() {
      try {
        const response = await axios.post('http://localhost:8080/api/v1/member/login', {
          memberId: this.member.memberId,
          password: this.member.password
        });
        return response.data;
      } catch (error) {
        console.error('로그인 중 오류:', error);
        throw error;
      }
    },
    async create() {
      try {
        const response = await axios.post('http://localhost:8080/api/v1/member/join', {
          memberId: this.member.memberId,
          password: this.member.password,
          email: this.member.email,
          memberName: this.member.memberName
        });
        return response.data;
      } catch (error) {
        console.error('회원가입 중 오류:', error);
        throw error;
      }
    },
    async checkMemberId() {
      try {
        const response = await axios.get(`http://localhost:8080/api/v1/member/check-memberId/${this.member.memberId}`);
        return response.data;
      } catch (error) {
        console.error('ID 체크 중 오류:', error);
        throw error;
      }
    },
    async checkEmail() {
      try {
        const response = await axios.get(`http://localhost:8080/api/v1/member/check-email?email=${encodeURIComponent(this.member.email)}`);
        return response.data;
      } catch (error) {
        console.error('이메일 체크 중 오류:', error);
        throw error;
      }
    },
  },
});
