<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# Run and deploy your AI Studio app

This contains everything you need to run your app locally.

View your app in AI Studio: https://ai.studio/apps/89c06a94-4a16-4a1e-8bc7-8db2e8c37c00

## Run Locally

**Prerequisites:**  Node.js


1. Install dependencies:
   `npm install`
2. Set the `GEMINI_API_KEY` in [.env.local](.env.local) to your Gemini API key
3. Run the app:
   `npm run dev`

## Deploy to Firebase Hosting

This project is already configured for Firebase Hosting with the site ID `lasustech-repository-37148` and the Vite build output in `dist`.

1. Sign in to Firebase:
   `firebase login`
2. Build the app:
   `npm run build`
3. Deploy to Hosting:
   `firebase deploy --only hosting:lasustech-repository-37148`

After deployment, the app is available at `https://lasustech-repository-37148.web.app`.
