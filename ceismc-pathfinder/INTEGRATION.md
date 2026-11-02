# CEISMC Pathfinder — integration into the existing GitHub Pages site

This adds an animated resource recommendation survey without changing existing site styles or pages. It is a **client-side experience**, not a live enrollment or registration system, and does not request or store personally identifying information.

## Add to the repository

1. Copy `resource-finder.css` and `resource-finder.js` into the same folder as the original site's `index.html` (or update the paths below if you use an assets folder).
2. Add this `<link>` inside the page's existing `<head>`:

```html
<link rel="stylesheet" href="./resource-finder.css">
```

3. Add this `<div>` in the original `index.html` where you want the interactive section to appear — ideally after the introduction or featured programs and before the footer:

```html
<section id="pathfinder" aria-label="Find CEISMC resources for you">
  <div id="ceismc-pathfinder"></div>
</section>
```

4. Add this script before the page's closing `</body>` tag:

```html
<script src="./resource-finder.js" defer></script>
```

5. Optionally add a menu item to the **existing** nav (change markup/classes to match your current nav):

```html
<a href="#pathfinder">Find your resources</a>
```

6. Commit and push to the site's GitHub Pages publishing branch, or follow your normal pull request workflow. Check the `Actions` tab for successful deployment.

## Preview locally

Open `resource-finder-demo.html` in a browser (or run `python3 -m http.server 8000` in this folder and visit http://localhost:8000/resource-finder-demo.html).

## Features

- Three pathways: students, teachers, and schools/districts.
- Student interests, growth focus, a casual age-appropriate warm-up, and learning-style discovery.
- Teacher/school grade level, subject, support goal and preferred format matching.
- A curated recommendation catalog linked to **actual CEISMC and Georgia Tech K-12 resources**.
- Animated transitions, responsive card UI, progress bar, reduced-motion support, keyboard-friendly controls, and a copyable results summary.
- No external JavaScript dependencies, account creation, backend, or analytics tracking.

## Notes

- Georgia Tech gold/navy palette was used as a **close approximation**. The original repository styling was inaccessible to this build. Modify the variables near the top of `resource-finder.css` for an exact match if needed.
- The widget is scoped under `#ceismc-pathfinder` to minimize CSS collisions.
- Links and broad eligibility information were checked against public GT CEISMC/K12 pages in October 2026. Dates, registration, costs and program offerings will change; confirm on the destination pages before promoting.
- The student warm-up is just one fun question per grade group. It does **not** claim to diagnose academic skills.
- The mini quiz is private and stays inside the browser; answers are not saved or sent to any service.
- If adding the component inside another site's HTML, be sure that the exact `id="ceismc-pathfinder"` appears only once on the page.
