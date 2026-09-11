# Publishing changes

Live site: https://sss-jonathan-attempt.netlify.app/

Anyone with write access to this GitHub repository can publish changes:

1. Pull the latest `main` branch before editing.
2. Make and check your changes. Run `node scripts/validate-visual-data.js` and any checks needed for the change.
3. Commit and push to `main`, or merge a pull request into `main`.
4. Netlify automatically checks and publishes the site. A failed build leaves the previous site live.

## Suggested branch workflow (for `james`)

1. Keep your active branch as `james` while iterating.
2. Validate local build inputs:
   - `node scripts/validate-visual-data.js`
3. Push changes to GitHub from `james`:
   - `git add .`
   - `git commit -m "..."` (or your preferred message)
   - `git push`
4. Open a pull request from `james` into `main`.
5. Merge once you are happy with the staged feedback loop.
6. Netlify builds from `main` and redeploys automatically.
7. Confirm status at: https://app.netlify.com/projects/sss-jonathan-attempt/deploys

No Netlify login or personal Netlify token is needed. Only people with GitHub write access can push; being public does not let everyone change the site.

Netlify uses `netlify.toml`: build command `node scripts/validate-visual-data.js`, publish directory `.`, and functions in `netlify/functions`. Keep secrets in Netlify environment variables, never in Git.

Check deploy status: https://app.netlify.com/projects/sss-jonathan-attempt/deploys

## Local preview before merge (optional)

If you want to see exactly what this branch looks like before merge:

1. Install dependencies (first time or after lockfile changes):
   - `npm install`
2. Run the site through Netlify Dev so client-side routes like `/busiest-shelf-level` render correctly:
   - `npx netlify dev --offline --port 4174`
3. Open:
   - `http://localhost:4174/busiest-shelf-level`

For a quick static-file smoke check only (no route fallback), you can also run:

1. `node scripts/validate-visual-data.js`
2. `npx serve .` (or another static file server)
3. Open the printed local URL on `/`.
