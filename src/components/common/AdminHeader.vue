<script setup>
  </script>

<template>
    <header class="admin-header">
      <nav>
        <ul>
          <li><router-link to="/admin">Dashboard</router-link></li>
          <li><router-link to="/users">Users</router-link></li>
          <li><router-link to="/settings">Settings</router-link></li>
        </ul>
      </nav>
    </header>
  </template>
  
  <style scoped>
  /* 헤더 스타일 */
  .admin-header {
    background-color: #f8e1f4; /* 연한 분홍색 배경 */
    padding: 1rem;
    color: #333; /* 어두운 텍스트 색상 */
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1); /* 부드러운 그림자 */
  }
  
  .admin-header nav ul {
    display: flex;
    gap: 1.5rem;
  }
  
  .admin-header nav ul li {
    list-style: none;
  }
  
  .admin-header nav ul li a {
    color: #333; /* 어두운 텍스트 색상 */
    text-decoration: none;
    font-weight: bold;
  }
  
  .admin-header nav ul li a:hover {
    color: #f07aa6; /* hover 시 밝은 분홍색으로 변경 */
  }
  
/* 대시보드 카드 스타일 */
.dashboard-card {
  background: linear-gradient(135deg, #ff5f6d, #ffc371); /* 진한 분홍-주황 그라데이션 */
  border-radius: 12px;
  padding: 1.5rem;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05); /* 부드러운 그림자 */
  color: white;
}

.dashboard-card h2 {
  font-size: 2rem;
  margin-bottom: 0.5rem;
  color: white; /* 카드 텍스트는 밝은 색상 */
}

.dashboard-card p {
  color: #f1f1f1; /* 부드러운 회색 텍스트 */
}

.dashboard-card .icon {
  color: white; /* 아이콘을 흰색으로 */
}

  
  /* 전체적인 페이지 배경 */
  body {
    background-color: #fdf4f9; /* 전체 페이지 배경을 밝게 */
    color: #333;
  }
  
  </style>
  