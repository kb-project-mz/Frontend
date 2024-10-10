<template>
    <div class="survey-container gong-gothic-font">
        <div class="question">
            <label class="text-2xl">당신이 태어난 연도는?</label>
            <div class="wheel-picker">
                <div class="wheel" @scroll="onScroll" ref="wheel">
                    <ul>
                        <li class="spacer"></li>
                        <li v-for="year in years" :key="year" :class="{ active: birthYear === year }">
                            {{ year }}
                        </li>
                        <li class="spacer"></li>
                        <li class="spacer"></li>
                    </ul>
                </div>
            </div>
        </div>
        <br />
        <div class="question gong-gothic-font">
            <label class="text-2xl">당신의 성별은?</label>
            <br />
            <div class="gender-options">
                <button
                    class="custom-shadow gong-gothic-font bg-white text-gray-500 font-medium py-4 px-6 rounded-xl text-l transition duration-300 transform hover:scale-105 w-[100px]"
                    v-for="(option, index) in genderOptions"
                    :key="index"
                    :class="{ selected: selectedGender === option }"
                    @click="selectGender(option)"
                >
                    {{ option }}
                </button>
            </div>
        </div>

        <!-- 다음 버튼 -->
        <button
            class="custom-shadow gong-gothic-font bg-white text-gray-500 font-medium py-4 px-6 rounded-xl text-l transition duration-300 transform hover:scale-105 w-[100px]"
            @click="goToQuestions"
        >
            다음
        </button>
    </div>
</template>

<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";
import { useTestStore } from "@/stores/test";

const router = useRouter();
const testStore = useTestStore();

const birthYear = ref(null);
const selectedGender = ref(null);

const years = Array.from({ length: 100 }, (v, i) => new Date().getFullYear() - i);
const genderOptions = ["남성", "여성"];

const selectGender = (option) => {
    selectedGender.value = option;
};

const goToQuestions = () => {
    if (selectedGender.value === "여성") {
        selectedGender.value = "female";
    } else {
        selectedGender.value = "male";
    }
    testStore.setBirthYear(birthYear.value);
    testStore.setGender(selectedGender.value);
    router.push({ name: "testQuestion", params: { number: 1 } });
};

const onScroll = (event) => {
    const scrollPosition = event.target.scrollTop;
    const itemHeight = 40;
    const index = Math.round(scrollPosition / itemHeight);
    birthYear.value = years[index];
};
</script>

<style>
.survey-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    /* min-height: 100vh; */
    text-align: center;
    padding: 20px;
    font-family: Arial, sans-serif;
}

.question {
    margin-bottom: 30px;
}

label {
    font-size: 18px;
    font-weight: bold;
    margin-bottom: 10px;
    display: block;
}

.wheel-picker {
    display: flex;
    justify-content: center;
    align-items: center;
    overflow: hidden;
    height: 150px;
    width: 100px;
    margin: 0 auto;
}

.wheel {
    height: 120px;
    overflow-y: scroll;
    scroll-snap-type: y mandatory;
    -webkit-overflow-scrolling: touch;
    scrollbar-width: none; /* Firefox */
    -ms-overflow-style: none; /* Internet Explorer 10+ */
}

.wheel::-webkit-scrollbar {
    display: none; /* Chrome, Safari, Opera */
}

ul {
    padding: 0;
    margin: 0;
    list-style: none;
    text-align: center;
}

li {
    height: 40px; /* 항목 높이 */
    line-height: 40px;
    font-size: 18px;
    color: #999;
    scroll-snap-align: center;
}

li.active {
    font-size: 24px;
    font-weight: bold;
    color: #000;
}

.spacer {
    height: 40px;
}

.gender-options button {
    font-size: 18px;
    padding: 10px 20px;
    margin: 5px;
    border: none;
    border-radius: 5px;
    background-color: #eee;
    cursor: pointer;
    transition: background-color 0.3s ease;
}

.gender-options button.selected {
    background-color: #333;
    color: #fff;
}

.next-button {
    font-size: 18px;
    padding: 10px 20px;
    background-color: black;
    color: white;
    border: none;
    border-radius: 5px;
    cursor: pointer;
    transition: background-color 0.3s ease;
}

.next-button:hover {
    background-color: #555;
}

@font-face {
    font-family: "GongGothicMedium";
    src: url("https://fastly.jsdelivr.net/gh/projectnoonnu/noonfonts_20-10@1.0/GongGothicMedium.woff") format("woff");
    font-weight: normal;
    font-style: normal;
}

.gong-gothic-font {
    font-family: "GongGothicMedium", sans-serif;
}
</style>
