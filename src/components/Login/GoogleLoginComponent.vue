<script setup>
import { ref, onMounted } from 'vue';

const googleClientId = ref('');

onMounted(() => {
	const auth = localStorage.getItem('auth');
  if (auth) {
    window.location.href = '/home';
  } else {
  fetch('/api/v1/member/login/google')
    .then(response => response.text())
    .then(clientId => {
      googleClientId.value = clientId;
      gapi.load('auth2', () => {
        gapi.auth2.init({
          client_id: googleClientId.value
        }).then(() => {
      const authInstance = gapi.auth2.getAuthInstance();
      console.log(authInstance.isSignedIn.get());
		});
      });
    })
    .catch(error => console.error('Error fetching Google Client ID:', error));
	}
	});

	function ToGoogleLogin() {
  const auth2 = gapi.auth2.getAuthInstance();
  auth2.signIn().then(googleUser => {
    const google_id_token = googleUser.getAuthResponse().id_token;

    fetch('/api/v1/member/login/google', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ token: google_id_token })
    })
    .then(response => response.json())
    .then(data => {
      if (data.message === "Login success") {
        localStorage.setItem('auth', JSON.stringify(data));
        window.location.href = '/home';
      } else if (data.message === "Registration success") {
        localStorage.setItem('auth', JSON.stringify(data));
        alert('회원가입이 완료되었습니다!');
        window.location.href = '/home';
      }
    })
    .catch(error => console.error('Error during login/join:', error));
  });
}
</script>
