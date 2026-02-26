import { defineConfig } from 'vite';
import { svelte } from '@sveltejs/vite-plugin-svelte';

export default defineConfig({
	plugins: [svelte()],
	server: {
		port: 5173,
		host: '0.0.0.0',
		proxy: {
			'/mock': {
				target: 'http://127.0.0.1:5174',
				changeOrigin: true,
				rewrite: (path) => path
			}
		}
	}
});
