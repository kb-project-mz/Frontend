<script setup>
import Account from '@/components/home/Account.vue';
import Challenge from '@/components/home/Challenge.vue';
import SBTIResult from './SBTIResult.vue';
import 'swiper/swiper-bundle.css';
import { Swiper, SwiperSlide } from 'swiper/vue';
import { Navigation, Autoplay } from 'swiper/modules';


const swiperBreakpoints = {
  1024: {
    slidesPerView: 3,
    spaceBetween: 20,
  },
};

</script>

<template>
  <div class="w-full">

    <div class="max-w-7.5xl mx-auto flex font-jamsil">
      <div class="text-left">
        <p class="text-7xl font-black text-transparent blue mt-10 mb-6">
          MZ 세대인 당신,
        </p>
        <span class="text-7xl font-bold blue mb-6"></span>
        <span class="text-7xl font-bold blue mb-6">&nbsp;&nbsp;&nbsp;지금 당신의 </span>
        <span class="text-7xl font-black text-transparent stroke">자산은</span>
        <p class="text-7xl font-bold blue ml-48 mt-6 mb-40">안녕하신가요?</p>
      </div>
    </div>
    
    <Swiper
      :spaceBetween="50"  
      :slidesPerView="1"
      :breakpoints="swiperBreakpoints"
      :modules="[Navigation, Autoplay]" 
      navigation 
      loop
      :autoplay="{ delay: 1500 }"
    >
      <SwiperSlide>
        <div class="w-full items-center h-full flex justify-center font-jamsil">
          <SBTIResult />
        </div>
      </SwiperSlide>
      <SwiperSlide>
        <div class="w-full flex justify-center">
          <Challenge />
        </div>
      </SwiperSlide>
      <SwiperSlide>
        <div class="w-full flex justify-center">
          <Account />
        </div>
      </SwiperSlide>
      <SwiperSlide>
        <div class="w-full flex justify-center font-jamsil">
          <SBTIResult /> 
        </div>
      </SwiperSlide>
      <SwiperSlide>
        <div class="w-full flex justify-center">
          <Challenge /> 
        </div>
      </SwiperSlide>
    </Swiper>
  </div>
</template>

<style setup>
@font-face {
    font-family: 'TheJamsil5Bold';
    src: url('https://fastly.jsdelivr.net/gh/projectnoonnu/noonfonts_2302_01@1.0/TheJamsil5Bold.woff2') format('woff2');
    font-weight: 700;
    font-style: normal;
}
.font-jamsil {
    font-family: 'TheJamsil5Bold', sans-serif; /* sans-serif 대체 폰트 추가 */
}</style>
