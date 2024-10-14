<script setup>
import Account from '@/components/home/Account.vue';
import Challenge from '@/components/home/Challenge.vue';
import SBTIResult from './SBTIResult.vue';
import 'swiper/swiper-bundle.css';
import { Swiper, SwiperSlide } from 'swiper/vue';
import { Navigation, Autoplay } from 'swiper/modules';


const swiperBreakpoints = {
  1024: {
    slidesPerView: 1,
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
        <span class="text-7xl text-customNavy mb-6"></span>
        <span class="text-7xl text-customNavy mb-6">&nbsp;&nbsp;&nbsp;지금 당신의 </span>
        <span class="text-7xl text-customNavy"><span class="text-transparent stroke">자산</span>은</span>
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
      :autoplay="{ delay: 2000 }"
    >
    <SwiperSlide>
        <div class="w-full flex justify-end font-jamsil">
          <div class="w-1/3 mr-32">
            <SBTIResult />
          </div>
        </div>
      </SwiperSlide>
      <SwiperSlide>
        <div class="w-full flex justify-end">
          <div class="w-1/3 mr-32">
            <Challenge />
          </div>
        </div>
      </SwiperSlide>
      <SwiperSlide>
        <div class="w-full flex justify-end">
          <div class="w-1/3 mr-32">
            <Account />
          </div>
        </div>
      </SwiperSlide>
      <SwiperSlide>
        <div class="w-full flex justify-end font-jamsil">
          <div class="w-1/3 mr-32">
            <SBTIResult /> 
          </div>
        </div>
      </SwiperSlide>
      <SwiperSlide>
        <div class="w-full flex justify-end">
          <div class="w-1/3 mr-32">
            <Challenge /> 
          </div>
        </div>
      </SwiperSlide>
    </Swiper>
  </div>
</template>

<style setup></style>
