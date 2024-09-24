import { defineStore } from 'pinia';
import apiInstance from './axios-instance';

export const useAuthStore = defineStore('auth', {
  state: () => ({
    member: {
			id: '',
      memberName: '',
      memberId: '',
      password: '',
      email: '',
      birthday: '',
      gender: ''
    }
  }),
  actions: {
    async login(memberId, password) {
			try {
				console.log('로그인 시도:', memberId);
				const response = await apiInstance.post('/member/login', {
					memberId: memberId,
					password: password
				});
				console.log(response.data);
		
				const loginData = response.data.data;
		
				if (!response.data.success) {
					console.error(response.data.error.message);
					return response.data.error.message;
				}

        localStorage.setItem('id', loginData.id);
				localStorage.setItem('memberId', loginData.memberId);		
        localStorage.setItem('memberName', loginData.memberName);
				localStorage.setItem('accessToken', 'Bearer ' + loginData.accessToken);
				localStorage.setItem('refreshToken', 'Bearer ' + loginData.refreshToken);
				localStorage.setItem('auth', JSON.stringify(loginData));				
		
				console.log('로그인 응답 데이터:', loginData);
				return loginData;
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
	// 로그인 상태 유지
	loadAuthState() {
		const authData = localStorage.getItem('auth');
		if (authData) {
			this.member = JSON.parse(authData);
		}
	},

	isLogin() {
		const authData = localStorage.getItem('auth');
		return !!authData;
	},
});
