<script setup>
import { ref, onMounted, watch } from 'vue';
import { useAssetStore } from '@/stores/asset';
import { useRoute } from 'vue-router';
import PopUpCard from '@/components/connection/PopUpCard.vue'; 
import { useConsumptionHistoryStore } from '@/stores/consumption-history';



const fetchConsumptionHistory = async (memberId) => {
  await consumptionHistoryStore.getCardHistoryList(memberId);
  historyData.value = consumptionHistoryStore.cardHistoryThisMonth;
}

onMounted(() =>  {
  fetchConsumptionHistory(1);
});


const consumptionHistoryStore = useConsumptionHistoryStore();
const comsumptionData = ref([]);

const assetStore = useAssetStore();
const assetData = ref([]);
const cardData = ref([]);

const route = useRoute();
const memberId = route.params.memberId;

// watch(() => assetStore.connectedAssetList, (newValue) => {
//   if (newValue.length > 0) {
//     fetchAsset(memberId);
//   }
// });

// onMounted(async ()  => {
//   await fetchAsset(memberId);
//   await fetchConsumption(memberId);
// });

const fetchAsset = async (memberId) => {
  await assetStore.getconnectedAssetList(memberId);
  assetData.value = assetStore.connectedAssetList;
  const acctData = assetData.value.slice();
  cardData.value = acctData.filter(data => data.financeKind == 1);
};

const fetchConsumption = async (memberId) => {
  comsumptionData.value = [];  // 초기화
  console.log("Fetching consumption data for member:", memberId);
  await consumptionHistoryStore.getCardHistoryList(2);
  console.log("API 호출 후 store 데이터", consumptionHistoryStore.cardHistoryThisMonth);
  comsumptionData.value = consumptionHistoryStore.cardHistoryThisMonth;
  console.log("comsumptionData 설정 후", comsumptionData.value);
};

const formatAmount = (amount) => {
  return new Intl.NumberFormat().format(amount);
};

const isModalVisible = ref(false);
function openModal() {
  isModalVisible.value = true;
}
function closeModal() {
  isModalVisible.value = false;
}

const handleAddCard = (newCard) => {
  cardData.value.push(newCard);  
};

const handleCardDataUpdate = (updatedCardData) => {
  cardData.value = updatedCardData;
}

</script>

<template>
  
  <!-- <div class="about">
    <div class="card-list">
      <h2>연동된 카드</h2>

      <ul v-if="cardData.length > 0">
        <li v-for="(card, index) in cardData" :key="index" class="card-item">
          <img :src="card.image" alt="Card Image" class="card-image rounded" />
          <div class="card-info">
          <div class="card-name">{{ card.prdtName }} ({{ card.financeName }})</div>
          <div class="card-balance">{{ formatAmount(card.totalAmount) }}원</div>
          </div>
        </li>
      </ul>

      <p v-else>텅</p>
      <button @click="openModal">카드 추가하기</button>
    </div>
  </div>
  
  <PopUpCard @updateCard="handleAddCard" 
    :onClose="closeModal" :visible="isModalVisible" @updateCardData="handleCardDataUpdate"/> -->
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


</style>