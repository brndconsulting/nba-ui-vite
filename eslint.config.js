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
      // ===== P0: Unified no-restricted-syntax (all rules in one array) =====
      // This MUST be a single rule definition to avoid overwrites
      'no-restricted-syntax': [
        'error',
        // Rule 1: Prohibit hardcoded color classes (not shadcn tokens)
        {
          selector: 'Literal[value=/\\b(text|bg|border|ring|from|to|via)-(black|white|gray|slate|zinc|neutral|stone|orange|amber|lime|emerald|teal|cyan|sky|indigo|violet|purple|fuchsia|pink)(-\\d{2,3})?\\b/]',
          message: 'Hardcoded color classes are not allowed. Use Tailwind tokens (bg-background, text-foreground, border-border, text-muted-foreground, bg-accent, text-destructive, etc.) instead. Status colors (red-*, yellow-*, green-*) are allowed for semantic states.',
        },
        // Rule 2: Prohibit hardcoded color values (hex, rgb, hsl)
        {
          selector: 'Literal[value=/(#[0-9a-f]{3,6}|rgb\\(|hsl\\()/i]',
          message: 'Hardcoded color values (hex, rgb, hsl) are not allowed. Use CSS variables or Tailwind tokens instead.',
        },
        // Rule 3: Prohibit arbitrary typography values
        {
          selector: 'Literal[value=/\\b(text|leading|tracking)-\\[/]',
          message: 'Arbitrary typography values (text-[...], leading-[...], tracking-[...]) are not allowed. Use standard Tailwind classes: text-xs/sm/base/lg/xl/2xl, leading-none/tight/snug/normal/relaxed/loose, tracking-tighter/tight/normal/wide/wider/widest. See index.css @layer base for typography scale.',
        },
        // Rule 4: Prohibit inline style typography
        {
          selector: 'JSXAttribute[name.name="style"] > JSXExpressionContainer ObjectExpression Property[key.name=/fontSize|lineHeight|letterSpacing/]',
          message: 'Inline style typography (style={{ fontSize, lineHeight, letterSpacing }}) is not allowed. Use Tailwind classes instead. See index.css for typography utilities.',
        },
        // Rule 5: Prohibit dummy fallbacks (|| '0', || 'default', ?? 0, etc.)
        {
          selector: 'BinaryExpression[operator="||"] > Literal[value="0"]',
          message: 'Dummy fallback "0" is not allowed. Use proper error handling or empty states instead.',
        },
        {
          selector: 'BinaryExpression[operator="||"] > Literal[value="default"]',
          message: 'Dummy fallback "default" is not allowed. Use proper error handling or empty states instead.',
        },
        {
          selector: 'BinaryExpression[operator="??"] > Literal[value=0]',
          message: 'Dummy fallback 0 is not allowed. Use proper error handling or empty states instead.',
        },
        // Rule 6: Prohibit hardcoded IDs (like '77761')
        {
          selector: 'Literal[value=/^[0-9]{5,}$/]',
          message: 'Hardcoded numeric IDs are not allowed. Use context, props, or state instead. If this is a legitimate constant, add a comment explaining its purpose.',
        },
      ],

      // ===== P0: Prohibit inline styles =====
      'react/style-prop-object': 'error',

      // ===== P0: Prohibit external UI libraries =====
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
