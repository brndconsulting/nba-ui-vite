import js from '@eslint/js';
import globals from 'globals';
import tsPlugin from '@typescript-eslint/eslint-plugin';
import tsParser from '@typescript-eslint/parser';
import reactPlugin from 'eslint-plugin-react';

export default [
  js.configs.recommended,
  {
    files: ['**/*.{ts,tsx,js,jsx}'],
    languageOptions: {
      parser: tsParser,
      parserOptions: {
        ecmaVersion: 2020,
        sourceType: 'module',
        ecmaFeatures: {
          jsx: true,
        },
      },
      globals: {
        ...globals.browser,
        ...globals.es2022,
        google: 'readonly', // Google Maps API
        React: 'readonly',
        JSX: 'readonly',
      },
    },
    plugins: {
      '@typescript-eslint': tsPlugin,
      react: reactPlugin,
    },
    rules: {
      // ===== P0: Prohibir colores literales (no tokens shadcn) =====
      'no-restricted-syntax': [
        'error',
        {
          selector: 'Literal[value=/\\b(text|bg|border|ring|from|to|via)-(black|white|gray|slate|zinc|neutral|stone|orange|amber|lime|emerald|teal|cyan|sky|indigo|violet|purple|fuchsia|pink)(-\\d{2,3})?\\b/]',
          message: 'Hardcoded color classes are not allowed. Use Tailwind tokens (bg-background, text-foreground, border-border, text-muted-foreground, bg-accent, text-destructive, etc.) instead. Status colors (red-*, yellow-*, green-*) are allowed for semantic states.',
        },
        {
          selector: 'Literal[value=/(#[0-9a-f]{3,6}|rgb\\(|hsl\\()/i]',
          message: 'Hardcoded color values (hex, rgb, hsl) are not allowed. Use CSS variables or Tailwind tokens instead.',
        },
      ],

      // ===== P0: Prohibir estilos inline Y tipografia inline =====
      'react/style-prop-object': 'error',
      
      // ===== P0: Prohibir valores de tipografia arbitrarios (text-[...], leading-[...], tracking-[...]) =====
      'no-restricted-syntax': [
        'error',
        {
          selector: 'Literal[value=/\b(text|leading|tracking)-\[/]',
          message: 'Arbitrary typography values (text-[...], leading-[...], tracking-[...]) are not allowed. Use standard Tailwind classes: text-xs/sm/base/lg/xl/2xl, leading-none/tight/snug/normal/relaxed/loose, tracking-tighter/tight/normal/wide/wider/widest. See index.css @layer base for typography scale.',
        },
        {
          selector: 'JSXAttribute[name.name="style"] > JSXExpressionContainer ObjectExpression Property[key.name=/fontSize|lineHeight|letterSpacing/]',
          message: 'Inline style typography (style={{ fontSize, lineHeight, letterSpacing }}) is not allowed. Use Tailwind classes instead. See index.css for typography utilities.',
        },
      ],

      // ===== P0: Prohibir imports de UI externas y colores literales =====
      'no-restricted-imports': [
        'error',
        {
          patterns: [
            {
              group: ['@mui/*', 'antd', '@chakra-ui/*', 'react-bootstrap', 'mantine'],
              message: 'External UI libraries are not allowed. Use shadcn/ui components from @/components/ui/* instead.',
            },
          ],
          paths: [
            {
              name: '@mui/material',
              message: 'MUI is not allowed. Use shadcn/ui instead.',
            },
            {
              name: 'antd',
              message: 'Ant Design is not allowed. Use shadcn/ui instead.',
            },
            {
              name: '@chakra-ui/react',
              message: 'Chakra UI is not allowed. Use shadcn/ui instead.',
            },
          ],
        },
      ],

      // ===== TypeScript =====
      '@typescript-eslint/no-unused-vars': [
        'error',
        {
          argsIgnorePattern: '^_',
          varsIgnorePattern: '^_',
          destructuredArrayIgnorePattern: '^_',
        },
      ],
      'no-unused-vars': 'off', // Disable base rule, use TS version
      '@typescript-eslint/explicit-function-return-types': 'off',
      '@typescript-eslint/no-explicit-any': 'warn',

      // ===== React =====
      'react/react-in-jsx-scope': 'off',
      'react/prop-types': 'off',
      'react/no-unescaped-entities': 'warn',
      'react/no-children-prop': 'error',
      'react/no-danger-with-children': 'error',
      'react/no-danger': 'warn',

      // ===== P0: Prevent dummy data (fallback numbers) =====
      'no-restricted-syntax': [
        'error',
        {
          selector: 'BinaryExpression[operator="||"] > Literal[value=/^(0|"0"|-|N\/A|--|"-")$/]',
          message: 'Dummy data fallback detected. Never use || 0, || "0", || "-", etc. for Yahoo-derived data. Use <Skeleton /> while loading, <EmptyState /> if no data, or <ErrorState /> if fetch failed.',
        },
        {
          selector: 'LogicalExpression[operator="??"] > Literal[value=/^(0|"0"|-|N\/A|--|"-")$/]',
          message: 'Dummy data fallback detected. Never use ?? 0, ?? "0", etc. for Yahoo-derived data. Use explicit state components instead.',
        },
      ],

      // ===== General =====
      'no-console': [
        'warn',
        {
          allow: ['warn', 'error'],
        },
      ],
      'no-debugger': 'error',
      'no-undef': 'warn', // Globals are now properly defined

      // ===== P0: Prevent hardcoded context/league defaults =====
      'no-restricted-syntax': [
        'error',
        {
          selector: 'Literal[value=/^(466\.1\.77761|777761|test-league|default-team|mock-)$/]',
          message: 'Hardcoded league/team IDs detected. These must come from context or props, never hardcoded. Use useContext(LeagueContext) or pass as props.',
        },
      ]
    },
  },

  // ===== Ignore patterns =====
  {
    ignores: [
      'node_modules/**',
      'dist/**',
      'build/**',
      '.next/**',
      'coverage/**',
      '**/*.config.js',
      '**/*.config.ts',
      'vite.config.ts',
      'tailwind.config.ts',
    ],
  },
];
