# Wilkins Scaffolding Services

The approved website, exported as an independent source project for GitHub and Netlify. The website design, page content, styles and assets are preserved exactly. No runtime services, framework servers, API keys, ChatGPT URLs or paid integrations are required by the website code. All supplied and generated assets are stored locally. The project has not been deployed. The display font is a local copy of Barlow Condensed Black from the official Google Fonts repository, with its SIL Open Font License included under `public/assets/fonts/`. No external font requests are made by the website. See `DEPLOYMENT.md` for the deployment steps.

## Development and build

- Node: 22 LTS, configured in `.nvmrc` and `netlify.toml` (verified using Node 22.17.1).
- Install: `npm ci` (the project has no third-party dependencies).
- Local preview: `npm run dev`, then open `http://127.0.0.1:4173/`.
- Build: `npm run build`.
- Publish directory: `dist`.
- Preview the built files: `npm run preview`.

Commit the source, public assets, package files, `.nvmrc` and `netlify.toml`. Do not commit `dist`, `node_modules`, local environment files or host-generated folders. The build regenerates `dist` from `src` and `public` and checks local HTML references, image sources and JavaScript syntax. Navigation uses section anchors; auxiliary pages are static HTML and Netlify aliases are configured.

## Current source of truth

Confirmed from the business brief: company name, generic scaffolding services, phone +44 7949 914442, and email wilkinsjay05@gmail.com. The hero headline is supplied by the brief.

Not supplied: authentic logo or brand colour, verified Facebook URL, company project images, confirmed service categories, reviews, service area, accreditations, insurance, credentials, memberships, experience figures or guarantees. None of these are asserted on the website. The temporary wordmark, W favicon and safety-yellow accent are provisional. The project and review sections use enquiry/feedback content until genuine material is supplied; no stock or AI-generated project photographs are presented as company work.

This export preserves the version approved by the owner as finished. Adding company material later is optional and is not required to build or deploy this version.

## Add verified company content

Store genuine images under `public/assets/`, then update `public/company.json`. Local image references must start with `/assets/`. Assets may be JPG, PNG or WebP. Keep descriptive alt text and use compressed images with sensible dimensions.

- `logo`: local path to the genuine logo, or `null` to retain the temporary wordmark.
- `facebookUrl`: confirmed Facebook business page URL, or `null`.
- `heroImage`: `{ "src": "/assets/project-hero.jpg", "alt": "Accurate description of the genuine project" }`, or `null`.
- `additionalServices`: array of `{ "title", "description", "image", "imageAlt", "confirmedSource" }`. Do not add speculative services. A real image creates a full visual service section.
- `projects`: array of `{ "title", "image", "alt", "description", "confirmedSource" }`. Gallery tiles open an accessible photograph dialog.
- `reviews`: array of `{ "author", "text", "confirmedSource" }`. Publish only exact verified customer feedback with permission to reproduce it.

`confirmedSource` records verification provenance, not a credential or secret. The build rejects entries lacking a source. This is a content guard rather than an independent fact checker: the editor must confirm the source and permission before adding entries. The generic scaffolding section and business contact copy are in `src/index.html`. Palette tokens are in `src/styles.css`.

## Netlify quote form

The form is declared in static HTML using `data-netlify="true"`, a `form-name` hidden field, a honeypot and multipart encoding. It has three separate photograph fields to match Netlify’s multiple-upload setup. Images are limited in the browser to JPG, PNG and WebP, 7 MB combined, leaving room below Netlify’s 8 MB request limit. Browser validation is not a security boundary; Netlify performs the hosted processing.

After deployment:

1. Enable form detection in the Netlify site’s Forms settings, then deploy/redeploy so Netlify discovers `scaffolding-quote`.
2. Confirm the form appears in the Netlify dashboard.
3. Configure form-submission email notifications to `wilkinsjay05@gmail.com` in Netlify. Writing an email address in the page does not configure delivery.
4. Make one end-to-end test with a harmless image. Confirm the submission, attachment link and email notification arrive, and that the success page opens.
5. Review the privacy notice and business information with the company before public launch; set and manage an appropriate enquiry retention policy in the hosting account.

Hosted form processing is a Netlify account capability, and any account usage limits or charges are governed by Netlify; no payment or service purchase has been configured. Files uploaded through Netlify are stored by Netlify, not by this static code.

The local preview never submits requests. It shows a review dialog and prepares a mailto link; photographs must be attached manually in the visitor’s email app. No test enquiry has been sent to the business. The built production form sends multipart data and navigates to the success page only after a successful response. It preserves the enquiry and offers an email fallback if sending fails. Without JavaScript, the production form uses the native HTML submission.

Official setup: https://docs.netlify.com/manage/forms/setup/
Submission handling: https://docs.netlify.com/manage/forms/submissions/

## Metadata and social image

The title, description, favicon and social-sharing metadata are business-specific. `public/assets/og.png` is a generated typography-only social card made with the built-in image generation tool; it is not a company logo or project image. Its exact generation brief is saved in `docs/social-card-prompt.txt`. Netlify supplies the deployment origin to the build, which creates absolute social-image URLs, a canonical URL and sitemap. A custom `SITE_URL` environment variable may override the origin when a final business domain is known. Local builds without an origin retain relative social-image references and omit canonical/sitemap URLs instead of inventing a domain.

When authentic branding becomes available, update the accent tokens, favicon and social card together. Avoid editing generated `dist` files because the next build overwrites them.
