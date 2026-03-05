# Render Blueprint Deployment Guide

This is the simplest way to deploy to Render - it deploys everything automatically using a blueprint.

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
   - **emr-db** (PostgreSQL Database)
4. Click **"Deploy"**

Render will now:
- Create a PostgreSQL database
- Create a web service
- Set up environment variables automatically
- Build your frontend and backend
- Start the server

This takes about 5-10 minutes.

### Step 4: Initialize Database (One Time Only)

Once deployment completes:

1. In Render Dashboard, click on your **emr-api** service
2. Click the **"Shell"** tab
3. Run this command to load the database schema:

```bash
psql $DATABASE_URL < backend/sql/schema.sql
```

Done! Your app is live.

### Step 5: Test Your App

1. Click the URL for **emr-api** service (e.g., `https://emr-api.onrender.com`)
2. You should see the EMR application
3. Test the API: Visit `/health` in your URL bar

## Auto-Updates

Every time you push to `main`:

```bash
git add .
git commit -m "Your changes"
git push origin main
```

Render automatically rebuilds and redeploys your app.

## That's It!

Your EMR system is now deployed to Render. No manual configuration needed - the blueprint handles everything.

For troubleshooting, check the **Logs** tab in your service dashboard.
