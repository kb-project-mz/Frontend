import { defineStore } from "pinia";
import apiInstance from "./axios-instance";

export const useAuthStore = defineStore("auth", {
    state: () => ({
        member: {
            memberIdx: localStorage.getItem("memberIdx") || null,
            memberName: localStorage.getItem("memberName") || null,
            memberId: localStorage.getItem("memberId") || null,
        },
    }),
    actions: {
        async login(memberId, password) {
            try {
                console.log("로그인 시도:", memberId, " ", password);
                const response = await apiInstance.post("/member/login", {
                    memberId: memberId,
                    password: password,
                });
                console.log(response.data);

                const loginData = response.data.data;

                if (!response.data.success) {
                    console.error(response.data.error.message);
                    return response.data.error.message;
                }

                this.member.memberIdx = loginData.memberIdx;
                this.member.memberId = loginData.memberId;
                this.member.memberName = loginData.memberName;

                localStorage.setItem("memberIdx", loginData.memberIdx);
                localStorage.setItem("memberId", loginData.memberId);
                localStorage.setItem("memberName", loginData.memberName);
                localStorage.setItem("accessToken", "Bearer " + loginData.accessToken);
                localStorage.setItem("refreshToken", "Bearer " + loginData.refreshToken);
                localStorage.setItem("auth", JSON.stringify(loginData));

                console.log("로그인 응답 데이터:", loginData);
                return loginData;
            } catch (error) {
                console.error("로그인 중 오류:", error);
                throw error;
            }
        },

        async create(member) {
            try {
                const response = await apiInstance.post("/member/join", member);
                return response.data.data;
            } catch (error) {
                console.error("회원가입 중 오류:", error.response ? error.response.data : error.message);
                throw error;
            }
        },
        async checkMemberId(memberId) {
            try {
                const response = await apiInstance.get(`/member/check-memberId/${memberId}`);
                console.log("API 응답:", response);
                return response.data.data;
            } catch (error) {
                console.error("ID 중복 확인 중 오류:", error);
                throw error;
            }
        },
        async checkEmail(email) {
            try {
                const response = await apiInstance.get(`/member/check-email?email=${encodeURIComponent(email)}`);
                return response.data.data;
            } catch (error) {
                console.error("이메일 체크 중 오류:", error);
                throw error;
            }
        },
        logout() {
            this.member.memberIdx = null;
            this.member.memberName = null;
            this.member.memberId = null;
            localStorage.clear();
        },
    },
    // 로그인 상태 유지
    loadAuthState() {
        const authData = localStorage.getItem("auth");
        if (authData) {
            this.member = JSON.parse(authData);
        }
    },

    isLogin() {
        const authData = localStorage.getItem("auth");
        return !!authData;
    },
});
