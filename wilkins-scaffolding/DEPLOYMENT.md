# GitHub to Netlify deployment

This ZIP contains the approved website source and all local assets. It does not contain generated build folders. The website runs independently of ChatGPT and does not require API keys.

## Exact settings

| Setting | Value |
| --- | --- |
| Install command | `npm ci` |
| Build command | `npm run build` |
| Publish directory | `dist` |
| Node.js | 22 LTS (verified with 22.17.1) |
| Base directory | Repository root; leave blank |
| Framework | None / static website |

Node 22 is selected by `.nvmrc` and `netlify.toml`. The package lockfile is included. There are no third-party npm dependencies. You do not need to upload `node_modules` or `dist`.

## Upload to GitHub

1. Extract the ZIP into a folder on your computer.
2. Upload the extracted contents to the root of your GitHub repository. Do not upload the ZIP itself as the website source.
3. Check that `package.json`, `package-lock.json`, `netlify.toml`, `.gitignore` and `.nvmrc` are at the repository root, alongside `src`, `public`, `scripts`, `docs`, this file and `README.md`. Make sure the dotfiles are included.

## Deploy on Netlify

1. Create a Netlify project by importing the GitHub repository.
2. Keep the base directory blank. Use `npm run build` as the build command and `dist` as the publish directory. The included `netlify.toml` already supplies these settings and Node 22.
3. Deploy. Netlify rebuilds the public website from the source on each deployment.
4. No environment variables are required. Netlify's deployment URL is used to create absolute social-image URLs, the canonical URL and sitemap. If you later use a custom domain, you may set `SITE_URL` to its HTTPS origin and rebuild, for example your actual business domain without a trailing path.

Do not use Netlify's drag-and-drop static deployment for this source ZIP: it needs the GitHub build process to generate `dist`.

## Enable quote enquiries

The static form is named `scaffolding-quote`. It already includes Netlify detection, the hidden form name, a spam honeypot, multipart encoding, all quote fields and three separate photo-upload fields. The website has a local success page and retains the visitor's enquiry if a submission fails.

1. In the Netlify project's **Forms** section, select **Enable form detection**.
2. Trigger a new deployment after enabling detection. Confirm that `scaffolding-quote` appears in Forms.
3. Open **Configuration > Notifications > Form submission notifications**, add an email notification and set the recipient to `wilkinsjay05@gmail.com`.
4. Send a harmless test enquiry from the deployed website. Check that it appears in Netlify, that any uploaded photograph is accessible, that the email notification arrives and that the custom thank-you page opens.

Form detection and email notification settings belong to the Netlify account and cannot be enabled by putting files in a ZIP. No enquiry has been sent during packaging. The form may be tested locally as an email-preparation flow, but live Netlify processing must be verified after deployment.

The photo form accepts up to three JPG, PNG or WebP files, 7 MB combined. Native HTML submission is available if JavaScript is disabled. With JavaScript, the browser sends multipart form data and redirects after a successful response.

Official instructions: [Netlify Forms setup](https://docs.netlify.com/manage/forms/setup/) and [form notifications](https://docs.netlify.com/manage/forms/notifications/).

## Local verification

Open a terminal in the extracted repository root and run:

```text
npm ci
npm run build
```

For a local development preview, run `npm run dev` and open `http://127.0.0.1:4173/`. For a preview of the production output, run `npm run preview`. Both preview modes prepare an email instead of submitting enquiries to Netlify.

`dist` is generated during a build and ignored by Git. Keep it out of your source repository. The ZIP has been checked by extracting it into a clean directory, installing with the included lockfile and building from those extracted files.
