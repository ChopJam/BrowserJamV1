# BrowserJam

BrowserJam is a Nuxt 3 application that allows you to play **Animal Jam Classic** in the browser using the Ruffle Flash emulator. The interface is intentionally minimal – log in with your Animal Jam credentials and start playing.

This project currently supports only the Play feature. Other UI elements from previous versions have been removed.

## Setup

Install dependencies and start the development server:

```bash
npm install
npm run dev
```

### Production build

To build and preview the production version:

```bash
npm run build
npm run preview
```

The app is deployed on [Railway](https://animaljam.up.railway.app/).

## Deployment on Render

1. Create a new **Web Service** on [Render](https://render.com) and connect this repository.
2. Set the **Build Command** to `npm run build` and the **Start Command** to `npm run start`.
3. Render may default to Bun because the repo has `bun.lockb`. Select **npm** as the package manager.
4. The project pins **Node 18** in `.node-version`, so choose the same runtime.
5. Click **Create Web Service** to deploy.
