import './assets/main.css';
import './assets/tailwind.css';

import { createApp } from 'vue';
import { createPinia } from 'pinia';
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate';

import App from './App.vue';
import router from './router';

import { library } from '@fortawesome/fontawesome-svg-core';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import { fas } from '@fortawesome/free-solid-svg-icons';
import { far } from '@fortawesome/free-regular-svg-icons';
import { fab } from '@fortawesome/free-brands-svg-icons';

import socket from './util/socket';
import { useAuthStore } from './stores/auth';

library.add(fas, far, fab);
const app = createApp(App);

const pinia = createPinia();
pinia.use(piniaPluginPersistedstate); 

app.use(createPinia());
app.use(router);

app.component('font-awesome-icon', FontAwesomeIcon);

app.mount('#app');

const authStore = useAuthStore();

function initializeSocket() {
  socket.on('authUpdate', (socketAuthData) => {
    const localAuth = JSON.parse(localStorage.getItem('auth'));

    if (
      localAuth &&
      (localAuth.memberName !== socketAuthData.memberName ||
        localAuth.memberId !== socketAuthData.memberId ||
        localAuth.memberIdx !== socketAuthData.memberIdx)
    ) {
      // 로그아웃
      localStorage.removeItem('auth');
      authStore.clearAuthState();
      router.push('/');
    }
  });
}

// 스토어 상태가 변경될 때마다 호출 -> 로그인 상태 감지
authStore.$subscribe((mutation, state) => {
  if (authStore.isLogin()) {
    // 로그인해야만 socket 연결
    initializeSocket();
  }
});
