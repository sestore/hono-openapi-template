import js from "@eslint/js";
import prettier from "eslint-config-prettier";
import perfectionist from "eslint-plugin-perfectionist";
import unicorn from "eslint-plugin-unicorn";
import tseslint from "typescript-eslint";

export default [
  js.configs.recommended,
  ...tseslint.configs.recommended,
  prettier,
  {
    ignores: [
      "node_modules/*",
      "dist/*",
      "src/db/migrations/*",
      "pnpm-lock.yaml",
      "worker-configuration.d.ts",
    ],
    plugins: {
      perfectionist,
      unicorn,
    },
    rules: {
      // Sorting
      "perfectionist/sort-imports": "error",

      // File naming
      "unicorn/filename-case": [
        "error",
        {
          case: "kebabCase",
          ignore: ["README.md"],
        },
      ],

      // Console warnings
      "no-console": "warn",

      // TypeScript
      "@typescript-eslint/no-unused-vars": "warn",
      "@typescript-eslint/no-explicit-any": "warn",
    },
  },
];
