import { defineConfig } from 'vite';

// https://vitejs.dev/config/
export default defineConfig({
	build: {
		// generate .vite/manifest.json in outDir
		manifest: true,
		lib: {
			entry: './src/main.mts',
			name: 'pcql-daco-api',
		},
		rollupOptions: {
			input: './src/main.mts',
			external: ['express'],
			output: {
				globals: {
					express: 'express',
				},
			},
		},
	},
	plugins: [],
});
