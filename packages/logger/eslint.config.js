module.exports = {
	env: {
		es6: true,
		node: true,
	},
	extends: [
		'eslint:recommended',
		'plugin:@typescript-eslint/recommended',
		'plugin:import/recommended',
		'plugin:import/typescript',
		'prettier',
	],
	parser: '@typescript-eslint/parser',
	parserOptions: {
		ecmaVersion: 'latest',
		extraFileExtensions: ['.json'],
		project: ['./tsconfig.json'],
	},
	plugins: ['@typescript-eslint', 'prettier', 'import'],
	root: true,
	rules: {
		'@typescript-eslint/no-empty-interface': [
			'warn',
			{
				allowSingleExtends: false,
			},
		],
		'@typescript-eslint/no-explicit-any': 'off',
		'import/first': ['warn', 'absolute-first'],
		'import/order': [
			'warn',
			{
				groups: ['builtin', 'external', 'internal', 'parent', 'sibling', 'index'],
				'newlines-between': 'always',
				warnOnUnassignedImports: true,
			},
		],
		'import/newline-after-import': 'warn',
		'prettier/prettier': [
			'warn',
			{
				printWidth: 100,
				semi: true,
				singleQuote: true,
				trailingComma: 'all',
				useTabs: true,
			},
		],
	},
	settings: {
		'import/parsers': {
			'@typescript-eslint/parser': ['.js', '.jsx', '.json', '.ts', '.tsx'],
		},
		'import/resolver': {
			typescript: {
				alwaysTryTypes: true, // always try to resolve types under `<root>@types` directory even it doesn't contain any source code, like `@types/unist`
				project: ['./tsconfig.json'],
			},
		},
		'import/internal-regex': '^@/',
	},
};
