<script setup>
import { ref, onMounted } from 'vue';
import { useAssetStore } from '@/stores/asset-history';
import { useRoute } from 'vue-router';
import { defineProps, defineEmits } from 'vue';
import axios from 'axios';
import apiInstance from '@/stores/axios-instance';

const assetStore = useAssetStore();
const assetData = ref([]);
const accountData = ref([]);
const newAccount = ref(null); 
const message = ref('');

const route = useRoute();
const memberId = route.params.memberId;

onMounted(() => {
  fetchAsset(memberId);
});

const fetchAsset = async (memberId) => {
  await assetStore.getAssetList(memberId);
  assetData.value = assetStore.AllAssetList;
  accountData.value = assetData.value.filter(data => data.financeKind === 2);
};

const formatAmount = (amount) => {
  return new Intl.NumberFormat().format(amount);
};

// 부모 컴포넌트에 선택된 카드를 전달할 emit 정의
const emit = defineEmits(['addAccount', 'updateAccountData']);
const props = defineProps({
  visible: { type: Boolean, required: true },
  onClose: { type: Function, required: true }
});

function close() {
  props.onClose();
}

const selectAccount = (account) => {
  newAccount.value = account;
  message.value = ''; 
};

const addAccount = async () => {
  try {
    if(!newAccount.value){
      message.value = '선택된 카드가 없습니다.';
      return;
    }
    close();
    const id = newAccount.value.prdtId;
    console.log("id-------------", id);

     // Pinia store의 action 호출
    const store = useAssetStore();
    await store.updateAccountStatus(id);

    const accountIndex = accountData.value.indexOf(newAccount.value);
    if(accountIndex > -1) {
      accountData.value.splice(accountIndex, 1);
    }

    const response = await apiInstance.post(`/connection/account/${id}`);
    if (accountIndex > -1) {
      accountData.value.splice(accountIndex, 1);
    }
   
    if (response.data.success) {
      emit('updateAccountData', accountData.value);
      if (accountIndex > -1) {
        accountData.value.splice(accountIndex, 1);
    }
    } else {
      console.error('서버 요청 실패:', response.status);
    }
  } catch (error) {
    console.error('서버 통신 중 오류 발생: ', error);
  }
};
</script>

<template>
  <div v-if="visible" class="modal-overlay" @click="close">
    <div class="modal-content" @click.stop>
      <div class="account-list">
        <h2>연동할 계좌 선택</h2>

        <ul v-if="accountData && accountData.length > 0">
          <li v-for="(account, index) in accountData" :key="index" class="account-item">
            <input 
              type="radio" 
              name="selectedAccount"
              :id="'account-' + index"
              :value="account" 
              v-model="newAccount" 
              @change="selectAccount(account)"
            />
            <img :src="account.image" alt="Account Image" class="account-image" />
            <div class="account-info">
              <div class="account-name">{{ account.prdtName }} ({{ account.financeName }})</div>
              <div class="account-balance">{{ formatAmount(account.totalAmount) }}원</div>
            </div>
          </li>
        </ul>

        <p v-if="message">{{ message }}</p>
        <p v-if="accountData.length === 0">더 이상 추가할 계좌가 없습니다.</p>
        <button v-if="accountData.length > 0 && !message" @click="addAccount">추가하기</button>
      </div>
      <button @click="close">닫기</button>
    </div>
  </div>
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
