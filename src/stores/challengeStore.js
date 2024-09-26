import { defineStore } from 'pinia';
import axios from 'axios';

export const useChallengeStore = defineStore('challengeStore', {
  state: () => ({
    challengeList: [],
    detailedCategories: [],
  }),

  actions: {
    // 모든 챌린지 항목을 가져오는 액션
    async fetchAllItems(memberId) {
      return await axios
        .get(`http://localhost:8080/api/v1/challenge/list/${memberId}`, {
          headers: {
            Authorization: "Bearer eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJkbGVrZHVkMDEwMiIsInJvbGUiOiJST0xFX1VTRVIiLCJpYXQiOjE3MjcxNjIxODIsImV4cCI6MTcyNzUwNzc4Mn0.shTPN61p68SsQ-5Q1Ctm1FKi1f98zkYwP_MrIBOrLJI", // 여기에 JWT 토큰을 넣음
          },
        })
        .then((res) => {
          if (res.data.success) {
            this.challengeList = res.data.data.data;
          } else {
            console.error('Error fetching challenges:', res.data.error.message);
          }
        })
        .catch((err) => {
          console.log('Error fetching challenges:', err);
        });
    },

    // 새로운 챌린지를 추가하는 액션
    async addNewChallenge(challengeData) {
      return await axios
        .post("http://localhost:8080/api/v1/challenge/write", challengeData, {
          headers: {
            Authorization: "Bearer eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJkbGVrZHVkMDEwMiIsInJvbGUiOiJST0xFX1VTRVIiLCJpYXQiOjE3MjcxNjIxODIsImV4cCI6MTcyNzUwNzc4Mn0.shTPN61p68SsQ-5Q1Ctm1FKi1f98zkYwP_MrIBOrLJI", // JWT 토큰 포함
          },
        })
        .then((res) => {
          if (res.data.success) {
            this.challengeList.push(challengeData);
          } else {
            console.error('Error adding challenge:', res.data.error.message);
          }
        })
        .catch((err) => {
          console.error('Error adding challenge:', err);
        });
    },

    // 챌린지를 삭제하는 액션
    async deleteChallenge(id) {
      return await axios
        .post("http://localhost:8080/api/v1/challenge/delete", { id }, {
          headers: {
            Authorization: "Bearer eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJkbGVrZHVkMDEwMiIsInJvbGUiOiJST0xFX1VTRVIiLCJpYXQiOjE3MjcxNjIxODIsImV4cCI6MTcyNzUwNzc4Mn0.shTPN61p68SsQ-5Q1Ctm1FKi1f98zkYwP_MrIBOrLJI", // JWT 토큰 포함
          },
        })
        .then((res) => {
          if (res.data.success) {
            const index = this.challengeList.findIndex((item) => item.id === id);
            if (index !== -1) {
              this.challengeList.splice(index, 1);
            }
          } else {
            console.error('Error deleting challenge:', res.data.error.message);
          }
        })
        .catch((err) => {
          console.error('Error deleting challenge:', err);
        });
    },

    // 상세 카테고리를 가져오는 액션
    async fetchDetailedCategory(categoryId) {
      try {
        const res = await axios.post("http://localhost:8080/api/v1/challenge/detailedCategory", { category: categoryId }, {
          headers: {
            Authorization: "Bearer eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJkbGVrZHVkMDEwMiIsInJvbGUiOiJST0xFX1VTRVIiLCJpYXQiOjE3MjcxNjIxODIsImV4cCI6MTcyNzUwNzc4Mn0.shTPN61p68SsQ-5Q1Ctm1FKi1f98zkYwP_MrIBOrLJI", // JWT 토큰 포함
          }
        });
        if (res.data.success) {
          this.detailedCategories = res.data.data.detailedCategories;
          return this.detailedCategories;  // 비동기 처리 완료 후 카테고리 반환
        } else {
          console.error("Error fetching detailed categories:", res.data.error.message);
        }
      } catch (err) {
        console.error("Error fetching detailed categories:", err);
      }
    },

    // 차트 데이터를 가져오는 액션
    async fetchChallengeLimitCardCount(memberId) {
      return await axios
        .get(`http://localhost:8080/api/v1/challenge/challenge-limit-card-count/${memberId}`, {
          headers: {
            Authorization: "Bearer eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJkbGVrZHVkMDEwMiIsInJvbGUiOiJST0xFX1VTRVIiLCJpYXQiOjE3MjcxNjIxODIsImV4cCI6MTcyNzUwNzc4Mn0.shTPN61p68SsQ-5Q1Ctm1FKi1f98zkYwP_MrIBOrLJI", // JWT 토큰 포함
          },
        })
        .then((res) => {
          if (res.data.success) {
            return res.data.data; // 차트 데이터를 반환
          } else {
            console.error('Error fetching chart data:', res.data.error.message);
            return [];
          }
        })
        .catch((err) => {
          console.error('Error fetching chart data:', err);
          return [];
        });
    },
  },
});
