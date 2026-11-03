# Project 61 — four worlds, one studio

A custom, interactive creative and technology studio portfolio for **video, data, web and software**.

**Status:** This redesign is on the **redesign/four-worlds** branch for review. Production \`main\` is not being changed until the preview is approved.

## Experience

- Experimental asymmetric four-world mosaic, compact interactive navigation and discipline-specific expansions.
- Bold custom visual system with coral, lime, cyan and lavender accents.
- Eight interactive portfolio entries, separating independent published work from original demonstrations.
- Original **61 / CUT** generative silent motion study with play/pause/scrub.
- Original **61 / SIGNAL** synthetic data exploration with real recalculation and CSV export.
- Original **61 / FRAME** fictional brand concept with live layout/palette switching.
- Original **61 / FLOW** local workflow tool with operational nodes, reorder/remove, error states and exports.
- Five-stage intake form with review step, validation and copy/email fallback.
- Vercel serverless email delivery through Resend, protected by server-validated Cloudflare Turnstile.
- Accessible dialogs, keyboard controls, mobile layouts and reduced-motion mode.

## Why this architecture?

The site intentionally uses **vanilla HTML, CSS and JavaScript**, with two **Vercel Node.js Functions**. It does not need a React or Next.js runtime for this scope. This keeps bundle size small, avoids dependency churn, improves portability and simplifies long-term maintenance. Everything runs as a static site except the inquiry endpoint.

## Local preview

Open \`index.html\` through a local HTTP server:

\`\`\`bash
python3 -m http.server 8080
# visit http://localhost:8080
\`\`\`

The design and demos work locally. The inquiry API **does not work** with a plain static server. The form visibly displays fallback contact methods until the Vercel environment and functions are configured.

Test syntax and server logic:

\`\`\`bash
node --test tests/site.test.cjs
\`\`\`

## Deploy on Vercel

1. Import the existing GitHub repository **mudia-OE/Project-61** at [Vercel](https://vercel.com/new).
2. For the current branch preview, connect the repository and enable Preview deployments for **redesign/four-worlds**. A Vercel Preview deployment may be created automatically from commits or the pull request.
3. Framework preset **Other**. Root directory **/**. No build command, no output directory override, and no dependency installation required.
4. Open the Preview URL and check mobile and desktop before merging to \`main\`.
5. On approval, merge the pull request. If the Vercel project's production branch is \`main\`, the merge will trigger a production deployment.

**Do not point production at the redesign branch until approved.** The live domain has not been set by this repository.

### Configure real email delivery

The project builder will **not** claim an inquiry was submitted unless the backend sends a real email successfully.

Set the following environment variables in **Vercel → Project Settings → Environment Variables**:

| Variable | Visibility | Notes |
|---|---|---|
| \`RESEND_API_KEY\` | secret, server | Create a key at resend.com |
| \`INQUIRY_TO_EMAIL\` | server | Recipient inbox, currently can be \`anticipate.peak@gmail.com\` |
| \`INQUIRY_FROM_EMAIL\` | server | Verified Resend sender, e.g. \`Project 61 <inquiries@your-domain.com>\` |
| \`TURNSTILE_SITE_KEY\` | public value, served by /api/config | Cloudflare Turnstile site key |
| \`TURNSTILE_SECRET_KEY\` | secret, server | Cloudflare Turnstile secret |
| \`TURNSTILE_HOSTNAMES\` | optional, server | Comma-separated permitted hostnames, e.g. \`project61.com,www.project61.com\` |

Create a Turnstile widget with the correct site hostnames. Verify a domain you control with Resend before using its address as the sender. The visitor's supplied email is set as **Reply-To**, never spoofed as the sender.

After adding variables, redeploy the site and submit an actual test inquiry. Confirm that the inbox receives it. **Preview deployments** may need separate Turnstile hostname configuration; the form intentionally falls back to copy/email when credentials are unavailable.

Do not commit any API keys, private inbox tokens or domains with secrets.

### Security and privacy

- Bot challenge is validated server-side and fails closed.
- Request size, field lengths, valid service values, consent, and email format are checked server-side.
- Honeypot reduces basic automated submissions.
- Output email uses plain text; header fields are restricted.
- No separate database stores inquiry bodies.
- Visit \`/privacy\` for the disclosed handling of submitted information.
- For a higher traffic production site, add durable rate limiting at the edge or a KV store.

## Project media and attribution

Existing portfolio examples are described factually. NBA and automotive videos have **not been embedded in the public branch** because display rights for all footage/music must be confirmed. Substitute owned or appropriately licensed media when cleared. Portfolio comparisons between two Anticipate Reels are observational, not proof of editing causality.

The four original demos have no copyrighted external footage or customer data. \`61 / SIGNAL\` and \`61 / FLOW\` explicitly use synthetic sample data.

## Editing content

- \`index.html\` — page structure, mosaic and project cards
- \`styles.css\` — design tokens, responsive layout, animation
- \`app.js\` — world state, project gallery and modal
- \`demos.js\` — four interactive demonstration engines
- \`inquiry.js\` — intake wizard, client-side checks and Turnstile initialization
- \`api/config.js\` — exposes safe public form configuration
- \`api/inquiries.js\` — secured email delivery
- \`privacy.html\` — privacy notice
- \`vercel.json\` — clean routes and security headers

The origin of the number 61 is personal and intentionally not disclosed in public copy.

## Before production release

- [ ] Visually review and approve the interactive design
- [ ] Test phone, tablet, desktop and keyboard navigation
- [ ] Approve public project descriptions
- [ ] Verify rights to any externally supplied footage/music/images
- [ ] Confirm custom domain and verified email sender
- [ ] Set Vercel environment variables and test real inbox delivery
- [ ] Review privacy notice for actual operational practices
- [ ] Merge the reviewed feature branch into main
