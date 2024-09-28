import apiInstance from '@/util/axios-instance';

// 토큰 저장
export function setTokens(accessToken, refreshToken) {
   localStorage.setItem('accessToken', 'Bearer ' + accessToken);
   localStorage.setItem('refreshToken', 'Bearer ' + refreshToken);
}

export function setGoogleIdToken(googleIdToken) {
  localStorage.setItem('googleIdToken', googleIdToken);
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

export function setLocalStorage(loginData) {
   console.log('setLocalStorage 호출:', loginData);
   localStorage.setItem('memberId', loginData.memberId);
 
   if (!loginData.memberId) {
      console.error('memberId가 null입니다. 로그인 데이터:', loginData);
    }
 
   setTokens(loginData.accessToken, loginData.refreshToken);
   localStorage.setItem('auth', JSON.stringify(loginData));
   localStorage.setItem('memberId', loginData.memberId);
   localStorage.setItem('memberName', loginData.memberName);
   
   console.log('로컬 스토리지에 로그인 데이터 설정 완료');
 }