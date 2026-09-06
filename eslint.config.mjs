import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
    // Standalone Node maintenance script — CommonJS on purpose.
    "deploy-rules.js",
  ]),
  {
    rules: {
      // Every hit is the same shape: an effect that kicks off a Firestore read
      // and sets loading/data state from the callback. That is the intended
      // pattern for this codebase, which has no data-fetching library. Keeping
      // it as a warning preserves the signal (these components opt out of React
      // Compiler memoisation) without failing the build on idiomatic code.
      "react-hooks/set-state-in-effect": "warn",
    },
  },
]);

export default eslintConfig;
