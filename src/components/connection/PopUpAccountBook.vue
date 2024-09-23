<script setup>
import { ref, onMounted } from 'vue';
import { useAssetStore } from '@/stores/asset-history';
import { useRoute } from 'vue-router';
import { defineProps } from 'vue';

const assetStore = useAssetStore();
const assetData = ref([]);
const accountData = ref([]);
const selectedAccounts = ref([]); // 선택된 계좌들을 저장하는 배열

const route = useRoute();
const memberId = route.params.memberId;

onMounted(() => {
  fetchAsset(memberId);
});

const fetchAsset = async (memberId) => {
  await assetStore.getAssetList(memberId);
  assetData.value = assetStore.AllAssetList;

  const acctData = assetData.value.slice();
  accountData.value = acctData.filter(data => data.financeKind == 2);
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
  props.onClose(); // 부모 컴포넌트에서 On/Off 제어
}

// 계좌 선택 시 배열에 추가/삭제
const selectAccount = (account) => {
  const index = selectedAccounts.value.indexOf(account);
  if (index > -1) {
    // 이미 선택된 항목이면 배열에서 제거
    selectedAccounts.value.splice(index, 1);
  } else {
    // 새 항목을 배열에 추가
    selectedAccounts.value.push(account);
  }
};

</script>

<template>

  <!-- 조건부 렌더링으로 팝업을 제어 -->
  <div v-if="visible" class="modal-overlay" @click="close">
    <div class="modal-content" @click.stop>
      <!-- 팝업 내용 -->
      <div class="account-list">
        <h2>연동할 계좌 선택</h2>
          <ul>
            <li v-for="(account, index) in accountData" :key="index" class="account-item">
              <input 
                type="checkbox" 
                :id="'account-' + index" 
                :checked="selectedAccounts.includes(account)" 
                @change="selectAccount(account)" 
              />
              <img :src="account.image" alt="Account Image" class="account-image" />
              <div class="account-info">
                <div class="account-name">{{ account.prdtName }} ({{ account.financeName }})</div>
                <div class="account-balance">{{ formatAmount(account.totalAmount) }}원</div>
              </div>
            </li>
            <button @click="">추가하기</button>
          </ul>
      </div>
      <button @click="close">Close</button>
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
