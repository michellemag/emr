# Render Deployment Guide

This guide walks you through deploying the EMR System to Render.

## Prerequisites

- GitHub account with the EMR repository pushed
- Render account (free at https://render.com)
- PostgreSQL database (Render provides this, or use an external database)

## Step 1: Push Code to GitHub

Make sure all changes are committed and pushed to your main branch:

```bash
git add .
git commit -m "Configure for Render deployment"
git push origin main
```

## Step 2: Create a PostgreSQL Database on Render

1. Go to [Render Dashboard](https://dashboard.render.com)
2. Click **"New +"** → **"PostgreSQL"**
3. Configure:
   - **Name**: `emr-db` (or your preferred name)
   - **Database**: `emr_db`
   - **User**: `emr_user`
   - **Region**: Choose closest to your location
   - **PostgreSQL Version**: Latest stable (e.g., 15+)
4. Click **"Create Database"**
5. Wait for the database to be created (2-5 minutes)
6. Copy the **External Database URL** (you'll need this for the web service)

## Step 3: Create Web Service on Render

1. In Render Dashboard, click **"New +"** → **"Web Service"**
2. Select **"Deploy from Git repository"**
3. Connect your GitHub repository:
   - Search for your `emr` repository
   - Click **"Connect"**
   - Choose **"main"** branch

### Configure Build Settings

4. **Name**: `emr-api` (or your preferred name)

5. **Environment**: `Node`

6. **Build Command**:
   ```
   npm install && npm run install-all && npm run build
   ```

7. **Start Command**:
   ```
   npm run start
   ```

### Add Environment Variables

8. Scroll to **"Environment"** section
9. Add the following environment variables:

   | Key | Value |
   |-----|-------|
   | `DATABASE_URL` | Paste the PostgreSQL external URL from Step 2 |
   | `NODE_ENV` | `production` |
   | `PORT` | `3001` (optional - Render defaults to 3001) |

10. Click **"Create Web Service"**

## Step 4: Initialize the Database Schema

Once the web service is created and deployed:

1. Go to your Render dashboard
2. Click on your `emr-api` web service
3. Click **"Shell"** tab at the top
4. Run the following command to load the schema:

   ```bash
   psql $DATABASE_URL < backend/sql/schema.sql
   ```

   If this fails, try:
   ```bash
   cat backend/sql/schema.sql | psql $DATABASE_URL
   ```

## Step 5: Verify Deployment

1. Go to your web service dashboard
2. Click the URL at the top (e.g., `https://emr-api.onrender.com`)
3. You should see the EMR application
4. Test the health check: Visit `/health` endpoint

### Common URLs:
- **Frontend**: `https://your-app.onrender.com/`
- **API Health**: `https://your-app.onrender.com/health`
- **List Patients**: `https://your-app.onrender.com/api/patients`

## Troubleshooting

### Build Fails
- Check the **Logs** tab in your Render dashboard
- Ensure `npm run build` works locally
- Verify all dependencies are in `package.json`

### Database Connection Error
- Verify `DATABASE_URL` environment variable is set
- Check that the PostgreSQL service is running
- Try accessing the database URL directly with `psql`
- Ensure the schema was loaded correctly

### App Runs but Database is Empty
- Run the schema initialization command again (see Step 4)
- Check logs: `psql $DATABASE_URL -c "SELECT * FROM patients;"`

### Frontend Not Loading / Shows 404
- Check that `frontend/dist` exists after build
- Verify backend is serving static files correctly
- Look at logs for file serving errors

### Port Conflicts
- Render automatically assigns a port via `PORT` environment variable
- The app respects `process.env.PORT` in `src/index.ts`
- Don't hardcode port numbers

## Auto-Deploy on Push

Render automatically redeploys when you push to the main branch. To trigger a deployment:

```bash
git add .
git commit -m "Your changes"
git push origin main
```

Check the **Deployments** tab in Render to monitor the build progress.

## Useful Render Features

### View Logs
- Dashboard → Your service → **Logs** tab
- Real-time logs during deployment and runtime

### Environment Variables
- Dashboard → Your service → **Environment** tab
- Update variables without redeploying

### Manual Deploy
- Dashboard → Your service → **Manual Deploy** button
- Redeploy without pushing new code

### Database Access
- Use the PostgreSQL shell from Render dashboard
- Or connect with `psql $DATABASE_URL` locally

## Production Tips

1. **Add Error Monitoring**: Consider adding Sentry or similar service
2. **Monitor Logs**: Check Render logs regularly for issues
3. **Database Backups**: Render provides automatic backups for paid plans
4. **Custom Domain**: Upgrade to paid plan to use custom domains
5. **HTTPS**: Render provides free HTTPS for all apps

## Scaling

If you need more resources:
- Upgrade to a paid plan on Render (currently $7/month minimum)
- Paid services offer dedicated resources and more reliability

## Need Help?

- **Render Docs**: https://render.com/docs
- **Check Render Status**: https://status.render.com
- **GitHub Issues**: Create an issue in your repository

---

**Deployment Complete!** Your EMR System is now live on Render.
