# Trowelex Portugal — independent Netlify website

Complete static source for the PT/EN Trowelex Portugal website. No app account, remote API, framework runtime, or external image host is required. Images, logo, favicon, styles and scripts are bundled locally.

## Deploy from this source package

1. Extract the ZIP and put **the contents of this folder** at the root of a GitHub repository.
2. Connect the repository to Netlify.
3. Set the build options below and deploy.

| Setting | Value |
|---|---|
| Required Node.js version | 22.x |
| Install command | `npm install` |
| Build command | `npm run build` |
| Publish directory | `dist` |

Netlify also reads these settings from `netlify.toml`; `.nvmrc` pins Node 22 locally. There are no third-party npm dependencies, so installation is fast. `npm run dev` serves the source for a local preview. `npm run preview` serves the built `dist` directory.

The Netlify Forms-compatible enquiry forms are present in the static HTML generated at build time, with separate names for Portuguese and English, a honeypot, a file field and a success page. After the first Netlify deploy, check **Forms** in the Netlify dashboard and enable form detection if prompted. Add a form notification to route submissions to the desired inbox; Netlify stores submissions in its dashboard but does not automatically send them to the address shown on the website. Send a test enquiry after deployment and confirm it appears under verified or spam submissions. A single image upload is allowed per submission; the form restricts the browser to JPG, PNG or WebP under 7 MB, below Netlify's 8 MB total request limit.

The build uses Netlify's `DEPLOY_PRIME_URL` or `URL` for absolute social image and language-alternate metadata. When run outside Netlify, those links remain root-relative so the local build remains portable. If publishing on a non-Netlify host, set `URL` to its HTTPS origin before running the build, and replace Netlify Forms with another form service.

## Content provenance and editorial limits

- Services and Algarve context: the formerly indexed [Trowelex Portugal English site](https://trowelex-portugal.com/) and [Portuguese page](https://trowelex-portugal.com/pt), viewed while the original Shopify storefront was unavailable.
- Genuine logo: the former Trowelex storefront's own Shopify asset, recovered from its archived page. Included as `src/assets/logo-original.jpg` without redesign.
- Laranjeira before/after photographs: public [Trowelex Facebook page](https://www.facebook.com/people/Trowelex/61550574268408/) and its [finished-project photo](https://www.facebook.com/photo.php?fbid=122285893280019142). Both images are locally bundled.
- Social-sharing card: a newly generated typographic card using the confirmed business name, service and authentic cyan-and-black palette. It is not represented as the company's original logo or a project photograph.
- Phone and email: supplied by the project brief and corroborated by indexed business material.

Only one project is featured because it is the project for which genuine, attributable images were recovered. No other work, customer review, credential, numerical claim or service area was fabricated. Before using this as an official live site, confirm that Trowelex approves the content, image rights, privacy wording, domain and notification destination.
