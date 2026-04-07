# Komal Portfolio (React + Vite)

Main app code lives in `src/App.jsx` (your original `.txt` file was converted to this React component file).

## Development

1. Install dependencies:
   ```bash
   npm install
   ```
2. Start dev server:
   ```bash
   npm run dev
   ```
3. Open the local URL shown in terminal (usually `http://localhost:5173`).

## Production Build

```bash
npm run build
```

This creates a `dist/` folder ready for static hosting.

## Hosting Options

### Vercel
- Import this folder as a project in Vercel.
- Framework preset: `Vite`.
- Build command: `npm run build`.
- Output directory: `dist`.

### Netlify
- New site from Git (or drag/drop `dist/` after build).
- Build command: `npm run build`.
- Publish directory: `dist`.

### Any Static Host
- Run `npm run build`.
- Upload the `dist/` folder contents.
