import './assets/main.css';
import './assets/tailwind.css';

import { createApp } from 'vue';
import { createPinia } from 'pinia';

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

app.use(createPinia());
app.use(router);

app.component('font-awesome-icon', FontAwesomeIcon);

const authStore = useAuthStore();
authStore.loadAuthState();


if (window.Kakao && !window.Kakao.isInitialized()) {
  window.Kakao.init(import.meta.env.VITE_KAKAO_KEY);
}

app.mount('#app');

function initializeSocket() {
  socket.on('authUpdate', (socketAuthData) => {
		console.log("socket 연결 당시 스토어", localStorage.getItem('auth'));
    const localAuth = JSON.parse(localStorage.getItem('auth'));

    if (
      localAuth &&
      (localAuth.memberName !== socketAuthData.memberName ||
        localAuth.memberId !== socketAuthData.memberId ||
        localAuth.memberIdx !== socketAuthData.memberIdx)
    ) {
      router.push('/');
    }
  });
}

// 스토어 상태가 변경될 때마다 호출 -> 로그인 상태 감지
authStore.$subscribe((mutation, state) => {
	console.log("is_login", authStore.isLogin());
  if (authStore.isLogin()) {
    // 로그인해야만 socket 연결
    initializeSocket();
  }
});

// storage 이벤트 추가 -> 새로고침 후에도 localStorage 변경 감지
window.addEventListener('storage', (event) => {
  if (event.key === 'auth') {
    const newAuthData = JSON.parse(event.newValue);
    const oldAuthData = JSON.parse(event.oldValue);

    // 처음 로그인한 사용자의 memberIdx가 변경되었는지 확인
    if (
      newAuthData &&
      oldAuthData &&
      oldAuthData.memberIdx !== newAuthData.memberIdx
    ) {
      // localStorage.removeItem('auth');
      // authStore.clearAuthState();
      router.push('/');
    }
  }
});
