import { defineConfig } from 'eslint/config';
import tseslint from 'typescript-eslint';
import prettierConfig from 'eslint-config-prettier';
import prettierPlugin from 'eslint-plugin-prettier';
import globals from 'globals';

export default defineConfig([
	...tseslint.configs.recommended,
	prettierConfig,
	{
		files: ['**/*.ts'],
		ignores: ['dist/', 'build/', 'node_modules/', 'coverage/'],
		languageOptions: {
			parser: tseslint.parser,
			globals: {
				...globals.node,
			},
			parserOptions: {
				project: ['tsconfig.json'],
			},
		},
		plugins: {
			'@typescript-eslint': tseslint.plugin,
			prettier: prettierPlugin,
		},
		rules: {
			...prettierPlugin.configs.recommended.rules,
			...prettierConfig.rules,
			'@typescript-eslint/ban-types': 'off',
			'@typescript-eslint/no-unused-vars': 'off',
			'@typescript-eslint/no-explicit-any': 'off',
			'@typescript-eslint/explicit-function-return-type': 'off',
			'@typescript-eslint/no-empty-object-type': 'off',
			'prettier/prettier': [
				'error',
				{
					singleQuote: true,
					useTabs: true,
					semi: true,
					trailingComma: 'all',
					bracketSpacing: true,
					printWidth: 100,
					endOfLine: 'auto',
				},
			],
		},
	},
]);
