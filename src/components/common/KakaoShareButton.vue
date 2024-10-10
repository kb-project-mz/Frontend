<template>
    <button id="kakao-share-btn" class="kakao-share-button" @click="shareKakao">
      <img 
        src="https://developers.kakao.com/assets/img/about/logos/kakaotalksharing/kakaotalk_sharing_btn_medium.png" 
        alt="카카오톡 공유하기" 
        class="kakao-logo"
      />
    </button>
  </template>
  
  <script setup>
  import { useRoute } from "vue-router";
  import { onMounted } from "vue";
  
  // TODO : 현재 경로 하드 코딩
  const route = useRoute();
  const baseUrl = "https://localhost:5173"; // 로컬 환경 URL
  const linkUrl = `${baseUrl}${route.fullPath}`; // 현재 페이지 URL 조합
  const imageUrl = "https://raw.githubusercontent.com/kb-project-mz/FingerTips/main/test_start.png";

  
  // 카카오 공유 기능 메서드
  const shareKakao = () => {
    if (window.Kakao && window.Kakao.isInitialized()) {
      window.Kakao.Share.sendDefault({
        objectType: 'feed',
        content: {
          title: "나의 소비 성향은?",
          description: "지금 바로 소비 성향 테스트하러 가기",
          imageUrl: imageUrl, // 공유 메시지에 포함될 이미지
          link: {
            mobileWebUrl: linkUrl,
            webUrl: linkUrl,
          },
        },
        buttons: [
          {
            title: '자세히 보기',
            link: {
              mobileWebUrl: linkUrl,
              webUrl: linkUrl,
            },
          },
        ],
      });
    } else {
      console.error("Kakao SDK가 초기화되지 않았습니다.");
    }
  };
  
  onMounted(() => {
    if (!window.Kakao.isInitialized()) {
      console.error("Kakao SDK가 초기화되지 않았습니다.");
    }
  });
  </script>
  
  <style scoped>
  .kakao-share-button {
    background-color: #fee500;
    border: none;
    padding: 10px;
    border-radius: 5px;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  
  .kakao-logo {
    width: 24px;
    height: 24px;
  }
  </style>
  