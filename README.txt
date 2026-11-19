Ayaan Portfolio ESLint fix

Copy eslint.config.mjs into the project root, replacing the existing file.
This adds global ESLint ignores for Next.js generated output (.next), node_modules,
out/build/coverage, and next-env.d.ts. It does not change application source code.

Then run these commands from the project root, one at a time:
  npm run lint
  npm run typecheck
  npm run build

If any command still fails, share the output beginning at the first error.
