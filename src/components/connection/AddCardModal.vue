<script setup>
import { ref, watch } from 'vue';
import { useAssetStore } from '@/stores/asset';

const props = defineProps({
  visible: { type: Boolean, required: true }, 
  onClose: { type: Function, required: true } 
});

const memberId = localStorage.getItem("id");

const emit = defineEmits(['updateCard']);

const assetStore = useAssetStore();
const unconnectedCardList = ref([]);
const selectedCard = ref(null);
const message = ref('');

const close = () => {
  props.onClose();
}

const selectCard = (card) => {
  selectedCard.value = card;
  message.value = ''; 
}

const addCard = async () => {
  if (!selectedCard.value) {
    message.value = '연결할 카드를 선택해주세요!';
    return;
  } 

  await assetStore.updateCardStatus(selectedCard.value);
  emit('updateCard', selectedCard.value);
  close();
};

const fetchAsset = async () => {
  await assetStore.getAssetList(memberId);
  const cardList = assetStore.allCardList;
  unconnectedCardList.value = cardList.filter(card => card.connStatus === 0);
}

watch(() => props.visible, (newVal) => {
  if (newVal) {
    fetchAsset();
    selectedCard.value = null;
  }
});
</script>

<template>
  <div v-if="visible" class="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center" @click="close">
    <div class="w-1/4 bg-white p-5 rounded-lg shadow-lg fixed box-border" @click.stop>
      <div class="relative w-full mb-5">
        <div class="text-lg font-bold text-center">연결 가능한 카드를 찾았어요</div>
        <button
          class="absolute right-0 top-0 text-gray-700"
          @click="close">
          <font-awesome-icon :icon="['fas', 'xmark']" class="text-xl mt-1" /> 
        </button>
      </div>
      <div>
        <div v-if="unconnectedCardList.length > 0">
          <div v-for="(card, index) in unconnectedCardList" :key="index" class="flex items-center mb-6">
            <input 
              type="radio" 
              name="selectedCard"
              :id="'card-' + index"
              :value="card" 
              v-model="selectedCard" 
              @change="selectCard(card)"
              class="mr-3"
            />
            <img :src="card.image" alt="card" class="h-10 mr-3 rounded-sm" />
            <div class="flex flex-col">
              <div class="text-sm text-gray-600">{{ card.financeName }} </div>
              <div class="font-bold">{{ card.prdtName }}</div>
            </div>
          </div>
          <div v-if="message" class="mb-4 text-red-500 text-lg font-bold text-center">{{ message }}</div>
        </div>
        <div v-else class="text-red-500 text-lg font-bold text-center">더 이상 추가할 카드가 없어요!</div>
      </div>
      <button 
        v-if="unconnectedCardList.length > 0" 
        @click="addCard"
        class="w-full mt-1 px-4 py-2 bg-navy text-white rounded-lg hover:bg-blue-600">
        선택한 자산 연결하기
      </button>
    </div>
  </div>
</template>

<style scoped>
.bg-navy {
  background-color: #0b1573;
}
</style>
