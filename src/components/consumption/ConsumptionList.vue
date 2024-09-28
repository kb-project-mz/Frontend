<script setup>
const props = defineProps({
    historyData: {
        type: Array,
        required: true,
    },
});
</script>

<template>
    <!-- 헤더 부분 -->
    <div class="mt-2 font-bold text-lg list-header">이번 달 자산 흐름</div>

    <!-- 리스트 부분 -->
    <div class="list-content">
        <div v-for="(history, index) in historyData" :key="index">
            <div class="mx-5">
                <div class="flex items-center justify-between">
                    <div>
                        <div class="text-sm">{{ history.consumptionDate }} {{ history.consumptionTime }}</div>
                        <div class="text-l my-1 font-bold">{{ history.content }}</div>
                        <div class="text-sm">{{ history.cardName }}</div>
                    </div>
                    <div>
                        <div>
                            <span class="text-xl" style="color: #f55151">{{ history.amount.toLocaleString() }}</span
                            >원
                        </div>
                    </div>
                </div>
            </div>
            <div class="border-b border-gray-300 my-2"></div>
        </div>
    </div>
</template>

<style scoped>
.list-header {
    text-align: left;
    padding-left: 30px;
    position: sticky;
    top: 0; /* 최상단에 고정 */
    background-color: white; /* 배경색을 설정하여 스크롤 시 내용과 겹치지 않도록 */
    z-index: 10; /* 스크롤 내용 위로 올라오게 */
    padding: 10px 25px; /* 여백 추가 */
    border-bottom: 1px solid #ccc; /* 하단 경계선 추가 */
}

/* 리스트 영역: 테두리 제거, 내부에만 스크롤 */
.list-content {
    height: 500px;
    overflow-y: auto;
    overflow-x: hidden; /* 가로 스크롤 없애기 */
    padding: 0 10px;
}

::-webkit-scrollbar-track {
    background: #f0f0f0;
    border-radius: 10px;
}

::-webkit-scrollbar-thumb {
    background-color: #c0c0c0;
    border-radius: 10px;
    border: 2px solid #f0f0f0;
}

::-webkit-scrollbar-thumb:hover {
    background-color: #a0a0a0;
}
.scroll-content::-webkit-scrollbar {
    width: 20px;
    height: 20px;
}

.scroll-content::-webkit-scrollbar-track {
    background: #f1f1f1;
    border-radius: 10px;
}

.scroll-content::-webkit-scrollbar-thumb {
    background-color: #888;
    border-radius: 10px;
    border: 2px solid #f1f1f1;
}

.scroll-content::-webkit-scrollbar-thumb:hover {
    background-color: #555;
}

::-webkit-scrollbar-track {
    background: #f0f0f0;
    border-radius: 10px;
}

::-webkit-scrollbar-thumb {
    background-color: #c0c0c0;
    border-radius: 50px;
    border: 2px solid #f0f0f0;
}

::-webkit-scrollbar-thumb:hover {
    background-color: #a0a0a0;
}
</style>
