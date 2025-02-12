import { render } from 'preact';
import { LocationProvider } from 'preact-iso';
import { Router, Route } from 'preact-router'; // Importing Router

import { Header } from './components/Header.jsx';
import Footer from './components/Footer.jsx';
import { Home } from './pages/Home/index.jsx';
import { NotFound } from './pages/_404.jsx';
import Layout from './components/Layout.jsx'; // Importing the Layout

export function App() {
	return (
		<LocationProvider>
			<Layout> {/* Using the Layout component */}
				<Router>
					<Route path="/" component={Home} />
					<Route default component={NotFound} />
				</Router>
			</Layout>
		</LocationProvider>
	);
}

render(<App />, document.getElementById('app'));
