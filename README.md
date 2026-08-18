# Ragul A — Portfolio

A static portfolio site. No build step, no backend — just HTML, CSS and JS.

## What's inside

```
index.html              → all sections (Home, About, Skills, Projects, Certificates, Resume, Contact)
style.css                → all styling (dark navy theme, animations, responsive layout)
script.js                 → nav, scroll reveal, lightbox gallery, contact form
assets/images/            → profile photo + project screenshots
assets/certificates/      → certificate images (viewable + downloadable)
assets/resume/Ragul_A_Resume.pdf → resume file linked from the Download Resume buttons
```

## Before you deploy

1. **Replace the resume.** `assets/resume/Ragul_A_Resume.pdf` is currently a placeholder.
   Drop your real resume in the same folder with the **same file name**
   (`Ragul_A_Resume.pdf`) and the existing Download Resume buttons will pick it up
   automatically — no code changes needed.
2. **Contact form.** The form sends messages straight to `ragularthanari@gmail.com`
   using [FormSubmit](https://formsubmit.co) — a free service with no backend or
   sign-up required. The **first** message sent will trigger a one-time confirmation
   email from FormSubmit to that inbox — click "Confirm" in it, or the form won't
   deliver messages after that. This only happens once.
3. **New portfolio project card.** A project card for *this* site isn't included yet
   since it doesn't have its own live link. Once you deploy it, you can add one to
   the Projects section in `index.html` and link the live URL.

## Deploying

Any static host works. A few easy options:

**GitHub Pages**
1. Create a repo and push everything in this folder to its root (so `index.html`
   sits at the repo root — this is why all asset paths in the code are relative,
   e.g. `assets/images/profile.jpg`, so they resolve correctly on Pages).
2. Repo → Settings → Pages → Deploy from branch → `main` / root.
3. Your site goes live at `https://<username>.github.io/<repo>/`.

**Netlify / Vercel**
- Drag-and-drop this whole folder into Netlify's deploy UI, or run `vercel` /
  connect the repo — no build command needed, it's static.

## Updating content later

- **New project:** copy one `<article class="project">...</article>` block in
  `index.html`, swap the image, text and tags.
- **New certificate:** copy one `.cert-card` block, drop the image in
  `assets/certificates/`, and add a matching entry to the `certs` array in
  `script.js` (`galleries.certs`) so it opens correctly in the lightbox.
- **Colors:** every color is a CSS variable at the top of `style.css`
  (`:root { --navy-0, --blue, --pink, ... }`) — change them there once and the
  whole site updates.
