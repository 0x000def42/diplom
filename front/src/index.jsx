import { render } from 'preact';
import { LocationProvider, Router, Route } from 'preact-iso';
import { useEffect } from 'preact/hooks';
import Layout from './components/Layout.jsx';
import TemplateList from './pages/TemplateList/index.jsx';
import Profile from './pages/Profile/index.jsx';
import Template from './pages/Template/index.jsx';
import { NotFound } from './pages/_404.jsx';
import { GoogleOAuthProvider } from '@react-oauth/google';
import { jwtDecode } from 'jwt-decode';
import { useGlobalStore } from './store';
import TemplateUpload from './pages/TemplateUpload/index.jsx';

export function App() {
  const setUser = useGlobalStore((s) => s.setUser);
  const setReady = useGlobalStore((s) => s.setReady);
  const user = useGlobalStore((s) => s.user);
  const isReady = useGlobalStore((s) => s.isReady);

  useEffect(() => {
    const token = localStorage.getItem('auth_token');
    if (token) {
      try {
        const decoded = jwtDecode(token);
        setUser(decoded);
      } catch {
        localStorage.removeItem('auth_token');
      }
    }
    setReady();
  }, []);

  useEffect(() => {
    if (user) {
      fetch('/api/auth/google', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token: localStorage.getItem('auth_token') }),
      });
    }
  }, [user]);

  if (!isReady) return null;

  return (
    <LocationProvider>
      <Layout>
        <Router>
          <Route path="/" component={() => <TemplateList />} />
          <Route path="/templates/upload" component={() => <TemplateUpload />}></Route>
          <Route path="/templates/:id" component={() => <Template />} />
          <Route path="/profile" component={() => <Profile />} />
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
  document.getElementById('app')
);