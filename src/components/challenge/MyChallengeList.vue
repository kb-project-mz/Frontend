<template>
  <div class="list-group" style="margin-top: 50px;">
    <div
      class="list-group-item"
      v-for="item in items"
      :key="item.id"
      style="position: relative; padding: 20px; border: 1px solid #ddd;"
    >
      <button class="btn btn-danger" style="position: absolute; top: 10px; right: 10px;" @click="deleteChallenge(item.id)">
        삭제하기
      </button>
      <div>
        <p><strong>이름:</strong> {{ item.challengeName }}</p>
        <p><strong>기간:</strong> {{ item.startDate }} ~ {{ item.endDate }}</p>
        <p><strong>조건:</strong> {{ item.challengeType === 0 ? '횟수제한' : '제한금액' }}</p>
        <p><strong>제한 횟수 / 제한 금액:</strong> {{ item.challengeLimit }}</p>
        <p><strong>세부 카테고리:</strong> {{ item.detailedCategory }}</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { defineProps } from 'vue';
import axios from 'axios';

const props = defineProps({
  items: Array  // 부모 컴포넌트로부터 리스트 데이터를 받음
});

const deleteChallenge = (id) => {
  if (confirm('정말로 삭제하시겠습니까?')) {
    axios.post('http://localhost:8080/api/v1/challenge/delete', { id }, {
      headers: { 
        "Authorization": "Bearer eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJkbGVrZHVkMDEwMiIsInJvbGUiOiJST0xFX1VTRVIiLCJpYXQiOjE3MjcxNjIxODIsImV4cCI6MTcyNzUwNzc4Mn0.shTPN61p68SsQ-5Q1Ctm1FKi1f98zkYwP_MrIBOrLJI"
      }
    })
    .then((res) => {
      if (res.data.success) {
        // 삭제 성공 후 리스트에서 항목 삭제
        const index = props.items.findIndex(item => item.id === id);
        if (index !== -1) {
          props.items.splice(index, 1);
        }
      } else {
        console.error('삭제 실패:', res.data.error.message); // 오류 메시지 처리
      }
    })
    .catch(err => {
      console.error('삭제 오류:', err);
    });
  }
};


</script>




