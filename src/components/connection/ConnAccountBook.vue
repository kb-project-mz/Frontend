<script setup>
import { ref, onMounted } from 'vue';
import { useAssetStore } from '@/stores/asset-history';
import { useRoute } from 'vue-router';
import PopUpAccountBook from '@/components/connection/PopUpAccountBook.vue';

const assetStore = useAssetStore();
const assetData = ref([]);
const accountData = ref([]);
const addedAccounts = ref([]);

const route = useRoute();
const memberId = route.params.memberId;

onMounted(() => {
  fetchAsset(memberId);
});

const fetchAsset = async (memberId) => {
  await assetStore.getConnAssetList(memberId);
  assetData.value = assetStore.ConnAssetList;
  const acctData = assetData.value.slice();
  accountData.value = acctData.filter(data => data.financeKind == 2);
};

const formatAmount = (amount) => {
  return new Intl.NumberFormat().format(amount);
};

const isModalVisible = ref(false);
function openModal () {
  isModalVisible.value = true;
}
function closeModal () {
  isModalVisible.value = false;
}

const handleAddAccount = (newAccount) => {
  accountData.value.push(newAccount);
}

const handleAccountDataUpdate = (updatedAccountData) => {
  accountData.value = updatedAccountData;
};

</script>

<template>

  <div class="about">
  <!-- 버튼을 통해 모달 팝업 Open -->
  <div class="account-list">
    <h2>연동된 계좌</h2>

      <ul v-if="accountData.length > 0">
        <li v-for="(account, index) in accountData" :key="index" class="account-item">
          <img :src="account.image" alt="Account Image" class="account-image" />
          <div class="account-info">
          <div class="account-name">{{ account.prdtName }} ({{ account.financeName }})</div>
          <div class="account-balance">{{ formatAmount(account.totalAmount) }}원</div>
          </div>
        </li>
      </ul>

      <p v-else>텅</p>
      <button @click="openModal">계좌 추가하기</button>
    </div>
  </div>

  <PopUpAccountBook @updateAccount="handleAddAccount" 
    :onClose="closeModal" :visible="isModalVisible" @updateAccountData="handleAccountDataUpdate"/>
</template>

<style scoped>
.account-list {
  background-color: #fff;
  padding: 20px;
  border-radius: 10px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
}

.account-list h2 {
  margin-bottom: 20px;
  font-size: 18px;
  font-weight: bold;
}

.account-list ul {
  list-style-type: none;
  padding: 0;
  margin: 0;
}

.account-item {
  display: flex;
  align-items: center;
  margin-bottom: 15px;
}

.account-image {
  width: 40px;
  height: 40px;
  margin-right: 15px;
}

.account-info {
  display: flex;
  flex-direction: column;
}

.account-name {
  font-size: 14px;
  font-weight: bold;
  margin-bottom: 5px;
}

.account-balance {
  font-size: 14px;
  color: #666;
}

.add-account {
  display: flex;
  align-items: center;
}

.add-account button {
  background-color: transparent;
  border: none;
  color: #007bff;
  font-size: 14px;
  cursor: pointer;
  display: flex;
  align-items: center;
}

.add-account button img.add-icon {
  width: 20px;
  height: 20px;
  margin-right: 10px;
}

.add-account button:hover {
  text-decoration: underline;
}

</style>