# Authoring guide

Everything you need to write a new post on mteke.com — file layout, frontmatter, every available MDX component, and how to embed third-party content.

## TL;DR

```bash
npm run new-post "How I tamed my home lab"
# → creates content/blog/how-i-tamed-my-home-lab/index.mdx
```

Open the new file, write your post, drop any images alongside it, then:

```bash
git add . && git commit -m "post: how-i-tamed-my-home-lab" && git push
```

GitHub Actions builds and deploys to Pages in 1–2 minutes.

---

## File layout

```
content/blog/
└── my-post-slug/
    ├── index.mdx        # frontmatter + body
    ├── cover.png        # used as <PostCard> + Open Graph image
    ├── diagram.svg      # any inline media goes next to the post
    └── photo.jpg
```

The slug is the URL: `mteke.com/blog/my-post-slug/`. Use lowercase, hyphens, no spaces.

Images in the post folder are copied to `public/blog/<slug>/` automatically by the `predev` / `prebuild` hook. So in MDX you reference them as **relative paths** and they Just Work:

```mdx
![Network topology](./diagram.svg)
```

## Frontmatter

```yaml
---
title: "The headline of the post"
description: "1–2 sentence summary used by Google + social previews"
publishDate: 2026-04-26     # YYYY-MM-DD
updatedDate: 2026-05-03     # optional — only set if you actually edited it
tags: [python, network, automation]
cover: ./cover.png          # optional — also becomes the OG image
draft: false                # set true to hide from build/listings
---
```

| Field | Required | Notes |
| ----- | -------- | ----- |
| `title` | yes | Plain text. Avoid markdown here. |
| `description` | recommended | Used in `<meta>` description, Twitter / OG cards, list page card |
| `publishDate` | yes | Sort key for the blog list, RSS feed, sitemap |
| `updatedDate` | no | Shown on the post if it differs from `publishDate` |
| `tags` | no | Lowercase strings; each becomes a `/tags/<tag>/` page |
| `cover` | no | Relative path; renders at the top of the post and on cards |
| `draft` | no | `true` → omitted from `getAllPosts()` and not built |

---

## Body — Markdown + MDX

Standard GitHub-flavored Markdown works (headings, lists, tables, blockquotes, fenced code, task lists, etc.). On top of that you can use the React components below — just write the JSX inline.

### Callouts (Ghost-style boxes)

```mdx
<Callout type="info" title="Heads up">
  Five types: `info`, `success`, `warning`, `danger`, `tip` — each with its own
  color and icon.
</Callout>
```

| `type` | Color |
| ------ | ----- |
| `info` | sky |
| `success` | emerald |
| `warning` | amber |
| `danger` | rose |
| `tip` | violet |

The `title` prop is optional.

### YouTube — with click-to-play thumbnail

```mdx
<YouTube id="dQw4w9WgXcQ" title="Demo video" />

{/* 60% width, centered, start 30s in */}
<YouTube id="dQw4w9WgXcQ" width="60%" align="center" start={30} />
```

Props:
- `id` — the part after `?v=` in a YouTube URL
- `title` — accessible label (defaults to "YouTube video")
- `width` — CSS width (`"60%"`, `480`, `"320px"`); omit for full width
- `align` — `"left" | "center" | "right"` (default `center`)
- `start` — start offset in seconds

The component shows a poster image (`i.ytimg.com/vi/<id>/hqdefault.jpg`) with a play button. Clicking swaps in the actual iframe — keeps the page fast.

### GitHub repository card

```mdx
<GitHubRepo
  repo="vercel/next.js"
  description="The React framework for the Web."
  language="TypeScript"
  stars="125k"
/>
```

Props:
- `repo` — `"<owner>/<name>"` (required)
- `description`, `language`, `stars` — optional, all displayed if provided

You can also drop a plain GitHub URL inline — the prose styling automatically renders it as a rounded GitHub chip:

```mdx
Source available on [https://github.com/melihteke/mteke.com](https://github.com/melihteke/mteke.com).
```

### PyPI package card

```mdx
<PyPI
  pkg="wtisdk"
  description="A Pythonic API wrapper for Western Telematic console servers and PDUs."
  version="0.3.1"
  python="Python 3.8+"
/>
```

Props:
- `pkg` — the PyPI package name (required). Card links to `https://pypi.org/project/<pkg>/`.
- `description` — one-line summary, optional.
- `version` — display the current version, optional.
- `python` — Python version requirement label, optional.

### Spotify — track / album / playlist / podcast episode

```mdx
<Spotify type="track"    id="11dFghVXANMlKmJXsNCbNl" />
<Spotify type="album"    id="1DFixLWuPkv3KT3TnV35m3" />
<Spotify type="playlist" id="37i9dQZF1DXcBWIGoYBM5M" />
<Spotify type="episode"  id="0Q86acNRm6V9GYx55SXKwf" />
<Spotify type="show"     id="0ofXAdFIQQRsCYj9754UFx" />
<Spotify type="artist"   id="6eUKZXaKkcviH0Ku9w2n3V" />
```

