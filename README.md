# Portfolio

Personal portfolio built with Next.js App Router, Tailwind CSS v4, Framer Motion, and Notion as a CMS.

## Requirements

- Node.js 20+
- npm
- A Notion integration token
- A Notion database shared with that integration

## Setup

1. Install dependencies:

```bash
npm install
```

2. Create `.env.local` in the project root:

```bash
NOTION_API_KEY=secret_xxx
NOTION_DATABASE_ID=xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
```

3. Start the dev server:

```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000).

If env vars are missing or Notion is unreachable, the app renders an empty state instead of crashing.

## Notion schema guidance

The app is tolerant of property names and tries common aliases, but these fields are used when present:

- `Name` (title)
- `Type` or `Kind` (select)
- `Skills` (multi-select)
- `URL` or `Link` (url)
- `Location` or `Place` (text)
- `Date`/`Dates` (date), or separate `Start` + `End` date fields
- `Description` (text)
- Up to 3 image fields: `Image 1`, `Image 2`, `Image 3` (files/url)

## Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Run production server
- `npm run lint` - Run ESLint
