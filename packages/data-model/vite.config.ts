import { defineConfig } from 'vite';

// https://vitejs.dev/config/
export default defineConfig({
	build: {
		// generate .vite/manifest.json in outDir
		manifest: true,
		lib: {
			entry: './src/main.mts',
			name: 'pcql-daco/data-model',
		},
	},
	plugins: [],
});
