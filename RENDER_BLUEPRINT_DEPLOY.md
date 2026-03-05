# Render Blueprint Deployment Guide

This is the simplest way to deploy to Render - it deploys everything automatically using a blueprint. The app uses SQLite for the database, so no separate database service is needed.

## Prerequisites

- GitHub account with EMR repository pushed to main
- Render account (https://render.com)

## Deploy Using Blueprint

### Step 1: Commit Blueprint to GitHub

First, push the `render.yaml` file to your repository:

```bash
git add render.yaml
git commit -m "Add Render blueprint configuration"
git push origin main
```

### Step 2: Deploy the Blueprint

1. Go to https://render.com/
2. Click **"New +"** dropdown
3. Select **"Blueprint"**
4. Click **"Connect a repository"**
5. Search for and select your **EMR repository**
6. Click **"Connect"**

### Step 3: Configure Deployment

1. **Service Group Name**: `emr` (or any name you prefer)
2. **Branch**: Keep as `main`
3. Review the services that will be created:
   - **emr-api** (Web Service)
   - No database service needed (using SQLite)
4. Click **"Deploy"**

Render will now:
- Create a web service
- Set up environment variables automatically
- Build your frontend and backend
- Start the server
- Automatically initialize the SQLite database

This takes about 5-10 minutes.

### Step 4: Test Your App

Once deployment completes:

1. Click the URL for **emr-api** service (e.g., `https://emr-api.onrender.com`)
2. You should see the EMR application
3. Test the API: Visit `/health` in your URL bar

**Note**: The SQLite database file (`emr.db`) is automatically created on the first run. It persists in the Render service.

## Auto-Updates

Every time you push to `main`:

```bash
git add .
git commit -m "Your changes"
git push origin main
```

Render automatically rebuilds and redeploys your app.

## Database Persistence

The SQLite database file (`emr.db`) is stored in the service's file system and persists across deployments as long as the service continues running. The file is automatically created on first startup if it doesn't exist.

## That's It!

Your EMR system is now deployed to Render on the free tier. No database configuration needed - SQLite handles everything.

For troubleshooting, check the **Logs** tab in your service dashboard.
