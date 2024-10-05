import apiInstance from '@/util/axios-instance';

export function setTokens(accessToken, refreshToken) {
   localStorage.setItem('accessToken', 'Bearer ' + accessToken);
   localStorage.setItem('refreshToken', 'Bearer ' + refreshToken);
}

export function setGoogleIdToken(googleIdToken) {
  localStorage.setItem('googleIdToken', googleIdToken);
}

export async function refreshAccessToken() {
   try {
      const refreshToken = localStorage.getItem('refreshToken');
      const response = await apiInstance.post('/api/v1/member/refresh-token', { refreshToken });
      const newAccessToken = response.data.accessToken;
      setTokens(newAccessToken, refreshToken);
      return newAccessToken;
   } catch (error) {
      throw error;
   }
}

export function clearTokens() {
   localStorage.removeItem('accessToken');
   localStorage.removeItem('refreshToken');
}

export function getAccessToken() {
   return localStorage.getItem('accessToken');
 }

export function setLocalStorage(loginData) {
   localStorage.setItem('memberId', loginData.memberId);

   if (!loginData.memberId) {
      console.error('memberId가 null입니다. 로그인 데이터:', loginData);
   }

   setTokens(loginData.accessToken, loginData.refreshToken);

   localStorage.setItem('auth', JSON.stringify(loginData));
   localStorage.setItem('memberName', loginData.memberName);

   if (loginData.memberIdx) {
      localStorage.setItem('memberIdx', loginData.memberIdx);
		}

		if (loginData.imageUrl) { 
      localStorage.setItem('imageUrl', loginData.imageUrl);
   	}

}