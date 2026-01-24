// eslint.config.js
import js from '@eslint/js'
import globals from 'globals'
import pluginImport from 'eslint-plugin-import'
import pluginVue from 'eslint-plugin-vue'
import pluginVuetify from 'eslint-plugin-vuetify'
import { defineConfig } from 'eslint/config'
import vueParser from 'vue-eslint-parser'

export default defineConfig([
  // --- Global ignores -------------------------------------------------------
  {
    ignores: ['dev-dist/**', 'dist/**', 'node_modules/**']
  },

  // --- Base JavaScript + Node/Vite environment -----------------------------
  {
    files: ['src/**/*.{js,mjs,cjs,ts}', '*.config.js'],
    languageOptions: {
      globals: {
        ...globals.browser,
        ...globals.node // needed also in client code when accessing process.env.NODE_ENV during development
      },
      parserOptions: {
        ecmaVersion: 'latest',
        sourceType: 'module'
      }
    },
    plugins: {
      import: pluginImport
    },
    rules: {
      ...js.configs.recommended.rules,
      ...pluginImport.configs.recommended.rules,

      // --- StandardJS-style adjustments ---
      'no-unused-vars': ['warn', { 'argsIgnorePattern': '^_' }],
      'semi': ['error', 'never'],
      'quotes': ['error', 'single'],
      'comma-dangle': ['error', 'never'],
      'indent': ['error', 2],
      'no-multiple-empty-lines': ['error', { 'max': 1, 'maxEOF': 1 }],
      'no-console': 'off',
      'no-trailing-spaces': 'warn',

      // --- Fix import resolution issues ---
      'import/no-unresolved': 'off' // Disable since we're using Vite aliases
      // "import/namespace": "off", // Disable since we're using Vite aliases
      // "import/named": "off", // Disable since we're using Vite aliases
      // "import/no-duplicates": "off", // Disable since we're using Vite aliases

    }
  },

  // --- Vue 3 + Vuetify + Vite support -------------------------------------
  {
    files: ['src/**/*.vue'],
    languageOptions: {
      parser: vueParser,
      parserOptions: {
        // parser: espreeParser,
        ecmaVersion: 'latest',
        sourceType: 'module'
      },
      globals: globals.browser
    },
    plugins: {
      vue: pluginVue,
      vuetify: pluginVuetify
    },
    rules: {
      // Include JavaScript formatting rules for Vue files
      ...js.configs.recommended.rules,
      'no-unused-vars': ['warn', { 'argsIgnorePattern': '^_' }],
      'semi': ['error', 'never'],
      'quotes': ['error', 'single'],
      'comma-dangle': ['error', 'never'],
      'indent': ['error', 2],
      'no-multiple-empty-lines': ['error', { 'max': 1, 'maxEOF': 1 }],
      'no-console': 'off',
      'no-trailing-spaces': 'warn',

      // Vue-specific rules
      ...pluginVue.configs['flat/essential'].rules,
      ...pluginVuetify.configs.recommended.rules,
      'vue/multi-word-component-names': 'off',
      'vue/require-default-prop': 'off',
      'vue/valid-v-slot': 'off',

      // HTML Template Rules
      'vue/html-self-closing': [
        'error',
        {
          html: { void: 'always', normal: 'never', component: 'always' },
          svg: 'always',
          math: 'always'
        }
      ],
      'vue/html-indent': ['error', 2],
      'vue/html-quotes': ['error', 'double'],
      'vue/html-closing-bracket-newline': ['error', {
        'singleline': 'never',
        'multiline': 'always'
      }],
      'vue/html-closing-bracket-spacing': ['error', {
        'startTag': 'never',
        'endTag': 'never',
        'selfClosingTag': 'always'
      }],
      'vue/max-attributes-per-line': ['error', {
        'singleline': { 'max': 3 },
        'multiline': { 'max': 1 }
      }],
      'vue/first-attribute-linebreak': ['error', {
        'singleline': 'ignore',
        'multiline': 'below'
      }],
      'vue/html-button-has-type': 'error',
      'vue/html-comment-content-spacing': 'error',
      'vue/html-comment-indent': ['error', 2],
      'vue/no-spaces-around-equal-signs-in-attribute': 'error',
      'vue/no-template-key': 'error',
      'vue/no-textarea-mustache': 'error',
      'vue/require-component-is': 'error',
      'vue/require-v-for-key': 'error'
    }
  }

])