Props:
- `type` — one of `track | album | playlist | episode | show | artist` (default `track`)
- `id` — the Spotify ID (the part after the type in a Spotify URL)
- `height` — px, optional. Defaults: 152 for tracks/episodes, 380 for everything else
- `theme` — `0` (brand color, default) or `1` (dark)

Where to find the ID: open the item in Spotify → Share → Copy link. URL looks like `open.spotify.com/track/11dFghVXANMlKmJXsNCbNl?si=...`. The ID is `11dFghVXANMlKmJXsNCbNl`.

### Podcast embeds (Apple, RSS, etc.)

```mdx
{/* Apple Podcasts — paste the page URL, the component upgrades it to an embed */}
<Podcast
  provider="apple"
  src="https://podcasts.apple.com/us/podcast/the-changelog/id341623264"
  title="The Changelog"
/>

{/* Any provider that gives you an embeddable iframe URL */}
<Podcast
  src="https://embed.podcasts.apple.com/us/podcast/the-changelog/id341623264?theme=auto"
  title="Changelog"
  height={175}
/>
```

Props:
- `src` — the iframe URL (or, for Apple, the regular page URL — it gets upgraded automatically)
- `provider` — `"apple" | "overcast" | "youtube" | "rss"` (used for Apple URL upgrading)
- `title` — shown in the header bar above the embed
- `height` — px, default 175

### Figures (captioned images)

```mdx
<Figure
  src="./topology.svg"
  alt="Lab network topology"
  caption="Figure 1 — physical wiring of the lab"
  width={800}
/>
```

For simple inline images you don't need `<Figure>` — just plain Markdown:

```mdx
![alt text](./screenshot.png)
```

---

## Code blocks

The site uses **Shiki** (via `rehype-pretty-code`) for syntax highlighting. Three site-wide themes track the current page theme automatically:

- **Light** → `github-light`
- **Dark** → `github-dark-dimmed`
- **Navy** → `github-dark`

### Default usage

````mdx
```python
def greet(name: str) -> str:
    return f"Hello, {name}!"
```
````

### Title, line numbers, line/range highlights

````mdx
```python title="automation.py" {3,5-7} showLineNumbers
from netmiko import ConnectHandler

def add(a: int, b: int) -> int:
    return a + b

def connect(host: str) -> ConnectHandler:
    """Open an SSH session to a Cisco device."""
    return ConnectHandler(device_type="cisco_ios", host=host)
```
````

- `title="automation.py"` — file name shown above the block
- `{3,5-7}` — highlight line 3 and lines 5 through 7
- `showLineNumbers` — show line numbers in the gutter
- `{/^def /}` — highlight every line matching a regex
- `\`code{:py}\`` — inline syntax-highlighted snippets

### Per-block alternate themes

If you want a single block to look different — say, you want a Dracula-pink Python snippet next to a default block — add a `style="…"` token to the fence:

````mdx
```python title="dracula.py" style="dracula"
def greet(name: str) -> str:
    return f"Hello, {name}!"
```
````

Available values: `dracula`, `nord`, `solarized`, `monokai`.

### Adding more highlight themes

`src/lib/mdx.tsx` → `prettyCodeOptions.theme` — add another entry (any [Shiki theme name](https://shiki.style/themes)) and a matching CSS override in `src/app/globals.css` under the `figure[data-code-style="…"]` rules.

---

## Drafts

Set `draft: true` and the post is excluded from:

- the `/blog` list
- the home page "latest" rail
- RSS, sitemap, and tag pages

It still renders if you visit `/blog/<slug>/` directly during `npm run dev`. To preview a draft on a deployed branch, set `INCLUDE_DRAFTS=1` and pass `includeDrafts: true` in `getAllPosts()` (currently used only for tooling).

## Common pitfalls

- **Typecheck fails because you wrote `{` in prose.** MDX treats `{` as the start of a JS expression. Escape it: `\{`. Or wrap the line in inline code: `` `like this {value}` ``.
- **`<` followed by a non-letter.** MDX thinks you're starting a JSX tag. Same fix — wrap in inline code or escape: `\<`.
- **A migrated Ghost post errors at build.** It's skipped automatically with a console warning; open that post and tidy up the offending content (typically raw HTML/CSS/JS pasted as text).
- **Image doesn't render on the production site.** Confirm the file sits next to `index.mdx`, and the path uses `./image.png` (relative). Absolute paths under `/blog/<slug>/...` also work.

## Useful local commands

```bash
npm run dev               # local dev server with hot reload
npm run build             # full production build (next export + pagefind)
npm run start             # serve out/ at :3000 to test the static build
npm run new-post "Title"  # scaffold a new post
npm run migrate -- ...    # one-shot Ghost JSON → MDX migration
```
