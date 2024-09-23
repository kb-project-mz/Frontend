<script setup>
import { ref, onMounted } from 'vue';
import { useAssetStore } from '@/stores/asset-history';
import { useRoute } from 'vue-router';
import PopUpCard from '@/components/connection/PopUpCard.vue'; // 모달 컴포넌트 제거

const assetStore = useAssetStore();
const assetData = ref([]);
const cardData = ref([]);
const addedCards = ref([]); // 추가된 카드들을 저장하는 배열

const route = useRoute();
const memberId = route.params.memberId;

onMounted(() => {
  fetchAsset(memberId);
});

const fetchAsset = async (memberId) => {
  await assetStore.getConnAssetList(memberId);
  assetData.value = assetStore.ConnAssetList;

  const acctData = assetData.value.slice();
  cardData.value = acctData.filter(data => data.financeKind == 1);
};

// 원화에 3자리마다 , 표시하는 함수
const formatAmount = (amount) => {
  return new Intl.NumberFormat().format(amount);
};

// 모달 Open/Close 함수
const isModalVisible = ref(false);

// 모달 Open
function openModal() {
  isModalVisible.value = true;
}

// 모달 Close
function closeModal() {
  isModalVisible.value = false;
}

// 자식 컴포넌트에서 선택된 카드를 받아 추가
const handleAddCards = (cards) => {
  addedCards.value = [...addedCards.value, ...cards]; // 추가된 카드들을 배열에 저장
};
</script>

<template>
  <div class="about">
    <!-- 연동된 카드 목록 -->
    <div class="card-list">
      <h2>연동된 카드</h2>
      <ul>
        <li v-for="(card, index) in [...cardData, ...addedCards]" :key="index" class="card-item">
          <img :src="card.image" alt="Card Image" class="card-image" />
          <div class="card-info">
            <div class="card-name">{{ card.prdtName }} ({{ card.financeName }})</div>
            <div class="card-balance">{{ formatAmount(card.totalAmount) }}원</div>
          </div>
        </li>
      </ul>
      <button @click="openModal">카드 추가하기</button>
    </div>
  </div>
  
  <!-- PopUpCard 컴포넌트 직접 사용 -->
  <PopUpCard @addCards="handleAddCards" :onClose="closeModal" :visible="isModalVisible" />
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


</style>