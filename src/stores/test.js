import { defineStore } from 'pinia';
import apiInstance from '@/util/axios-instance';

export const useTestStore = defineStore('testStore', {
  state: () => ({
      questions: [],
      options: new Map(),
      score: 0,
    
  }),
  actions: {
      async fetchQuestions() {
          try {
              const response = await apiInstance.get('/test/questions'); 
              if (response.data.success) {
                  this.questions = response.data.data;
                  return response.data.data;
              } else {
                  console.error('질문을 가져오는 데 실패했습니다.', response.data.error);
              }
          } catch (error) {
            console.error('질문을 가져오는 중 오류가 발생했습니다:', error.message);
          }
      },
      async fetchOptions(questionIdx) {
        try {
          const response = await apiInstance.get(`/test/options/${questionIdx}`);
          if(response.data.success) {
              this.options.set(questionIdx, response.data.data);
              return response.data.data;
          } else {
              console.error('질문을 가져오는 중 오류가 발생했습니다:', error.message);
          }
        } catch (error) {
            console.error('질문을 가져오는 중 오류가 발생했습니다:', error.message);
        }
      },
      getOptionsByQuestionIdx(questionIdx) {
        return this.options.get(questionIdx) || [];
      },
      incrementScore(value) {
        this.score += value;
      },
      resetScore() {
        this.score = 0;
      }
  },
});