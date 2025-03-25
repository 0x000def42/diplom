import { render } from 'preact';
import { LocationProvider, Router, Route } from 'preact-iso';

import { useState, useEffect } from 'preact/hooks';

import Layout from './components/Layout.jsx';
import TemplateList from './pages/TemplateList/index.jsx';
import Profile from './pages/Profile/index.jsx';
import Template from './pages/Template/index.jsx'

import { NotFound } from './pages/_404.jsx';
import { GoogleOAuthProvider } from '@react-oauth/google';
import { jwtDecode } from 'jwt-decode';

export function App() {
	const [searchTerm, setSearchTerm] = useState('');
	const [user, setUser] = useState(null);

	const handleSearchChange = (event) => {
		setSearchTerm(event.target.value);
	};

	useEffect(() => {
		const token = localStorage.getItem('auth_token');
		if (token) {
			try {
				const decoded = jwtDecode(token);
				setUser(decoded);
			} catch (err) {
				console.warn('Невалидный токен, удаляю');
				localStorage.removeItem('auth_token');
			}
		}
	}, []);

	useEffect(() => {
		if (user) {
			fetch('/api/auth/google', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({ token: localStorage.getItem('auth_token') }),
			});
		}
	}, [user])

	return (
		<LocationProvider>
			<Layout searchTerm={searchTerm} user={user} onLogin={setUser} onSearchChange={handleSearchChange}> 
				<Router>
					<Route path="/" component={() => <TemplateList searchTerm={searchTerm} />} />
					<Route path="/templates/:id" component={() => <Template/>} />
					<Route path="/profile" component={() => <Profile/>} />
					<Route default component={NotFound} />
				</Router>
			</Layout>
		</LocationProvider>
	);
}

render(
	<GoogleOAuthProvider clientId="53718529070-ni24nagt6ja2vkn7ka5dtdla9o0aj5dv.apps.googleusercontent.com">
		<App />
	</GoogleOAuthProvider>, 

document.getElementById('app'));
