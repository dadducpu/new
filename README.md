# Portfolio Site

A static portfolio website built with HTML, CSS, and JavaScript.

## Project structure

- `pages/` - individual pages
- `components/` - reusable page sections
- `styles/` - stylesheet files
- `js/` - JavaScript logic
- `static/` - static assets

## Run locally

Open the project in a browser or run a small local web server:

```bash
python -m http.server 8000
```

Then visit `http://localhost:8000`.

## Publish to GitHub

1. Create a repository in GitHub.
2. In the terminal, run:

```bash
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/<your-username>/<your-repo>.git
git push -u origin main
```

3. If you want GitHub Pages, enable it in the repository settings and use the root folder for the static site.

## Notes

This project is designed as a lightweight static website and can be hosted on GitHub Pages without a backend.
