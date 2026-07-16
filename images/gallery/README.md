# Gallery Images

Upload your gallery photos into the matching subfolder. The gallery page will reference them from here.

## Folder structure

```
images/gallery/
  weddings/        → Wedding photos
  proposals/       → Proposal photos
  henna/           → Henna evening photos
  birthdays/       → Birthday celebration photos
  catering-dessert/→ Catering & dessert table photos
  salcups/         → SÀL CUPS dessert photos
  decor-details/   → Decoration & detail close-ups
```

## How to add images

1. Upload your photo (JPG or WEBP) into the correct subfolder.
2. Open `gallery.html` and add an `<img>` tag inside the matching `.gallery-item[data-cat="…"]` element.
3. That's it — the filter and animations work automatically.

## Recommended image sizes

- **Landscape**: 1200 × 800 px
- **Portrait**: 800 × 1100 px
- **File format**: JPG (quality 80–85 %) or WEBP for better performance
