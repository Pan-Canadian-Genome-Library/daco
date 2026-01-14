import react from '@vitejs/plugin-react';
import path from 'path';
import { defineConfig, loadEnv } from 'vite';

// This is used to define the path for proxy requests to the API
// It is used to set the proxy in the dev server and is also used to defined
// a global variable that is used in the client fetching code
const API_PROXY_PATH = '/api';

export default ({ mode }: { mode: string }) => {
	process.env = { ...process.env, ...loadEnv(mode, process.cwd(), ['VITE', 'API']) };
	const apiHost = process.env.API_URL || 'http://localhost:3000';
	const selfEnrolmentData = process.env.VITE_SELF_ENROLMENT_URL || 'VITE_SELF_ENROLMENT_URL';

	// https://vitejs.dev/config/
	return defineConfig({
		plugins: [react()],
		build: {
			outDir: 'dist',
			emptyOutDir: true,
			rollupOptions: {
				output: {
					format: 'es',
					globals: {
						react: 'React',
						'react-dom': 'ReactDOM',
					},
					manualChunks: {
						react: ['react', 'react-dom'],
					},
				},
			},
		},
		define: {
			__API_PROXY_PATH__: JSON.stringify(API_PROXY_PATH),
			__SELF_ENROLMENT_URL__: JSON.stringify(selfEnrolmentData),
		},
		resolve: {
			alias: {
				'@': path.resolve(__dirname, './src'),
			},
		},
		server: {
			proxy: {
				// Proxy requests to /api to the DACO API
				[API_PROXY_PATH]: {
					target: apiHost,
					changeOrigin: true,
					rewrite: (path) => path.replace(API_PROXY_PATH, ''),
				},
			},
		},
	});
};
