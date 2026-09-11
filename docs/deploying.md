# Publishing changes

Live site: https://sss-jonathan-attempt.netlify.app/

Anyone with write access to this GitHub repository can publish changes:

1. Pull the latest `main` branch before editing.
2. Make and check your changes. Run `node scripts/validate-visual-data.js` and any checks needed for the change.
3. Commit and push to `main`, or merge a pull request into `main`.
4. Netlify automatically checks and publishes the site. A failed build leaves the previous site live.

No Netlify login or personal Netlify token is needed. Only people with GitHub write access can push; being public does not let everyone change the site.

Netlify uses `netlify.toml`: build command `node scripts/validate-visual-data.js`, publish directory `.`, and functions in `netlify/functions`. Keep secrets in Netlify environment variables, never in Git.

Check deploy status: https://app.netlify.com/projects/sss-jonathan-attempt/deploys

## Source lesson files

`source/jonathan-study-site` contains the original problem data and published problem bank copied from the source repo on September 10, 2026. Build checks use this checked-in snapshot so a fresh clone needs no neighboring repository. When importing source changes, refresh these files from `/Users/shreshth/git-repos/jonathan-study-site` and regenerate and validate the lesson data.
