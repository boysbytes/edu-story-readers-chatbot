# Tailwind CSS v4 Configuration Notes

## Important: This Project Uses Tailwind CSS v4

This project uses **Tailwind CSS v4.1.14**, which has a completely different configuration system from v3.

## Key Differences from Tailwind v3

### ❌ OLD Way (Tailwind v3)
```javascript
// tailwind.config.js
module.exports = {
  theme: {
    extend: {
      animation: {
        'fade-in': 'fade-in 0.5s ease-out',
      }
    }
  }
}
```

### ✅ NEW Way (Tailwind v4)
```css
/* styles.css */
@import "tailwindcss";

@theme {
  --animate-fade-in: fade-in 0.5s ease-out;
  
  @keyframes fade-in {
    from { opacity: 0; }
    to { opacity: 1; }
  }
}
```

## Configuration Location

- **Tailwind v3**: `tailwind.config.js` or `tailwind.config.cjs`
- **Tailwind v4**: `src/styles.css` using `@theme` directive

## Our Custom Animations

All custom animations are defined in `src/styles.css`:

1. **fade-in**: 0.5s fade and slide up effect
2. **float**: 6s infinite floating animation
3. **float-delay**: 8s infinite floating with horizontal movement
4. **bounce-slow**: 2s infinite gentle bounce
5. **spin-slow**: 2s infinite rotation

## Usage in Components

```jsx
<div className="animate-fade-in">Fades in smoothly</div>
<div className="animate-float">Floats up and down</div>
<div className="animate-bounce-slow">Bounces gently</div>
```

## PostCSS Configuration

The project uses the new Tailwind v4 PostCSS plugin:

```javascript
// postcss.config.cjs
module.exports = {
  plugins: {
    '@tailwindcss/postcss': {},  // New v4 plugin
    autoprefixer: {},
  },
};
```

## Important Files

1. **src/styles.css** - Main Tailwind imports and theme configuration
2. **postcss.config.cjs** - PostCSS plugin configuration
3. **package.json** - Contains `@tailwindcss/postcss` and `tailwindcss` v4 dependencies

## DO NOT Create These Files

- ❌ `tailwind.config.js`
- ❌ `tailwind.config.cjs`
- ❌ `tailwind.config.ts`

These are for Tailwind v3 and will be ignored in v4!

## Troubleshooting

### Problem: Styles not applying
**Solution**: Make sure `@import "tailwindcss";` is at the top of `src/styles.css`

### Problem: Custom animations not working
**Solution**: Check that animations are defined inside `@theme { }` block in `src/styles.css`

### Problem: Build size too small
**Solution**: This usually means Tailwind isn't processing. Check:
- `@import "tailwindcss";` in styles.css
- `'@tailwindcss/postcss': {}` in postcss.config.cjs
- No syntax errors in @theme block

### Expected Build Sizes
- **With proper Tailwind v4**: ~35KB CSS (uncompressed)
- **Without Tailwind**: ~6KB CSS (utilities not generated)

## Resources

- [Tailwind CSS v4 Beta Docs](https://tailwindcss.com/docs/v4-beta)
- [Tailwind v4 Theme Configuration](https://tailwindcss.com/docs/v4-beta#theme-configuration)
- [PostCSS Plugin Setup](https://tailwindcss.com/docs/v4-beta#installation)

---

**Last Updated**: October 7, 2025
**Tailwind Version**: 4.1.14
**PostCSS Plugin**: @tailwindcss/postcss@4.1.14
