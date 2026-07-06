# Vercel Deployment Guide

## Required Environment Variables

Before deploying to Vercel, ensure these environment variables are set in your Vercel project settings:

### **Critical (must have)**
- `NEXT_PUBLIC_SITE_URL` — Your storefront domain (e.g., `https://shop.example.com`)
- `SPREE_API_URL` — Backend Spree API URL (e.g., `https://api.example.com`)
- `SPREE_PUBLISHABLE_KEY` — Spree publishable API key from Admin

### **Store Defaults**
- `NEXT_PUBLIC_DEFAULT_COUNTRY` — Store's default country (default: `us`)
- `NEXT_PUBLIC_DEFAULT_LOCALE` — Store's default language (default: `en`)
- `NEXT_PUBLIC_STORE_NAME` — Storefront name
- `NEXT_PUBLIC_STORE_DESCRIPTION` — SEO description

### **Optional (recommended for production)**
- `SENTRY_DSN` — Sentry error tracking DSN
- `SENTRY_ORG` — Sentry organization (required if DSN is set)
- `SENTRY_PROJECT` — Sentry project (required if DSN is set)
- `SENTRY_AUTH_TOKEN` — Sentry auth token (required if DSN is set)
- `SENTRY_SEND_DEFAULT_PII` — Set to `"true"` only if you have user consent
- `NEXT_PUBLIC_SENTRY_SEND_DEFAULT_PII` — Set to `"true"` only if you have user consent
- `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` — Stripe public key (if using Stripe payments)

## Deployment Steps

1. **Connect your GitHub repository** to Vercel (if not done already)
2. **Go to Project Settings** → **Environment Variables**
3. **Add all required variables** from the list above
4. **Vercel will auto-detect Next.js** and use settings from `vercel.json`
5. **Trigger a deployment** from Vercel dashboard or by pushing to main branch

## Troubleshooting Build Failures

### Issue: Build fails with "SPREE_API_URL not found"
**Solution**: Add `SPREE_API_URL` to Vercel Environment Variables (Project Settings).

### Issue: Build fails with Sentry errors
**Solution**: Either:
- Add all Sentry variables (`SENTRY_DSN`, `SENTRY_ORG`, `SENTRY_PROJECT`, `SENTRY_AUTH_TOKEN`), OR
- Leave them empty and Sentry will be disabled

### Issue: "Next.js build output format error"
**Solution**: `vercel.json` already specifies `"output": "standalone"`. If problems persist:
- Clear Vercel cache: Project Settings → Git → Disable Git Integration, then re-enable
- Trigger a redeploy

## Local Testing Before Deploy

```bash
npm install
npm run build
npm start
```

Then visit `http://localhost:3001`.

## Production Checklist

- [ ] `NEXT_PUBLIC_SITE_URL` is your actual domain (not localhost)
- [ ] `SPREE_API_URL` points to production Spree API
- [ ] `SPREE_PUBLISHABLE_KEY` is correct for your store
- [ ] `SENTRY_*` variables are configured or all left empty
- [ ] Storefront is accessible and pages load
- [ ] Payment methods work (Stripe, etc.)
- [ ] Images load from your Spree instance
