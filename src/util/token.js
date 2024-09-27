import apiInstance from '@/util/axios-instance';

// 토큰 저장
export function setTokens(accessToken, refreshToken) {
   localStorage.setItem('accessToken', 'Bearer ' + accessToken);
   localStorage.setItem('refreshToken', 'Bearer ' + refreshToken);
}

// 토큰 갱신
export async function refreshAccessToken() {
   try {
      const refreshToken = localStorage.getItem('refreshToken');
      const response = await apiInstance.post('/api/v1/member/refresh-token', { refreshToken });
      const newAccessToken = response.data.accessToken;
      setTokens(newAccessToken, refreshToken); // 새로운 Access 토큰 저장
      return newAccessToken;
   } catch (error) {
      console.error('토큰 갱신 중 오류:', error);
      throw error;
   }
}

// 토큰 삭제
export function clearTokens() {
   localStorage.removeItem('accessToken');
   localStorage.removeItem('refreshToken');
}
