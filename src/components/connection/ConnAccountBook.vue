<script setup>
import { ref, onMounted, watch } from 'vue';
import { useAssetStore } from '@/stores/asset';
import PopUpAccountBook from '@/components/connection/PopUpAccountBook.vue';

const memberId = localStorage.getItem("id");

const assetStore = useAssetStore();
const connectedAccountList = ref([]);

const isModalVisible = ref(false);

const openModal = async () => {
  await fetchAsset();
  isModalVisible.value = true;
}

const closeModal = () => {
  isModalVisible.value = false;
}

const fetchAsset = async () => {
  await assetStore.getAssetList(memberId);
  const accountList = assetStore.allAccountList;
  connectedAccountList.value = accountList.filter(account => account.connStatus === 1);
};

onMounted(async () => {
  await fetchAsset();
});
</script>

<template>

  <div class="flex flex-col items-center">
    <div class="text-lg font-semibold">연동된 계좌 목록</div>
    <div class="w-full p-6 bg-white border border-gray-200 rounded-2xl shadow">
      <div v-if="connectedAccountList.length > 0">
        <div v-for="(account, index) in connectedAccountList" :key="index" class="mb-7 flex items-center">
          <img :src="account.image" alt="account" class="w-12 h-12 mr-3 account-image" />
          <div>
            <div class="text-medium">{{ account.prdtName }}</div>
            <div class="text-lg font-bold">{{ account.totalAmount.toLocaleString() }}원</div>
          </div>
        </div>
      </div>

      <div v-else>
        텅
      </div>
      <button @click="openModal">계좌 추가하기</button>
    </div>
  </div>

  <PopUpAccountBook
    @updateAccount="fetchAsset"
    :onClose="closeModal"
    :visible="isModalVisible" />
</template>

<style scoped>

</style>
