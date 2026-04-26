# mteke.com

Personal site of **Melih Teke** — built with **Next.js (App Router) + MDX + Tailwind v4**, statically exported to **GitHub Pages**.

- Posts live under `content/blog/<slug>/index.mdx`
- Cover and inline images sit in the same folder; the `predev` / `prebuild` hook copies them to `public/blog/<slug>/`
- Push → GitHub Actions → Pages → live in 1–2 minutes

## Quickstart

```bash
npm install
npm run dev          # http://localhost:3000

npm run build        # production export → out/ (+ Pagefind index)
npm run start        # serves out/ on :3000 to preview the static build
```

## Authoring & deploying

Two focused guides live under `docs/`:

| Guide | What it covers |
| ----- | -------------- |
| [docs/AUTHORING.md](docs/AUTHORING.md) | Write a new post, frontmatter, every MDX component (Callout, YouTube, GitHubRepo, Spotify, Podcast, Figure), code highlighting, images, drafts |
| [docs/DEPLOY.md](docs/DEPLOY.md) | Push the repo to GitHub, enable Pages, point a custom domain, DNS records, troubleshooting |

For a one-line summary:

```bash
npm run new-post "Your post title"
# write content/blog/<slug>/index.mdx, drop images next to it
git add . && git commit -m "post: <slug>" && git push
```

## Where to change things

| What | Where |
| ---- | ----- |
| Color palettes (light / dark / navy) | `src/app/globals.css` — `:root`, `.dark`, `.navy` blocks |
| Site name, domain, author | `src/lib/site.ts` |
| Social links | `src/lib/social.ts` |
| Header nav | `src/components/header.tsx` |
| Projects shown on /projects | `src/app/projects/page.tsx` (the `projects` array) |
| Add a new MDX component | `src/components/mdx/<name>.tsx` + register in `mdx/index.ts` |

## Migrating from Ghost (one-shot)

```bash
# Ghost Admin → Settings → Labs → Export content (downloads a JSON file)
# Save it at the project root as ghost-export.json, then:

npm run migrate -- --ghost-url=https://your-ghost-host.example.com
```

Posts that fail to compile after migration (raw `<script>`, inline CSS, etc.)
are skipped at build time with a `[posts] skipping "<slug>"` warning — open
those `index.mdx` files and tidy them up by hand.

## License

Site content © Melih Teke. Code is MIT.
