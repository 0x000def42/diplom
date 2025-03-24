import { GoogleLogin } from '@react-oauth/google';
import { jwtDecode } from 'jwt-decode';

export default function LoginButton({ onLogin }) {
	return (
		<GoogleLogin
            text="signin"
			onSuccess={async (cred) => {
				try {
					const token = cred.credential;
					localStorage.setItem('auth_token', token);

					const user = jwtDecode(token);
					onLogin?.(user);
				} catch (err) {
					console.error('Ошибка при обработке логина:', err);
				}
			}}
			onError={() => {
				console.error('Google Login Failed');
			}}
		/>
	);
}