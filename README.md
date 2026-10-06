# Girish Ka Jadu — Real AI

## Run locally
1. Install Node.js 18+.
2. Open a terminal in this folder.
3. Run:
   npm install
4. Copy `.env.example` to `.env`.
5. Put your AI API key in `.env`.
6. Run:
   npm start
7. Open `http://localhost:3000`

## Important
The HTML alone cannot securely contain a private AI API key. The Node server keeps the key private and exposes `/api/chat` and `/api/image` to the browser.

## Deploy
Deploy this folder to a Node.js hosting service that supports environment variables. Set `OPENAI_API_KEY` in the hosting dashboard, then start with `npm start`.

Do not commit or upload your `.env` file.
