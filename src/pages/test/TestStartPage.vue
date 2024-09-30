
  <script setup>
  import { useRouter } from 'vue-router';
  
  const router = useRouter();
  
  const startTest = () => {
    // 라우터로 이동할 때 'number' 파라미터를 1로 설정
    router.push({ name: 'testQuestion', params: { number: 1 } });
  };
  </script>
  
  <template>
    <div>
      <h1>소비 성향 테스트</h1>
      <button @click="startTest">테스트 시작하기</button>
    </div>
  </template>
  