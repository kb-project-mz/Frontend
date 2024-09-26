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
    <!-- <div class="text-lg font-semibold">연동된 계좌 목록</div> -->
    <div class="w-full p-6 bg-white border border-gray-200 rounded-2xl shadow">
      <div v-if="connectedAccountList.length > 0">
        <div v-for="(account, index) in connectedAccountList" :key="index" class=" py-3 pl-2 flex items-center">
          <img :src="account.image" alt="account" class="w-12 h-12 mr-4 rounded-full" />
          <div>
            <div class="text-medium">{{ account.prdtName }}</div>
            <div class="text-lg font-bold">{{ account.totalAmount.toLocaleString() }}원</div>
          </div>
        </div>
        <button @click="openModal" class="w-full">
          <div class="flex flex-row items-center py-3 pl-2 text-lg hover:bg-gray-400 hover:rounded-lg">
            <font-awesome-icon :icon="['fas', 'circle-plus']" class="text-navy w-12 h-12 mr-4"/>계좌 추가하기
          </div>
        </button>
      </div>

      <div v-else class="flex flex-col items-center">
        <div class="text-xl">연결된 계좌가 없어요</div>
        <div class="text-9xl font-black mt-6 mb-8 text-gray-600">텅</div>
        <button @click="openModal" class="w-full py-4 bg-navy text-white text-lg rounded-lg">
          계좌 연결하러 가기
        </button>
      </div>
    </div>
  </div>

  <PopUpAccountBook
    @updateAccount="fetchAsset"
    :onClose="closeModal"
    :visible="isModalVisible" />
</template>

<style scoped>
.bg-navy {
  background-color: #0B1573;
}
.text-navy {
  color: #0B1573;
}
</style>
