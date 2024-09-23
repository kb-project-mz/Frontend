<script setup>

</script>

<template>
  <div class="pt-5 pb-8 px-8 bg-white border border-gray-200 rounded-2xl shadow">
    <div class="mb-5 text-2xl font-bold">
      내 지갑 속 AI
    </div>
    <div class="mb-8 flex items-center justify-end">
      <div class="question py-5 px-8 mr-10 bg-white border border-gray-200 rounded-2xl shadow-lg items-end">
        어떻게 하면 다음달 소비를 줄일 수 있을까요?
      </div>
      <img src="https://github.com/user-attachments/assets/259c3690-7944-4ac0-a398-220b49f956b6">
    </div>
    
    <div class="flex items-center">
      <img src="https://github.com/user-attachments/assets/259c3690-7944-4ac0-a398-220b49f956b6">
      <div class="answer py-5 px-8 ml-10 bg-white border border-gray-200 rounded-2xl shadow-lg">
        <p>홍길동 님은 이번 달 배달의 민족에 소비를 많이 하신 편입니다.</p>
        <p>배달의 민족에서 5번만 소비를 덜하게 된다면, 평균 50,000원을 아낄 수 있어요 !</p>
        <p>다음 달에는 배달 음식을 조금 줄여보는 것이 어떨까요?</p>
      </div>  
    </div>
  </div>
</template>

<style scoped>
.question {
  max-width: fit-content;
}
img {
  width: 4rem;
  height: 4rem;
  border-radius: 70%;
  object-fit: cover;
}
.answer {
  max-width: fit-content;
  background-color: #FFF7D0;
}
</style>
