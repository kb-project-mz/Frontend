<script setup>
import { ref, onMounted } from 'vue';
import { useAssetStore } from '@/stores/asset-history';
import { useRoute } from 'vue-router';  // useRoute를 사용하여 URL 파라미터를 가져옴

const assetStore = useAssetStore();
const assetData = ref([]);
const accountData = ref()
const cardData = ref()

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
   
  <div class="container">
    <table class="asset-table">
      <thead>
        <tr>
          <th>은행</th>
          <th>통장 이름</th>
          <th>통장 사진</th>
          <th>잔액</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(asset, index) in accountData" :key="index">
          <td>{{ asset.financeName }}</td>
          <td>{{ asset.prdtName }}</td>
          <td><img :src="asset.image" alt="AccountBook Image" class="table-image" /></td>
          <td>{{ formatAmount(asset.totalAmount) }}</td>
        </tr>
      </tbody>
      <tfoot>
        <tr>
          <td colspan="4">
            <button @click="">계좌 추가하기</button>
          </td>
        </tr>
      </tfoot>
    </table>

    <table class="asset-table">
      <thead>
        <tr>
          <th>카드사</th>
          <th>카드 이름</th>
          <th>카드 사진</th>
          <th>누적 사용금액</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(asset, index) in cardData" :key="index">
          <td>{{ asset.financeName }}</td>
          <td>{{ asset.prdtName }}</td>
          <td><img :src="asset.image" alt="Card Image" class="table-image" /></td>
          <td>{{ formatAmount(asset.totalAmount) }}</td>
        </tr>
      </tbody>
      <tfoot>
        <tr>
          <td colspan="4">
            <button @click="">카드 추가하기</button>
          </td>
        </tr>
      </tfoot>
    </table>
  </div>

</template>

<style scoped>
.container {
  display: flex;
  width: 80%;
  justify-content: space-between; /* 테이블 사이에 공간을 균등하게 배분 */
  gap: 5px; /* 테이블 사이의 간격 */
  flex-wrap: wrap; /* 화면 크기에 따라 테이블이 줄 바꿈 되도록 설정 */
}

.asset-table {
  width: 100%; /* 전체 너비를 사용 */
  max-width: 500px; /* 최대 너비 설정 */
  flex: 1; /* 테이블이 공간을 균등하게 차지하도록 설정 */
  min-width: 100px; /* 테이블이 너무 작아지지 않도록 최소 너비 설정 */
  border-collapse: collapse;
}

.asset-table th,
.asset-table td {
  padding: 10px;
  text-align: left;
  border: 1px solid #ddd;
}

.asset-table th {
  background-color: #f4f4f4;
  font-weight: bold;
}

.asset-table td img.table-image {
  max-width: 80px; /* 이미지 크기 조정 */
  height: auto;
  display: block;
}

.divider {
  border: 0;
  border-top: 2px solid #ddd;
  margin: 20px 0; /* hr과 테이블 간의 간격 */
}

</style>