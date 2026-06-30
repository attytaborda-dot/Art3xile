# ART3XILE

Personal art portfolio of **José Antonio Taborda Morán** — character design, illustration, concept art, and animation.

**Live site:** [ja-tm.github.io/Art3xile](https://ja-tm.github.io/Art3xile/)  
**Current version:** `v1.0.0`

## Project structure

```
Art3xile/
├── index.html              # Page shell (HTML only)
├── data/
│   └── portfolio.json      # All gallery & project data (CRUD source)
├── assets/
│   ├── css/main.css        # Styles
│   ├── js/app.js           # Rendering & interactions
│   └── favicon.svg
├── 404.html
└── robots.txt / sitemap.xml
```

## Updating content (CRUD workflow)

All portfolio pieces live in **`data/portfolio.json`**. Edit this file to add, update, or remove work — no need to touch HTML.

### Add an illustration

```json
{
  "src": "https://cdna.artstation.com/.../large/your-image.jpg",
  "title": "Piece Title",
  "tag": "Scene illustration",
  "cat": "OC",
  "published": true,
  "order": 8
}
```

Add the object to the `illustrations` array. Filter tabs are built automatically from `cat` values.

### Add a concept art project

Add an object to `conceptProjects` with `id`, `title`, `kicker`, `role`, `cat`, `brief`, `cover`, and `images[]`.

### Feature a project on the home grid

Add `{ "type": "project", "id": "your-project-id" }` to the `featured` array.

### Hide a piece without deleting it

Set `"published": false` on any item.

## Local development

GitHub Pages serves static files. To preview locally with `fetch()` working:

```bash
python3 -m http.server 8080
# open http://localhost:8080
```

## Deploy

Push to `main` on GitHub — GitHub Pages updates automatically.

## Versioning

This project uses [Semantic Versioning](https://semver.org/) via Git tags.

| Tag | Description |
|-----|-------------|
| `v1.0.0` | First structured release — JSON data layer, split assets, pulse UX system |

### Release workflow

```bash
# After merging changes to main:
git tag -a v1.1.0 -m "Short description of what changed"
git push origin main
git push origin v1.1.0
```

**When to bump:**
- `v1.x.0` — new features (new section, CMS field, major UI)
- `v1.0.x` — content updates, bug fixes, small CSS tweaks

List tags: `git tag -l`

## Stack

- Static HTML / CSS / JavaScript
- JSON data layer (no build step)
- Formspree (contact form)
- ArtStation CDN (images)
- GitHub Pages (hosting)
