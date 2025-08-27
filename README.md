# To-Do Frontend

Simple frontend for a To-Do application.

## Overview
- Works offline using `localStorage` by default.
- When you have a backend (Express + MongoDB) deployed, replace `API` in `script.js` with your backend URL to enable persistence.

## Files
- `index.html` - main UI
- `style.css` - styles
- `script.js` - app logic (localStorage + optional remote backend)

## How to use locally
1. Open `index.html` in your browser (double-click or serve with a static server).
2. Add tasks — they will be saved in your browser's localStorage.

## How to connect to backend
1. Deploy backend (Express) and get its URL (e.g., https://todo-backend.onrender.com).
2. Edit `script.js` and set:
```js
const API = "https://todo-backend.onrender.com";
```
3. Push changes to GitHub and (optionally) enable GitHub Pages (see below).

## Deploy on GitHub Pages
1. Push this repo to GitHub.
2. Go to Settings → Pages → Source → select `main` branch and root `/`.
3. Save → your site will be available at:
   `https://<YOUR_USERNAME>.github.io/<REPO_NAME>/`

## Notes
- Do NOT commit any secrets or backend `.env` files to GitHub.
- This frontend includes a fallback so it works even if the backend is not set.
