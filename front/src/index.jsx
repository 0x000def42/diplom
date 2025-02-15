import { render } from 'preact';
import { LocationProvider } from 'preact-iso';
import { Router, Route } from 'preact-router';

import { useState } from 'preact/hooks';

import Layout from './components/Layout.jsx';
import Home from './pages/Home/index.jsx';
import { NotFound } from './pages/_404.jsx';

export function App() {
	const [searchTerm, setSearchTerm] = useState('');

	const handleSearchChange = (event) => {
		setSearchTerm(event.target.value);
	};

	return (
		<LocationProvider>
			<Layout searchTerm={searchTerm} onSearchChange={handleSearchChange}> 
				<Router>
					<Route path="/" component={() => <Home searchTerm={searchTerm} />} />
					<Route default component={NotFound} />
				</Router>
			</Layout>
		</LocationProvider>
	);
}

render(<App />, document.getElementById('app'));
