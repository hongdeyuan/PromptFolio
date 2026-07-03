# Promptfolio

Promptfolio is a React + TypeScript website for collecting, analyzing, and sharing excellent prompt case studies. The current demo uses the Lithos hero-section prompt as a featured example and shows how a high-quality prompt can be broken down into reusable structure, interaction details, acceptance criteria, and inspiration cards.

## Tech Stack

- React
- TypeScript
- Vite
- Tailwind CSS
- lucide-react
- i18next
- react-i18next
- i18next-browser-languagedetector
- i18next-scanner

## Getting Started

Install dependencies:

```bash
npm install
```

Start the development server:

```bash
npm run dev
```

Build for production:

```bash
npm run build
```

Preview the production build:

```bash
npm run preview
```

## Deployment

This project is configured for GitHub Pages with GitHub Actions.

On every push to `main`, `.github/workflows/deploy-pages.yml` will:

1. Install dependencies with `npm ci`
2. Build the app with `npm run build`
3. Upload `dist/` to GitHub Pages

In the GitHub repository settings, set Pages source to **GitHub Actions**. After the workflow succeeds, the site can be viewed at the repository's Pages URL, for example `https://<owner>.github.io/<repo>/` or `https://aiDesignCode.github.io/` if this is a user/organization Pages repository.

## Internationalization

Translations are managed with i18next and react-i18next.

Locale files live in:

```text
src/i18n/locales/zh/translation.json
src/i18n/locales/en/translation.json
```

The i18next setup is in:

```text
src/i18n/index.ts
```

Scan translation keys:

```bash
npm run i18n:scan
```

Language detection uses `i18next-browser-languagedetector` and stores the selected language in `localStorage`.

## Project Structure

```text
src/
  App.tsx
  main.tsx
  index.css
  i18n/
    index.ts
    locales/
      en/translation.json
      zh/translation.json
```

## Notes

- Section anchors use stable English IDs: `featured`, `anatomy`, `template`, and `library`.
- The current UI supports Chinese and English language switching.
- The Lithos prompt text is kept as a featured case example in `src/App.tsx`.
