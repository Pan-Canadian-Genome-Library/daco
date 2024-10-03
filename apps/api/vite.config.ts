import { defineConfig } from 'vite';

// https://vitejs.dev/config/
export default defineConfig({
	build: {
		// generate .vite/manifest.json in outDir
		manifest: true,
		lib: {
			entry: './src/main.ts',
			name: 'pcql-daco-api',
			formats: ['es', 'umd'],
		},
		rollupOptions: {
			input: './src/main.ts',
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
