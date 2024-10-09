<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
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
  if(selectedGender.value==='여성'){
    selectedGender.value ='F';
  }else {
    selectedGender.value ='M';
  }
  testStore.setBirthYear(birthYear.value);
  testStore.setGender(selectedGender.value);
  console.log(testStore.birthYear); 
  console.log(testStore.gender); 
  router.push({ name: "testQuestion", params: { number: 1 } });
};
  
  </script>
  
  <template>
    <div class="survey-container">
      <h1>회원가입</h1>
      
      <div class="question">
        <label>당신이 태어난 연도는?</label>
        <select v-model="birthYear">
          <option v-for="year in years" :key="year" :value="year">{{ year }}</option>
        </select>
      </div>
  
      <div class="question">
        <label>당신의 성별은?</label>
        <div class="gender-options">
          <button 
            v-for="(option, index) in genderOptions" 
            :key="index" 
            :class="{ selected: selectedGender === option }" 
            @click="() => selectGender(option)"
          >
            {{ option }}
          </button>
        </div>
      </div>
      
      <!-- 다음 버튼 -->
      <button @click="goToQuestions">다음</button>
    </div>
  </template>
  
  <style>
  .survey-container {
    text-align: center;
    padding: 20px;
    font-family: Arial, sans-serif;
  }
  
  h1 {
    margin-bottom: 20px;
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
  
  select {
    font-size: 18px;
    padding: 10px;
    margin-top: 10px;
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
  </style>
  