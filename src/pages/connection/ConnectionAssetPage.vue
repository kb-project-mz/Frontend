<script setup>
import { ref, onMounted } from 'vue';
import { useAssetStore } from '@/stores/asset-history';
import { useRoute } from 'vue-router';  // useRoute를 사용하여 URL 파라미터를 가져옴

const assetStore = useAssetStore();
const assetData = ref([]);
const accountData = ref([]);
const cardData = ref([]);

const route = useRoute();  // 현재 경로 정보 가져오기
const memberId = route.params.memberId;  // URL에서 memberId 추출

onMounted(()=> {
    fetchAsset(memberId); // 추출한 memberId로 fetchAsset호출
})


const fetchAsset = async(memberId) => {
    await assetStore.getAssetList(memberId)
    assetData.value = assetStore.assetList;

    const acctData = ref()
    
    // assetData를 acctData에 복사 
    Object.assign(acctData,assetData);

    // filter를 이용하여 data.financeKind에 따라 계좌/카드 배열로 나누어서 저장함
    cardData.value = acctData.value.filter(data => data.financeKind == 1)
    accountData.value = acctData.value.filter(data => data.financeKind == 2)
}

const formatAmount = (amount) => {
  return new Intl.NumberFormat().format(amount);
};

</script>

<template>
  
</template>

<style scoped>

</style>
