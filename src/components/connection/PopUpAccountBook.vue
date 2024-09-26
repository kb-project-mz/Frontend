<script setup>
import { ref, watch } from 'vue';
import { useAssetStore } from '@/stores/asset';

const props = defineProps({
  visible: { type: Boolean, required: true },
  onClose: { type: Function, required: true }
});

const memberId = localStorage.getItem("id");

const emit = defineEmits(['updateAccount']);

const assetStore = useAssetStore();
const unconnectedAccountList = ref([]);
const selectedAccount = ref(null);
const message = ref('');

const close = () => {
  props.onClose();
};

const selectAccount = (account) => {
  selectedAccount.value = account;
  message.value = ''; 
};

const addAccount = async () => {
  try {
    if (!selectedAccount.value) {
      message.value = '선택된 계좌가 없습니다.';
      return;
    }
    await assetStore.updateAccountStatus(selectedAccount.value);
    emit('updateAccount', selectedAccount.value);
    close();
  } catch (error) {
    console.error('서버 통신 중 오류 발생: ', error);
  }
};

const fetchAsset = async () => {
  await assetStore.getAssetList(memberId);
  const accountList = assetStore.allAccountList;
  unconnectedAccountList.value = accountList.filter(account => account.connStatus === 0);
};

watch(() => props.visible, (newVal) => {
  if (newVal) {
    fetchAsset();
    selectedAccount.value = null;
  }
});
</script>

<template>
  <div v-if="visible" class="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center" @click="close">
    <div class="bg-white p-5 rounded-lg shadow-lg fixed max-w-lg w-1/2 box-border" @click.stop>
      <div class="flex flex-col account-list items-center">
        <div class="relative w-full mb-5">
          <div class="text-lg font-bold text-center">연동할 계좌 선택</div>
          <button
            class="absolute right-0 top-0 text-gray-700 rounded hover:bg-gray-400"
            @click="close">
            X
          </button>
        </div>
        <div class="w-full flex flex-col items-center">
          <div v-if="unconnectedAccountList.length > 0" class="list-none p-0 m-0">
            <div v-for="(account, index) in unconnectedAccountList" :key="index" class="px-7 flex items-center mb-4">
              <input 
              type="radio" 
              name="selectedAccount"
              :id="'account-' + index"
              :value="account" 
              v-model="selectedAccount" 
              @change="selectAccount(account)"
              class="mr-3"
            />
            <img :src="account.image" alt="account" class="w-10 h-10 mr-3" />
            <div class="flex flex-col">
              <div class="text-sm font-bold">{{ account.prdtName }} ({{ account.financeName }})</div>
              <div class="text-gray-600">{{ account.totalAmount.toLocaleString() }}원</div>
            </div>
            </div>
          </div>

          <p v-if="message" class="text-red-500">{{ message }}</p>
          <p v-if="unconnectedAccountList.length === 0" class="text-gray-500">더 이상 추가할 계좌가 없습니다.</p>
        </div>
        <button 
          v-if="unconnectedAccountList.length > 0 && !message" 
          @click="addAccount"
          class="w-full mt-4 px-4 py-2 bg-navy text-white rounded hover:bg-blue-600"
        >
          선택한 자산 연결하기
        </button>
      </div>
      
    </div>
  </div>
</template>

<style scoped>
.bg-navy {
  background-color: #0B1573
}
</style>
