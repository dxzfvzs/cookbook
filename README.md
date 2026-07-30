# React + TypeScript + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) (or [oxc](https://oxc.rs) when used in [rolldown-vite](https://vite.dev/guide/rolldown)) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type-aware lint rules:

```js
export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...

      // Remove tseslint.configs.recommended and replace with this
      tseslint.configs.recommendedTypeChecked,
      // Alternatively, use this for stricter rules
      tseslint.configs.strictTypeChecked,
      // Optionally, add this for stylistic rules
      tseslint.configs.stylisticTypeChecked,

      // Other configs...
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```

You can also install [eslint-plugin-react-x](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-x) and [eslint-plugin-react-dom](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-dom) for React-specific lint rules:

```js
// eslint.config.js
import reactX from 'eslint-plugin-react-x'
import reactDom from 'eslint-plugin-react-dom'

export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...
      // Enable lint rules for React
      reactX.configs['recommended-typescript'],
      // Enable lint rules for React DOM
      reactDom.configs.recommended,
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```

## Custom font (`tools/font-builder.py`)

`tools/font-builder.py` builds `tools/dxzfvzs.ttf` from a hand-drawn glyph sheet (`tools/dxzfvzs-font.svg`), a single SVG where each character is drawn in its own cell of a fixed grid.

### Prerequisites

- [FontForge](https://fontforge.org/) installed (provides `ffpython`, a Python interpreter bundled with the `fontforge` module — see "How it works" below for why the regular system Python can't run this script)

### Build

From the `tools` directory, run the script with FontForge's bundled Python interpreter (not your system `python`):

PowerShell:

```powershell
cd tools
& "C:\Program Files\FontForgeBuilds\bin\ffpython.exe" font-builder.py
```

cmd.exe:

```
cd tools
"C:\Program Files\FontForgeBuilds\bin\ffpython.exe" font-builder.py
```

(adjust the path if FontForge is installed elsewhere). This regenerates `tools/dxzfvzs.ttf` — copy it to `public/fonts/dxzfvzs.ttf` (where `@font-face` in `src/styles/global.css` loads it from) to see changes on the site.

### How it works

- `fontforge` is a compiled C extension module linked directly against FontForge's own C library (`libfontforge`) and its dependencies (Cairo, Pango, GLib, etc.). It isn't published on PyPI and can't be `pip install`ed — it only exists as the specific build FontForge ships, tied to the exact Python version/ABI it was compiled against. That's why FontForge bundles its own interpreter (`ffpython`) with the module and all its native DLLs already wired up, and why the script has to run through that interpreter instead of a normal Python install.
- The source SVG is a flat sheet of `<path>` elements exported from Illustrator with no grouping or labels — Illustrator doesn't know which strokes belong to which letter. The script figures that out itself: it parses each path's `d` attribute (a small hand-written interpreter for the `M`/`L`/`C`/`c` commands actually used in the export), computes each path's centroid, and buckets it into whichever fixed-size grid cell (`CELL = 128` units) that centroid falls into. `LAYOUT` maps each (row, column) cell to the character it represents.
- For each character, the paths assigned to its cell are translated so the cell's origin becomes local `(0, 0)`, and written out as a small standalone SVG containing just that glyph's strokes. This is then imported into a fresh FontForge glyph (`importOutlines`).
- Hand-drawn/brush strokes often expand into several overlapping path fragments per letter (Illustrator's brush expansion), so `removeOverlap` welds them into one clean outline and `correctDirection` fixes winding order (so counters/holes, like the inside of an "A" or "O", render as holes rather than solid fill).
- Each glyph is then scaled up around the baseline (`GLYPH_SCALE`) — the hand-drawn letters only fill a small fraction of their grid cell vertically, so without this they render tiny at normal font-sizes. Its bounding box is then used to normalize its left margin and set an advance width proportional to its actual ink width (`LEFT_BEARING`/`RIGHT_BEARING`), instead of every character getting the same fixed spacing.
- The line-height metrics (`hhea`/`OS2` ascent & descent) are grown by the same `GLYPH_SCALE` factor so the enlarged glyphs don't get clipped. These are set directly rather than through `font.ascent`/`font.descent`, since those trigger FontForge to rescale the entire font (retargeting `font.em` to `ascent + descent`), which would silently undo the per-glyph scaling above. They're also set with their `_add` flags turned off, since those default to *adding* your value on top of FontForge's own auto-computed metrics rather than replacing them.
- Finally `font.generate()` serializes all glyphs and metrics into an actual `.ttf` binary.
