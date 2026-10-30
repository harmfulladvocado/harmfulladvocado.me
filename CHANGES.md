# Changelog

## 2.0.0 - 2026-10-29

### Added

- React 19 and TypeScript application shell with a component-based layout.
- Custom esbuild build and watch pipeline with a browser-sync development server.
- JSON-driven content for site metadata, hero copy, about text, projects, skills, socials, and navigation.
- Dark and light themes with system preference detection, local storage persistence, an anti-flash inline script, and synchronized theme-color metadata.
- Dynamic age calculation from a single birthday value.
- Accessible header with a skip link, focus styles, mobile menu, and active section tracking.
- Scroll reveal animations with reduced motion support.
- Project list with configurable actions.
- Animated skill bars with configurable hours and percentages.
- Client-side not found page for unknown paths, also written to `404.html`.
- SEO and agent files including `robots.txt`, `sitemap.xml`, `llms.txt`, and a web manifest.
- Vitest, happy-dom, and Testing Library test suite covering age calculation, rendering, navigation, theming, and the not found page.
- Responsive CSS organized with BEM, theme tokens, and reduced motion support.
- GitHub Actions deploy workflow that typechecks, tests, builds, and publishes `dist` to GitHub Pages.
- C++ skill entry with 80 hours and a 35 percent bar.

### Changed

- Removed glow effects, hover lighting, and the active navigation highlight across the interface.
- Replaced the multicolor gradient heading and not found text with solid accent colors.
- Converted the project cards into a bordered list layout.
- Simplified the hero portrait and rebalanced the header with left-aligned branding, centered navigation, and a larger theme toggle on the right.
- Enlarged navigation links with a fast center-out text underline, added instant surface and text color feedback to non-navigation controls, and centered and enlarged the back-to-top button.

### Removed

- Legacy static `index.html`, `404.html`, `styles.css`, and `scripts.js` files from the repository root.
