import axios from 'axios';
import router from '@/router'; 
import { useAuthStore } from '@/stores/auth';

const apiInstance = axios.create({
  baseURL: "http://localhost:8080/api/v1"
});

apiInstance.interceptors.response.use(
  response => response,

  error => {
    const authStore = useAuthStore();

    if (error.response) {
      if (error.response.status === 403) {
        alert('권한이 없습니다. 관리자 계정으로 로그인하세요.');
        router.push('/login');
      }

      if (error.response.status === 401) {
        alert('세션이 만료되었습니다. 다시 로그인하세요.');
        authStore.logout();
        router.push('/login');
      }
    }

    return Promise.reject(error);
  }
);

export default apiInstance;
