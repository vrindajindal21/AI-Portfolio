# Deployment Guide: Single-Service Deployment (Unified) 🚀

I've unified your project! Now you only need to deploy **one** service on Render. The backend will server the frontend automatically.

## Step 1: Push latest changes to GitHub
Run these commands in your terminal to sync the unified setup:
```powershell
git add .
git commit -m "chore: unify frontend and backend for single deployment"
git push origin main
```

## Step 2: Deploy to Render (The Only File/Service You Need)
1. Sign up/Login to [Render.com](https://render.com/).
2. Click **New +** > **Web Service**.
3. Connect your GitHub repository `AI-Portfolio`.
4. Set these configurations:
   - **Name**: `vrinda-ai-portfolio`
   - **Root Directory**: `(Leave Blank - keep it as root)`
   - **Runtime**: `Python 3`
   - **Build Command**: `cd frontend && npm install && npm run build && cd ../backend && pip install -r requirements.txt`
   - **Start Command**: `cd backend && gunicorn -w 4 -k uvicorn.workers.UvicornWorker main:app`
5. **Environment Variables**:
   - `OPENROUTER_API_KEY`: Your key from `.env`
   - `OPENROUTER_MODEL`: `google/gemini-2.0-flash-exp:free`
   - `PYTHONPATH`: `backend` (This helps gunicorn find your files)
6. Click **Create Web Service**.

## Why this is better?
- **One URL**: Your frontend and backend live on the same link.
- **No CORS**: No more "Failed to fetch" errors.
- **Simpler**: You only manage one dashboard.

---
*Note: The first build might take 2-3 minutes because it's building both React and Python.*
