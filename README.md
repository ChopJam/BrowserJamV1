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

1. Create a new Web Service and connect this repository.
2. Set `npm run build` as the **Build Command** and `npm run start` as the **Start Command**.
3. Use a Node 18+ runtime.
4. Deploy the service.

