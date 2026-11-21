# Moses Wisnu — Portfolio v2

Static portfolio site (no build step): an anime-style hero whose eyes follow the cursor, case studies with interactive prototype walkthroughs, and showcases for Bukmark and Pomeowdoro.

## Structure

- `index.html` — home (hero, works, apps, contact)
- `works/*.html` — one standalone page per case study
- `js/proto-data.js` — hotspot data for the interactive prototypes (coordinates in source-image pixels)
- `js/proto.js`, `js/lightbox.js`, `js/sections.js` — behaviour
- `css/` — styles for home (`sections.css`) and case studies (`case.css`)
- `images/`, `apps/` — screenshots and app assets

## Run locally

```bash
python -m http.server 5173
# open http://localhost:5173
```
