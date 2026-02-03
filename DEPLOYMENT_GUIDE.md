# ANT Supply API - Complete Deployment Guide

**Time required:** 15-20 minutes  
**Difficulty:** Beginner-friendly (no prior GitHub/Vercel experience needed)

This guide will walk you through deploying the ANT Supply API to `api.autonomi.com`. Once complete, you'll have live endpoints that CoinMarketCap and CoinGecko can query.

---

## What You'll Need

- A GitHub account (free)
- A Vercel account (free)
- Access to DNS settings for autonomi.com
- The API files (in the `ant-supply-api` folder)

---

## Part 1: Create a GitHub Account (Skip if you have one)

1. Go to [github.com](https://github.com)
2. Click **Sign up**
3. Enter your email, create a password, choose a username
4. Complete the verification and setup

---

## Part 2: Create a New Repository on GitHub

A "repository" (or "repo") is just a folder that stores your code online.

### Step 2.1: Start a new repository

1. Log into GitHub
2. Click the **+** icon in the top-right corner
3. Select **New repository**

### Step 2.2: Fill in repository details

- **Repository name:** `ant-supply-api`
- **Description:** `ANT Token Supply API for CoinMarketCap and CoinGecko`
- **Visibility:** Select **Public** (required for free Vercel deployment)
- **DO NOT** check "Add a README file" (we'll upload our own)

4. Click **Create repository**

### Step 2.3: You'll see a page with setup instructions

Keep this page open - you'll need it in a moment.

---

## Part 3: Upload the API Files to GitHub

There are two ways to do this. Choose whichever feels easier:

### Option A: Upload via GitHub Website (Easiest)

1. On your new repository page, click **uploading an existing file** (in the "Quick setup" section)

2. Drag and drop ALL these files/folders from the `ant-supply-api` folder:
   - `api/` (the whole folder)
   - `package.json`
   - `vercel.json`
   - `.gitignore`
   - `README.md`

3. Scroll down and click **Commit changes**

### Option B: Upload via Terminal (More technical)

If you're comfortable with Terminal:

```bash
# Navigate to the ant-supply-api folder
cd /path/to/ant-supply-api

# Initialize git
git init

# Add all files
git add .

# Commit the files
git commit -m "Initial commit: ANT Supply API"

# Connect to your GitHub repository (replace YOUR-USERNAME)
git remote add origin https://github.com/YOUR-USERNAME/ant-supply-api.git

# Push to GitHub
git branch -M main
git push -u origin main
```

---

## Part 4: Create a Vercel Account

Vercel is a free hosting platform that will run your API.

1. Go to [vercel.com](https://vercel.com)
2. Click **Sign Up**
3. Choose **Continue with GitHub**
4. Authorize Vercel to access your GitHub account

---

## Part 5: Deploy to Vercel

### Step 5.1: Import your repository

1. Once logged into Vercel, click **Add New...** → **Project**
2. You'll see a list of your GitHub repositories
3. Find `ant-supply-api` and click **Import**

### Step 5.2: Configure the project

The default settings should work, but verify:

- **Framework Preset:** Other
- **Root Directory:** `./` (leave as default)
- **Build Command:** Leave empty
- **Output Directory:** Leave empty

4. Click **Deploy**

### Step 5.3: Wait for deployment

Vercel will build and deploy your API. This takes about 30-60 seconds.

When it's done, you'll see "Congratulations!" and a preview URL like:
```
https://ant-supply-api-xxxxx.vercel.app
```

### Step 5.4: Test your API

Click the preview URL and add `/api/health` to test:
```
https://ant-supply-api-xxxxx.vercel.app/api/health
```

You should see:
```json
{
  "status": "healthy",
  "service": "ANT Supply API",
  "timestamp": "2026-02-03T..."
}
```

Test the other endpoints too:
- `/api/total-supply`
- `/api/circulating-supply`
- `/api/supply`

---

## Part 6: Connect Your Custom Domain

Now let's point `api.autonomi.com` to your Vercel deployment.

### Step 6.1: Add domain in Vercel

1. In your Vercel project dashboard, click **Settings** (top menu)
2. Click **Domains** (left sidebar)
3. Type `api.autonomi.com` in the input field
4. Click **Add**

### Step 6.2: Vercel will show you DNS instructions

You'll see something like:

| Type | Name | Value |
|------|------|-------|
| CNAME | api | cname.vercel-dns.com |

Or possibly:

| Type | Name | Value |
|------|------|-------|
| A | api | 76.76.21.21 |

Keep this page open.

### Step 6.3: Add DNS record at your domain registrar

You need to add this record wherever your DNS is managed (e.g., Cloudflare, Namecheap, GoDaddy, Route53, etc.).

**Example for Cloudflare:**

1. Log into Cloudflare
2. Select the `autonomi.com` domain
3. Go to **DNS** → **Records**
4. Click **Add record**
5. Enter:
   - **Type:** CNAME
   - **Name:** api
   - **Target:** cname.vercel-dns.com
   - **Proxy status:** DNS only (grey cloud) - **Important!**
6. Click **Save**

**Example for Namecheap:**

1. Log into Namecheap
2. Go to **Domain List** → click **Manage** next to autonomi.com
3. Go to **Advanced DNS**
4. Click **Add New Record**
5. Enter:
   - **Type:** CNAME
   - **Host:** api
   - **Value:** cname.vercel-dns.com
   - **TTL:** Automatic
6. Click the checkmark to save

### Step 6.4: Wait for DNS propagation

DNS changes can take anywhere from 5 minutes to 24 hours to propagate worldwide. Usually it's under 30 minutes.

### Step 6.5: Verify in Vercel

1. Go back to **Settings** → **Domains** in Vercel
2. You should see a green checkmark next to `api.autonomi.com` when it's working
3. Vercel automatically provisions an SSL certificate (HTTPS)

### Step 6.6: Test your custom domain

Once the green checkmark appears, test:
```
https://api.autonomi.com/api/health
https://api.autonomi.com/api/total-supply
https://api.autonomi.com/api/circulating-supply
https://api.autonomi.com/api/supply
```

---

## Part 7: Final Checklist

Before submitting to CoinMarketCap/CoinGecko, verify all endpoints work:

| Endpoint | Expected Response |
|----------|-------------------|
| `https://api.autonomi.com/api/health` | `{"status": "healthy", ...}` |
| `https://api.autonomi.com/api/total-supply` | `{"total_supply": "1200000000", "decimals": 18}` |
| `https://api.autonomi.com/api/circulating-supply` | `{"circulating_supply": "...", "decimals": 18}` |
| `https://api.autonomi.com/api/supply` | Full details with all wallets |

---

## Troubleshooting

### "Domain not configured" error in Vercel

- DNS hasn't propagated yet. Wait 15-30 minutes and refresh.
- Make sure you used `cname.vercel-dns.com` exactly (no typos).
- If using Cloudflare, make sure proxy is OFF (grey cloud, not orange).

### API returns an error

- Check Vercel logs: Go to your project → **Deployments** → click latest deployment → **Functions** tab
- Look for error messages in the logs

### "429 Too Many Requests"

- The Arbitrum RPC endpoint has rate limits. The API caches for 1 minute to avoid this.
- If you see this in testing, wait a minute and try again.

### DNS won't verify

- Some registrars add the domain automatically (api becomes api.autonomi.com.autonomi.com)
- Try adding just `api` without the full domain
- Use a DNS checker like [dnschecker.org](https://dnschecker.org) to see if your record is propagating

---

## URLs for CoinMarketCap/CoinGecko Submissions

Once everything is working, use these URLs in your submissions:

**Total Supply Endpoint:**
```
https://api.autonomi.com/api/total-supply
```

**Circulating Supply Endpoint:**
```
https://api.autonomi.com/api/circulating-supply
```

**Full Details Endpoint (optional, for documentation):**
```
https://api.autonomi.com/api/supply
```

---

## Making Updates

If you need to change the API later:

1. Edit the files in your GitHub repository
2. Vercel automatically detects changes and redeploys (usually within 1-2 minutes)
3. No manual action needed

---

## Need Help?

If you get stuck:

1. Take a screenshot of any error messages
2. Note which step you're on
3. Check Vercel's status page: [vercel.com/status](https://vercel.com/status)
4. Vercel has good documentation: [vercel.com/docs](https://vercel.com/docs)

---

## Summary

What you've accomplished:

✅ Created a GitHub repository with the API code  
✅ Deployed to Vercel (free hosting)  
✅ Connected your custom domain `api.autonomi.com`  
✅ Have working endpoints for CMC/CoinGecko  

The API:
- Queries the Arbitrum blockchain in real-time
- Calculates circulating supply by subtracting 5 excluded wallets
- Caches results for 1 minute
- Costs $0/month on Vercel's free tier
