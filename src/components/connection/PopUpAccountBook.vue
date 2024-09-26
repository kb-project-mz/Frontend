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
  if (!selectedAccount.value) {
    message.value = '연결할 계좌를 선택해주세요!';
    return;
  }
  
  await assetStore.updateAccountStatus(selectedAccount.value);
  emit('updateAccount', selectedAccount.value);
  close();
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
    <div class="w-1/4 bg-white p-5 rounded-lg shadow-lg fixed box-border" @click.stop>
      <div class="flex flex-col">
        <div class="relative w-full mb-5">
          <div class="text-lg font-bold text-center">연결 가능한 계좌를 찾았어요</div>
          <button
            class="absolute right-0 top-0 text-gray-700"
            @click="close">
            <font-awesome-icon :icon="['fas', 'xmark']" class="text-xl mt-1" /> 
          </button>
        </div>
        <div class="">
          <div v-if="unconnectedAccountList.length > 0">
            <div v-for="(account, index) in unconnectedAccountList" :key="index" class="flex items-center mb-6">
              <input 
                type="radio" 
                name="selectedAccount"
                :id="'account-' + index"
                :value="account" 
                v-model="selectedAccount" 
                @change="selectAccount(account)"
                class="mr-3"
              />
              <img :src="account.image" alt="account" class="w-10 h-10 mr-3 rounded-full" />
              <div class="flex flex-col">
                <div class="text-sm text-gray-600">{{ account.financeName }} </div>
                <div class="font-bold">{{ account.prdtName }}</div>
              </div>
            </div>
            <div v-if="message" class="mb-4 text-red-500 text-lg font-bold text-center">{{ message }}</div>
          </div>
          <div v-else class="text-red-500 text-lg font-bold text-center">더 이상 추가할 계좌가 없어요!</div>
        </div>
        <button 
          v-if="unconnectedAccountList.length > 0" 
          @click="addAccount"
          class="w-full mt-1 px-4 py-2 bg-navy text-white rounded-lg hover:bg-blue-600">
          선택한 자산 연결하기
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.bg-navy {
  background-color: #0b1573;
}
</style>
