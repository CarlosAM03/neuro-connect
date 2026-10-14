import eslint from '@eslint/js';
import tseslint from 'typescript-eslint';
export default tseslint.config(
  { ignores: ['dist/**', 'coverage/**', 'node_modules/**'] },
  { files: ['**/*.ts'], extends: [eslint.configs.recommended, ...tseslint.configs.recommended], rules: { '@typescript-eslint/no-explicit-any': 'error' } },
  { files: ['**/*.cjs'], extends: [eslint.configs.recommended], languageOptions: { sourceType: 'commonjs', globals: { process: 'readonly', console: 'readonly', URL: 'readonly' } } },
);
