# Deploy guide — GitHub Pages with custom domain

Step-by-step walkthrough to take this repo from your laptop to a live, statically-hosted site at `https://mteke.com/`.

> Assumes a working local copy where `npm run build` succeeds.

## 1. Create the GitHub repo

From the project folder:

```bash
git init
git branch -M main
git add .
git commit -m "chore: initial commit"
```

Then on github.com → "New repository":

- Name: `mteke.com`
- Owner: `melihteke`
- Visibility: Public (Pages on a free account requires public, or Pro for private)
- **Don't** initialize with README/.gitignore/license — your local repo already has them

Push it:

```bash
git remote add origin https://github.com/melihteke/mteke.com.git
git push -u origin main
```

> **Repo name note.** Pages does not require the repo to be named
> `<username>.github.io`. Any public repo works as long as you enable Pages
> in Settings.

## 2. Enable GitHub Pages

In the repo → **Settings → Pages**:

- **Source**: `GitHub Actions`
- (Leave "Branch" blank — we use Actions, not branch deploys.)

That's it for the Pages config. The actual build is driven by `.github/workflows/deploy.yml`, which is already in the repo and runs on every push to `main`.

## 3. First deploy

Push something (or trigger the workflow from the Actions tab):

```bash
git commit --allow-empty -m "deploy: trigger first build"
git push
```

In the **Actions** tab you should see the `Deploy to GitHub Pages` workflow run. Two jobs:

1. **build** — runs `npm ci`, `npm run build` (which calls `next build` and then `pagefind --site out`), uploads `out/` as the Pages artifact.
2. **deploy** — publishes the artifact to Pages.

When both jobs are green, your site is live at `https://melihteke.github.io/mteke.com/`.

> If a job fails:
> - **Build error in MDX** → open the failing post, fix it locally, push again. Posts that genuinely won't compile are skipped at build with a `[posts] skipping ...` warning.
> - **Permissions error during deploy** → confirm Settings → Actions → General → "Workflow permissions" is set to **Read and write permissions**.

## 4. Custom domain (`www.mteke.com`)

The site is canonical at `www.mteke.com`; the apex (`mteke.com`) redirects to it automatically.

### 4a. Add the CNAME to the repo

`public/CNAME` contains `www.mteke.com`. Verify it's still there after build (`out/CNAME` exists). Pages reads this file to know which domain to serve.

### 4b. Tell GitHub the domain

Settings → Pages → **Custom domain**: type `www.mteke.com`, click **Save**. GitHub starts a DNS check.

### 4c. Configure DNS at your registrar

**`www` — `CNAME` to GitHub Pages:**

```
www.mteke.com  CNAME  melihteke.github.io
```

**Apex `mteke.com` — four `A` records (GitHub redirects apex → `www`):**

```
mteke.com  A  185.199.108.153
mteke.com  A  185.199.109.153
mteke.com  A  185.199.110.153
mteke.com  A  185.199.111.153
```

(If your DNS provider supports `ALIAS`/`ANAME` to a hostname, point the apex at `melihteke.github.io` instead — preferable but optional.)

DNS propagation usually takes 5–30 minutes. Check progress with:

```bash
dig www.mteke.com +short
dig mteke.com +short
```

### 4d. Enforce HTTPS

Once GitHub finishes the domain check (the warning under Pages disappears), the **Enforce HTTPS** checkbox unlocks. Tick it. GitHub provisions a Let's Encrypt cert automatically.

## 5. Verify

| Check | URL / command |
| ----- | ------------- |
| Site loads | `https://www.mteke.com/` |
| Apex redirects to `www` | `https://mteke.com/` → `https://www.mteke.com/` |
| HTTPS cert is valid | browser padlock; or `curl -I https://www.mteke.com` |
| RSS feed | `https://www.mteke.com/rss.xml` |
| Sitemap | `https://www.mteke.com/sitemap.xml` |
| Search | open `/blog`, type — both grid filtering (always) and Pagefind dropdown (production only) |

## 6. Day-to-day workflow

1. Write a post locally (`npm run new-post "..."`)
2. `npm run dev` to preview
3. `git add . && git commit -m "post: <slug>" && git push`
4. GitHub Actions rebuilds and deploys; refresh the live site in 1–2 minutes

## Troubleshooting

| Symptom | Likely cause | Fix |
| ------- | ------------ | --- |
| Custom domain check stuck on "DNS check in progress" | Records not propagated yet | Wait, then click "Re-check" in Pages settings |
| `404` for sub-pages but `/` works | Trailing slashes / static export issue | Confirm `next.config.mjs` has `output: 'export'` and `trailingSlash: true` |
| Images broken on production | Files not under `content/blog/<slug>/` next to `index.mdx` | Move them next to the post; `predev`/`prebuild` copies them to `public/blog/<slug>/` |
| Search dropdown empty | Pagefind index missing | Run `npm run build` (it triggers `pagefind --site out`); check `out/pagefind/` exists |
| "Pages" build fails on permissions | Workflow can't write Pages artifact | Settings → Actions → General → Workflow permissions: **Read and write** |
| Site updates but theme toggle does nothing on user's browser | Stale `localStorage` from an earlier site | The toggle auto-heals unknown values to the default theme; users may need to hard-refresh (Ctrl+Shift+R) once |

## What ships in `out/`

After `npm run build`, the `out/` folder contains:

```
out/
├── CNAME                   # custom domain
├── index.html              # /
├── about/index.html
├── projects/index.html
├── blog/index.html
├── blog/<slug>/index.html  # one per published post
├── tags/<tag>/index.html
├── rss.xml
├── sitemap.xml
├── robots.txt
├── _next/                  # JS/CSS chunks
├── pagefind/               # full-text search index (built by pagefind step)
└── blog/<slug>/<image>     # post images (copied from content/)
```

That entire tree is what GitHub Pages serves. Nothing on it requires a Node runtime.
