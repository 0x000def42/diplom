import { defineConfig } from 'vite';
import preact from '@preact/preset-vite';
import path from 'path';

// https://vitejs.dev/config/
export default defineConfig({
	resolve: {
		alias: {
			'react': 'preact/compat',
			'react-dom': 'preact/compat',
			'@': path.resolve(__dirname, './src')
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
