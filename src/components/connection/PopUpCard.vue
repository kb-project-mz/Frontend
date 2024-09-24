<script setup>
import { ref, onMounted } from 'vue';
import { useAssetStore } from '@/stores/asset-history';
import { useRoute } from 'vue-router';
import { defineProps, defineEmits } from 'vue';
import axios from 'axios';

const assetStore = useAssetStore();
const assetData = ref([]);
const cardData = ref([]); 
const newCard = ref(null); 
const message = ref('');

const route = useRoute();
const memberId = route.params.memberId;

onMounted(() => {
  fetchAsset(memberId);
});

const fetchAsset = async (memberId) => {
  await assetStore.getAssetList(memberId);
  assetData.value = assetStore.AllAssetList;
  cardData.value = assetData.value.filter(data => data.financeKind === 1);
};

const formatAmount = (amount) => {
  return new Intl.NumberFormat().format(amount);
};

// 부모 컴포넌트로 이벤트를 전달할 emit 정의
const emit = defineEmits(['addCard', 'updateCard']);
const props = defineProps({
  visible: { type: Boolean, required: true }, 
  onClose: { type: Function, required: true } 
});

function close() {
  props.onClose();
}


const selectCard = (card) => {
  newCard.value = card;
  message.value = ''; 
};

const addCard = async () => {
  try {
    if(!newCard.value){
      message.value = '선택된 카드가 없습니다.';
      return;
    }
    close();
    const id = newCard.value.prdtId;

    const store = useAssetStore();
    await store.updateCardStatus(id);

    const cardIndex = cardData.value.indexOf(newCard.value);
    if (cardIndex > -1) {
      cardData.value.splice(cardIndex, 1);
    }

    const response = await axios.post(`/api/v1/connection/card/${id}`);
    if (cardIndex > -1) {
      cardData.value.splice(cardIndex, 1);
    }
    
    if (response.status === 200) {
      emit('updateCard', cardData.value);
      if (cardIndex > -1) {
      cardData.value.splice(cardIndex, 1);
    }
    } else {
      console.error('서버 요청 실패:', response.status);
    }
  } catch (error) {
    console.error('서버 통신 중 오류 발생:', error);
  } 
};

</script>

<template>
  <div v-if="visible" class="modal-overlay" @click="close">
    <div class="modal-content" @click.stop>
      <div class="card-list">
        <h2>연동할 카드 선택</h2>

        <ul v-if="cardData && cardData.length > 0">
          <li v-for="(card, index) in cardData" :key="index" class="card-item">
            <input 
              type="radio" 
              name="selectedCard"  
              :id="'card-' + index" 
              :value="card" 
              v-model="newCard"  
              @change="selectCard(card)" 
            />
            <img :src="card.image" alt="Card Image" class="card-image" />
            <div class="card-info">
            <div class="card-name">{{ card.prdtName }} ({{ card.financeName }})</div>
            <div class="card-balance">{{ formatAmount(card.totalAmount) }}원</div>
            </div>
          </li>
        </ul>
        
        <p v-if="message">{{ message }}</p>
        <p v-if="cardData.length === 0">더 이상 추가할 카드가 없습니다.</p>
        <button v-if="cardData.length > 0 && !message" @click="addCard">추가하기</button>
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