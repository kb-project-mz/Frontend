
  <script setup>
  function copyURL() {
    navigator.clipboard.writeText(window.location.href)
      .then(() => alert('URL이 복사되었습니다!'))
      .catch(() => alert('복사에 실패했습니다. 다시 시도해주세요.'));
  }
  
  function shareURL() {
    if (navigator.share) {
      navigator.share({
        title: document.title,
        url: window.location.href
      })
      .then(() => console.log('공유 성공'))
      .catch(err => console.log('공유 실패:', err));
    } else {
      alert('공유 기능이 지원되지 않는 브라우저입니다.');
    }
  }
  </script>
  <template>
    <div>
      <button @click="copyURL">링크 복사</button>
      <button @click="shareURL">링크 공유</button>
    </div>
  </template>
  
  <style scoped>
  button {
    margin: 5px;
    padding: 10px;
    background-color: #4CAF50;
    color: white;
    border: none;
    border-radius: 5px;
    cursor: pointer;
  }
  
  button:hover {
    background-color: #45a049;
  }
  </style>
  