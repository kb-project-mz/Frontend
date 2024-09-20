<template>
  <div class="card-list">
    <h2>내 카드 추천</h2>
    <ul>
      <li v-for="(card, index) in cardData" :key="index" class="card-item">
        <img :src="card.image" alt="Card Image" class="card-image" />
        <div class="card-info">
          <div class="card-name">{{ card.prdtName }} ({{ card.financeName }})</div>
          <div class="card-balance">{{ formatAmount(card.totalAmount) }}원</div>
        </div>
      </li>
      <li class="add-card">
        <button @click="addAccount">
          카드 추가하기
        </button>
      </li>
    </ul>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useAssetStore } from '@/stores/asset-history';
import { useRoute } from 'vue-router';

const assetStore = useAssetStore();
const assetData = ref([]);
const cardData = ref([]);

const route = useRoute();
const memberId = route.params.memberId;

onMounted(() => {
  fetchAsset(memberId);
});

const fetchAsset = async (memberId) => {
  await assetStore.getAssetList(memberId);
  assetData.value = assetStore.assetList;

  const acctData = assetData.value.slice();
  cardData.value = acctData.filter(data => data.financeKind == 1);
};

const formatAmount = (amount) => {
  return new Intl.NumberFormat().format(amount);
};

const addCard = () => {
  console.log('계좌 추가하기');
  // 계좌 추가 로직
};
</script>

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