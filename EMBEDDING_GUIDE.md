# Embedding Configuration Guide

## X-Frame-Options Configuration

This project includes a `vercel.json` configuration file that controls whether the app can be embedded in iframes.

---

## Current Configuration

The app is configured to **allow embedding from ANY domain**:

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

**Note**: We use `Content-Security-Policy` instead of `X-Frame-Options` because:
- Modern browsers prefer CSP over X-Frame-Options
- CSP provides more flexibility (wildcards, multiple domains)
- `X-Frame-Options: ALLOWALL` is not a valid value

---

## Configuration Options

### 1. ✅ **Allow ALL Domains** (Current - Most Permissive)

**Use case**: Educational platform needs to embed in multiple school websites, LMS systems, etc.

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

**Pros**: Works everywhere, no restrictions  
**Cons**: Can be embedded on any website (including malicious ones)

---

### 2. 🔒 **Same Origin Only** (Most Secure)

**Use case**: Only want to embed on your own domain

```json
{
  "headers": [
    {
      "source": "/:path*",
      "headers": [
        {
          "key": "Content-Security-Policy",
          "value": "frame-ancestors 'self'"
        }
      ]
    }
  ]
}
```

**Pros**: Most secure, prevents clickjacking  
**Cons**: Can't embed on external domains

---

### 3. 🎯 **Specific Domains** (Recommended for Production)

**Use case**: Allow embedding only on trusted school/organization domains

```json
{
  "headers": [
    {
      "source": "/:path*",
      "headers": [
        {
          "key": "Content-Security-Policy",
          "value": "frame-ancestors 'self' https://yourschool.edu.my https://school2.edu.my"
        }
      ]
    }
  ]
}
```

**Pros**: Secure and flexible  
**Cons**: Need to update list when adding new domains

---

### 4. 🌐 **Wildcard Subdomains**

**Use case**: Allow embedding on all subdomains of your organization

```json
{
  "headers": [
    {
      "source": "/:path*",
      "headers": [
        {
          "key": "Content-Security-Policy",
          "value": "frame-ancestors 'self' https://*.edu.my https://*.vercel.app"
        }
      ]
    }
  ]
}
```

**Pros**: Flexible for multiple school sites  
**Cons**: All subdomains are allowed (less control)

---

## How to Change Configuration

1. **Edit `vercel.json`** in the root directory
2. **Choose one of the options above**
3. **Commit and push to GitHub**:
   ```bash
   git add vercel.json
   git commit -m "Update iframe embedding policy"
   git push origin main
   ```
4. **Vercel will auto-deploy** with new headers

---

## How to Embed

Once configured, embed using standard iframe:

```html
<!-- Simple embed -->
<iframe 
  src="https://your-app.vercel.app" 
  width="100%" 
  height="600"
  frameborder="0"
  title="Mia Kids Educational Chatbot"
></iframe>

<!-- Responsive embed -->
<div style="position: relative; padding-bottom: 75%; height: 0;">
  <iframe 
    src="https://your-app.vercel.app" 
    style="position: absolute; top: 0; left: 0; width: 100%; height: 100%;"
    frameborder="0"
    title="Mia Kids Educational Chatbot"
  ></iframe>
</div>

<!-- Full-screen modal embed -->
<iframe 
  src="https://your-app.vercel.app" 
  width="100%" 
  height="100%"
  style="border: none; position: fixed; top: 0; left: 0; z-index: 9999;"
  title="Mia Kids Educational Chatbot"
></iframe>
```

---

## Testing Iframe Embedding

### Local Testing

Create a test HTML file:

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Embed Test</title>
</head>
<body style="margin: 0; padding: 20px; background: #f0f0f0;">
  <h1>Mia Kids Chatbot - Embed Test</h1>
  <iframe 
    src="http://localhost:5173" 
    width="100%" 
    height="800"
    style="border: 2px solid #333; border-radius: 8px; box-shadow: 0 4px 12px rgba(0,0,0,0.1);"
    title="Mia Kids Educational Chatbot"
  ></iframe>
</body>
</html>
```

### Production Testing

Replace `src="http://localhost:5173"` with your Vercel URL:
```html
<iframe src="https://your-app-name.vercel.app" ...>
```

---

## Security Considerations

### ⚠️ Risks of `ALLOWALL`
- Can be embedded on malicious sites
- Potential for clickjacking attacks
- Users might not know they're on a third-party site

### ✅ Best Practices
1. **Start restrictive**: Use specific domains initially
2. **Monitor usage**: Track where embeds are coming from
3. **Update as needed**: Add domains when trusted partners request access
4. **Consider authentication**: Add user authentication if handling sensitive data

### 🎓 For Educational Apps
Since this is an educational tool:
- **Public schools**: Consider allowing all domains (easier distribution)
- **Private content**: Use specific domain restrictions
- **LMS integration**: Allow common LMS domains (Canvas, Moodle, Google Classroom)

---

## Common LMS Domains to Allow

If deploying to schools using Learning Management Systems:

```json
{
  "headers": [
    {
      "source": "/(.*)",
      "headers": [
        {
          "key": "Content-Security-Policy",
          "value": "frame-ancestors 'self' https://*.instructure.com https://*.canvaslms.com https://*.moodle.com https://*.classroom.google.com https://*.edu.my"
        }
      ]
    }
  ]
}
```

---

## Troubleshooting

### Problem: "Refused to display in a frame"
**Cause**: X-Frame-Options is set to DENY or SAMEORIGIN  
**Solution**: Update `vercel.json` to ALLOWALL or add specific domain

### Problem: Works locally but not in production
**Cause**: Vercel hasn't deployed the new `vercel.json`  
**Solution**: Check Vercel dashboard > Deployments > ensure latest commit deployed

### Problem: Works on one domain but not another
**Cause**: Domain not in `frame-ancestors` list  
**Solution**: Add the domain to the CSP policy

### Problem: Mixed content errors
**Cause**: Embedding HTTP site in HTTPS iframe (or vice versa)  
**Solution**: Ensure both parent page and iframe use HTTPS

---

## Vercel Dashboard Alternative

You can also set headers via Vercel Dashboard:
1. Go to project settings
2. Navigate to "Headers" section
3. Add custom headers without modifying code

**Note**: `vercel.json` takes precedence over dashboard settings.

---

## Recommendation for This Project

Since this is an **educational tool for Malaysian primary schools**:

### For Development/Testing (Current)
✅ **Use ALLOWALL** - easier testing across different platforms

### For Production Deployment
🎯 **Switch to Specific Domains** - add your school/organization domains:

```json
{
  "headers": [
    {
      "source": "/(.*)",
      "headers": [
        {
          "key": "Content-Security-Policy",
          "value": "frame-ancestors 'self' https://*.edu.my https://*.vercel.app https://yourschool.edu.my"
        }
      ]
    }
  ]
}
```

---

**Last Updated**: October 7, 2025  
**Current Setting**: ALLOWALL (all domains can embed)
