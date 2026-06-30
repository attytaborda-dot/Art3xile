# Changelog

All notable changes to ART3XILE are tagged with [Semantic Versioning](https://semver.org/).

## [v1.0.0] — 2026-06-30

### Added
- JSON data layer (`data/portfolio.json`) for content CRUD without editing HTML
- Split assets: `assets/css/main.css`, `assets/js/app.js`
- SEO: favicon, canonical URL, JSON-LD, sitemap, robots.txt
- Custom 404 page
- Unified pulse/glow interaction system across galleries, CTAs, and panels
- Filter counts on illustration and concept art tabs
- Git version tags

### Changed
- Nav active state: high-contrast underline + border indicator (no background wash)
- Primary CTAs (`Explore the work`, `Send message`): dim at rest, glow on hover
- Skills and Education panels: matching hover with scale + pulse
- Social links, video clips, and availability dot: pulse effects on hover/rest
- Footer year updated to 2026

### Removed
- Monolithic inline CSS/JS from `index.html`
- Unrelated files from repository (ExcellAir logo, sandbox projects)
