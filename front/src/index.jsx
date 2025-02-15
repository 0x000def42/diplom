import { render } from 'preact';
import { LocationProvider } from 'preact-iso';
import { Router, Route } from 'preact-router'; // Importing Router

import Layout from './components/Layout.jsx'; // Importing the Layout
import Home from './pages/Home/index.jsx';
import { NotFound } from './pages/_404.jsx';

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
