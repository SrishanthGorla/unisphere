# PWA Icons Required

The following icon files need to be created in the `public` directory:

## Required Icons:
- `icon-192.png` - 192x192 pixels
- `icon-512.png` - 512x512 pixels

## Icon Design:
- Background: Gradient from purple (#8b5cf6) to cyan (#06b6d4)
- Foreground: White "U" letter or UniSphere logo
- Style: Modern, rounded corners
- Format: PNG with transparency

## Tools to create icons:
1. Use online favicon generators
2. Canva or Figma for design
3. Convert SVG to PNG using online converters

## Example icon creation:
```bash
# Using ImageMagick (if installed)
convert -size 192x192 xc:"radial-gradient:purple-cyan" -gravity center -pointsize 100 -fill white -annotate +0+0 "U" icon-192.png
```

For now, the PWA will work without these icons but won't install properly on devices.