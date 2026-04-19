# Terminal Portfolio

A developer portfolio built with Next.js, styled with a terminal/hacker aesthetic. Content is powered by Notion as a CMS.

## Stack

- **Framework**: Next.js (App Router)
- **Styling**: Tailwind CSS v4
- **CMS**: Notion API
- **Fonts**: Self-hosted via `next/font` — JetBrains Mono, Space Grotesk, Material Symbols Outlined
- **Analytics**: Vercel Analytics + Speed Insights
- **Deployment**: Vercel

## Setup

### 1. Clone and install

```bash
git clone <your-repo>
cd portfolio
bun install
```

### 2. Configure your identity

All personal data lives in `config/site.ts` — update it with your name, role, socials, and other info before running.

### 3. Set up Notion

This project uses Notion as a CMS for blog posts and projects.

**Create two Notion databases:**

| Database | Purpose |
|----------|---------|
| Blog | Articles / posts |
| Projects | Portfolio projects |

**Required Notion database properties:**

Blog DB:
- `Title` (title)
- `Slug` (rich text)
- `Published` (checkbox)
- `Date` (date)
- `Tags` (multi-select)
- `Excerpt` (rich text)
- `Cover` (files & media or URL)

Projects DB:
- `Title` (title)
- `Slug` (rich text)
- `Description` (rich text)
- `Status` (select: `online` / `offline` / `archived`)
- `Tags` (multi-select)
- `GithubRepos` (rich text — JSON array: `[{"label":"web","url":"https://github.com/..."}]`)
- `LiveUrl` (url)

**Create a Notion integration:**

1. Go to [notion.so/my-integrations](https://www.notion.so/my-integrations)
2. Create a new integration and copy the token
3. Share both databases with the integration

### 4. Environment variables

Create a `.env.local` file:

```env
NOTION_TOKEN=secret_...
NOTION_BLOG_DB_ID=...
NOTION_PROJECTS_DB_ID=...
```

### 5. Run

```bash
bun dev
```

Open [http://localhost:3000](http://localhost:3000).

## Vercel Analytics & Speed Insights

Analytics and performance monitoring are set up via `@vercel/analytics` and `@vercel/speed-insights`. These activate automatically on Vercel deployments — no extra configuration needed. They are no-ops in local development.

## Deployment

Deploy to Vercel and add the three environment variables (`NOTION_TOKEN`, `NOTION_BLOG_DB_ID`, `NOTION_PROJECTS_DB_ID`) in the project settings.

```bash
vercel deploy
```
