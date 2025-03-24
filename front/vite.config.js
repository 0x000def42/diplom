import { defineConfig } from 'vite';
import preact from '@preact/preset-vite';

// https://vitejs.dev/config/
export default defineConfig({
	resolve: {
		alias: {
			'react': 'preact/compat',
			'react-dom': 'preact/compat',
		},
	},
	server: {
		proxy: {
			'/api': {
				target: 'http://localhost:8000',
				changeOrigin: true,
				secure: false
			},
			'/media': {
				target: 'http://localhost:8000',
				changeOrigin: true,
				secure: false
			}
		},
	},
	plugins: [preact()],
});
