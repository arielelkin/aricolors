# aricolors

Tiny palette package exporting the Alvaro Barril color set.

## Setup
- Install deps: `npm install`
- Run tests: `npm test`

## Build
- `npm run build` generates `dist/alvarobarril.js` and `dist/alvarobarril.d.ts`
- `dist` is checked in; commit the updated files after every build.

## Release and verification
- Confirm package version matches the intended git tag: `node -p "require('./package.json').version"` should equal `vX.Y.Z` tag you create.
- Build and ensure `dist` matches the source: run `npm run build` then `git diff --stat dist` (should be clean).
- Verify tests: `npm test`
- If everything is clean, commit and tag the release: `git tag vX.Y.Z`

## Use from GitHub (no npm package)
- Add the repo as a Git dependency (pulling the published `dist` files):
  ```jsonc
  // package.json
  {
    "dependencies": {
      "aricolors": "git+https://github.com/arielelkin/aricolors.git#v0.1.0"
    }
  }
  ```
  Update the tag/commit as needed.
- Import in CommonJS:
  ```js
  const { alvarobarrilColors } = require("aricolors");
  ```
- Import in ESM/TypeScript:
  ```ts
  import { alvarobarrilColors, type Color } from "aricolors";
  ```
