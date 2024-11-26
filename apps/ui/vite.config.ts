import react from '@vitejs/plugin-react';
import path from 'path';
import { defineConfig } from 'vite';

// https://vitejs.dev/config/
export default defineConfig({
	plugins: [react()],
	build: {
		outDir: './dist',
		emptyOutDir: true,
	},
	resolve: {
		alias: {
			'@/assets': path.resolve(__dirname, './src/assets'),
			'@/components': path.resolve(__dirname, './src/components'),
			'@/pages': path.resolve(__dirname, './src/pages'),
			'@/hooks': path.resolve(__dirname, './src/hooks'),
			'@/global': path.resolve(__dirname, './src/global'),
		},
	},
});
