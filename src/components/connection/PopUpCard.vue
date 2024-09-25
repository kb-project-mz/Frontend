<script setup>
import { ref, onMounted } from 'vue';
import { useAssetStore } from '@/stores/asset-history';
import { useRoute } from 'vue-router';
import { defineProps, defineEmits } from 'vue';
import apiInstance from '@/stores/axios-instance';

const assetStore = useAssetStore();
const assetData = ref([]);
const cardData = ref([]); 
const newCard = ref(null); 
const message = ref('');

const route = useRoute();
const memberId = route.params.memberId;

const emit = defineEmits(['updateCard']);

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
    // 1.새로운 카드가 선택되지 않았을 경우 메시지 출력 후 함수 종료 
    if(!newCard.value){
      message.value = '선택된 카드가 없습니다.';
      return;
    } 

    // 2. 새로운 카드를 cardData에 추가
    cardData.value.push(newCard.value);
    //console.log("전체 카드데이터에 뉴 카드 추가된거", cardData.value); // 왜 안들어감????

    // 3. 모달 닫기
    close();

    // 4. Pinia 스토어를 사용하여 카드 상태 업데이트
    const id = newCard.value.prdtId;
    const store = useAssetStore();
    await store.updateCardStatus(id);
    
    // 5. 서버에 카드 추가 요청 (POST)
    const response = await apiInstance.post(`/connection/card/${id}`);

    console.log("newCard.value.prdtId:", newCard.value.prdtId);
    console.log("cardData 배열 확인:", cardData.value);

    // 7. cardData에서 newCard를 삭제 (이미 서버 요청이 완료되었으므로 로직 최적화)
    cardData.value = cardData.value.filter(card => card.prdtId !== newCard.value.prdtId);

    // 6. 서버 요청 성공 시 카드 데이터를 부모 컴포넌트에 전달 (emit)
    if (response.data.success) {
      emit('updateCard', newCard.value);
      console.log(newCard);
      console.log("여기서 찍히는 cardData배열", cardData.value);
      //console.log("여기서 찍히는 뉴ㅠㅠㅠcardData", newCard.value);
    } else {
      console.error('서버 요청 실패:', response.status);
    }
    

   // console.log("여기서 찍히는 cardData", cardData.value);
  }catch (error) {
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