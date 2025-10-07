# X-Frame-Options Troubleshooting Guide

## Problem: "Refused to display in a frame because it set 'X-Frame-Options' to 'deny'"

This error occurs when trying to embed your Vercel app in an iframe.

---

## Solution Applied (October 7, 2025)

### What Was Wrong

1. **Invalid `X-Frame-Options` value**: `ALLOWALL` is not a valid value
   - Valid values are only: `DENY`, `SAMEORIGIN`, or `ALLOW-FROM`
   
2. **Vercel's default security headers**: Vercel sets `X-Frame-Options: deny` by default for security

3. **Header precedence**: Modern browsers prefer `Content-Security-Policy` over `X-Frame-Options`

### Fixed Configuration

Updated `vercel.json` to use only `Content-Security-Policy`:

```json
{
  "headers": [
    {
      "source": "/:path*",
      "headers": [
        {
          "key": "Content-Security-Policy",
          "value": "frame-ancestors *"
        }
      ]
    }
  ]
}
```

**Key changes:**
- ✅ Removed invalid `X-Frame-Options: ALLOWALL`
- ✅ Changed source pattern from `/(.*)"` to `/:path*` (Vercel's preferred format)
- ✅ Using only `Content-Security-Policy` which takes precedence

---

## Verification Steps

### After Deployment (wait 1-2 minutes for Vercel to deploy)

1. **Check HTTP headers:**
   ```bash
   curl -I https://your-app.vercel.app
   ```
   
   You should see:
   ```
   Content-Security-Policy: frame-ancestors *
   ```
   
   You should NOT see:
   ```
   X-Frame-Options: deny
   ```

2. **Test in browser console:**
   ```javascript
   fetch('https://your-app.vercel.app')
     .then(r => r.headers.get('content-security-policy'))
     .then(console.log)
   ```

3. **Try embedding again:**
   ```html
   <iframe src="https://your-app.vercel.app"></iframe>
   ```

---

## If Still Not Working

### Option 1: Check Vercel Deployment Status

1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Click on your project
3. Check "Deployments" tab
4. Make sure the latest commit is deployed (with the vercel.json fix)
5. Click on the deployment → "Functions" → Check headers

### Option 2: Force Redeploy

If the config isn't applying:

```bash
# Option A: Make a small change and push
echo "" >> README.md
git add README.md
git commit -m "Trigger redeploy"
git push

# Option B: Use Vercel CLI
npx vercel --prod
```

### Option 3: Verify in Vercel Dashboard

1. Go to Project Settings → Headers
2. Add header manually if needed:
   - **Source**: `/:path*`
   - **Key**: `Content-Security-Policy`
   - **Value**: `frame-ancestors *`

### Option 4: More Restrictive (if wildcard doesn't work)

Some browsers/proxies might block `frame-ancestors *`. Try specific domains:

```json
{
  "headers": [
    {
      "source": "/:path*",
      "headers": [
        {
          "key": "Content-Security-Policy",
          "value": "frame-ancestors 'self' https://*.vercel.app http://localhost:* https://yourdomain.com"
        }
      ]
    }
  ]
}
```

---

## Understanding the Headers

### `X-Frame-Options` (Legacy)

Older header with limited options:
- `DENY` - Cannot be embedded anywhere
- `SAMEORIGIN` - Can only be embedded on same domain
- `ALLOW-FROM url` - Can be embedded on specific URL (deprecated in most browsers)

**Note**: `ALLOWALL` is NOT a valid value!

### `Content-Security-Policy: frame-ancestors` (Modern)

Newer, more flexible header:
- `frame-ancestors 'none'` - Same as X-Frame-Options: DENY
- `frame-ancestors 'self'` - Same as X-Frame-Options: SAMEORIGIN
- `frame-ancestors *` - Allow embedding from any domain
- `frame-ancestors https://example.com` - Allow specific domain
- `frame-ancestors https://*.example.com` - Allow domain and subdomains

**When both headers are present**: Browsers prefer CSP over X-Frame-Options

---

## Common Scenarios

### Scenario 1: Public Educational Tool (Current Setup)
**Need**: Allow embedding everywhere  
**Config**: `frame-ancestors *`

### Scenario 2: School-Only Distribution
**Need**: Only specific schools can embed  
**Config**: `frame-ancestors https://school1.edu.my https://school2.edu.my`

### Scenario 3: Your Own Sites Only
**Need**: Only embed on your domains  
**Config**: `frame-ancestors 'self' https://*.yourdomain.com`

### Scenario 4: LMS Integration
**Need**: Allow common Learning Management Systems  
**Config**: 
```
frame-ancestors 'self' 
  https://*.instructure.com 
  https://*.canvaslms.com 
  https://*.moodle.com
```

---

## Testing Checklist

- [ ] Push `vercel.json` changes to GitHub
- [ ] Wait 1-2 minutes for Vercel deployment
- [ ] Check Vercel dashboard shows "Ready" status
- [ ] Verify headers with `curl -I` or browser dev tools
- [ ] Test iframe embedding in browser
- [ ] Check browser console for errors
- [ ] Test on different domains (if restricting)

---

## Browser-Specific Notes

### Chrome/Edge
- Respects `Content-Security-Policy` over `X-Frame-Options`
- Supports wildcard `*` in `frame-ancestors`

### Firefox
- Respects `Content-Security-Policy` over `X-Frame-Options`
- Supports wildcard `*` in `frame-ancestors`

### Safari
- Respects `Content-Security-Policy` in newer versions
- May need specific domains instead of wildcard in some versions

---

## Security Considerations

### ⚠️ Using `frame-ancestors *` means:
- Anyone can embed your app
- Potential for clickjacking attacks
- Users might not know they're on a third-party site

### ✅ Mitigation strategies:
1. Display branding prominently
2. Add "View in full screen" link
3. Consider adding authentication
4. Monitor where traffic comes from
5. Log iframe embedding sources

### 🎓 For Educational Apps:
- Wide embedding is generally beneficial
- Helps with distribution to schools
- Low risk for non-sensitive content
- Consider restricting if handling student data

---

## Additional Resources

- [MDN: X-Frame-Options](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/X-Frame-Options)
- [MDN: CSP frame-ancestors](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Content-Security-Policy/frame-ancestors)
- [Vercel Headers Documentation](https://vercel.com/docs/edge-network/headers)
- [OWASP Clickjacking Defense](https://cheatsheetseries.owasp.org/cheatsheets/Clickjacking_Defense_Cheat_Sheet.html)

---

**Last Updated**: October 7, 2025  
**Status**: Fixed - using `Content-Security-Policy: frame-ancestors *`
