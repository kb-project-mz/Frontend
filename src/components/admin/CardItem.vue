<template>
    <div :class="['p-4 rounded shadow', color]">
      <div class="font-semibold">{{ title }}</div>
      <div class="text-2xl">{{ value }}</div>
    </div>
  </template>
  
  <script>
  export default {
    props: {
      title: String,   // 카드에 표시할 제목
      value: Number,   // 카드에 표시할 값
      color: String,   // 카드의 배경색
    },
  };
  </script>
  