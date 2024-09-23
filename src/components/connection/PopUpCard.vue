<script setup>
import { ref, onMounted } from 'vue';
import { useAssetStore } from '@/stores/asset-history';
import { useRoute } from 'vue-router';
import { defineProps } from 'vue';

const assetStore = useAssetStore();
const assetData = ref([]);
const cardData = ref([]);
const selectedCard = ref(null); // 선택된 계좌를 저장하는 변수

const route = useRoute();
const memberId = route.params.memberId;

onMounted(() => {
  fetchAsset(memberId);
});

const fetchAsset = async (memberId) => {
  await assetStore.getAssetList(memberId);
  assetData.value = assetStore.AllAssetList;

  const acctData = assetData.value.slice();
  cardData.value = acctData.filter(data => data.financeKind == 1);
};

// 원화에 3자리마다 , 표시하는 함수
const formatAmount = (amount) => {
  return new Intl.NumberFormat().format(amount);
};

const props = defineProps({
  visible: { type: Boolean, Required: true}, // 팝업의 가시성
  onClose: { type: Function, Required: true} // 팝업을 닫는 함수
})

function close() {
  props.onClose() // 부모 컴포넌트에서 On/Off 제어
}

const selectCard = (card) => {
  if (selectedCard.value === card) {
    selectedCard.value = null; // 이미 선택된 항목을 클릭하면 선택 해제
  } else {
    selectedCard.value = card; // 새 항목 선택
  }
};
</script>


<template>

  <!-- 조건부 렌더링으로 팝업을 제어 -->
  <div v-if="visible" class="modal-overlay" @click="close">
    <div class="modal-content" @click.stop>
      <!-- 팝업 내용 -->
      <div class="card-list">
        <h2>연동할 카드 선택</h2>
          <ul>
            <li v-for="(card, index) in cardData" :key="index" class="card-item">
              <input 
                type="checkbox" 
                :id="'account-' + index" 
                :checked="selectedCard === card" 
                @change="selectCard(card)" 
              />
              <img :src="card.image" alt="Card Image" class="card-image" />
              <div class="card-info">
              <div class="card-name">{{ card.prdtName }} ({{ card.financeName }})</div>
              <div class="card-balance">{{ formatAmount(card.totalAmount) }}원</div>
              </div>
            </li>
            <button @click="">추가하기</button>
          </ul>
      </div>
      <button @click="close">닫기</button>
    </div>
  </div>

  
</template>


<style scoped>
.card-list {
  background-color: #fff;
  padding: 20px;
  border-radius: 10px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
}

.card-list h2 {
  margin-bottom: 20px;
  font-size: 18px;
  font-weight: bold;
}

.card-list ul {
  list-style-type: none;
  padding: 0;
  margin: 0;
}

.card-item {
  display: flex;
  align-items: center;
  margin-bottom: 15px;
}

.card-image {
  width: 40px;
  height: 40px;
  margin-right: 15px;
}

.card-info {
  display: flex;
  flex-direction: column;
}

.card-name {
  font-size: 14px;
  font-weight: bold;
  margin-bottom: 5px;
}

.card-balance {
  font-size: 14px;
  color: #666;
}

.add-card {
  display: flex;
  align-items: center;
}

.add-card button {
  background-color: transparent;
  border: none;
  color: #007bff;
  font-size: 14px;
  cursor: pointer;
  display: flex;
  align-items: center;
}

.add-card button img.add-icon {
  width: 20px;
  height: 20px;
  margin-right: 10px;
}

.add-card button:hover {
  text-decoration: underline;
}


/* 모달 스타일링 */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5); /* 투명한 배경 */
  display: flex;
  justify-content: center;
  align-items: center;
}

.modal-content {
  background: white;
  padding: 20px;
  border-radius: 10px;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.3); /* 그림자 효과 */
  position: fixed;
  max-width: 600px; /* 모달의 최대 너비를 50%로 설정 */
  width: 50%; /* 자동 크기 조정 */
  box-sizing: border-box; /* 패딩을 포함한 전체 크기 계산 */
}

</style>