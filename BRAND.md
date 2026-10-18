# YidVibe Brand System v8

Source: the user-supplied ten-page Brand System v8, October 2026, Library file `libfile_5fa3b87724fc8191ab3b75656fe849fd`. The parent task inspected all ten pages and supplied the implementation requirements. This desktop checkout has not visually inspected the PDF because local Library installation failed on Windows metadata handling.

## Interface

- Petrol `#103D39` leads the interface. Citron `#E5E86A` marks selected moments. Mineral `#43987E` is for decorative fills and rules, not normal text. Mist `#E3EDE7`, canvas `#F3F5EE` and white form the surfaces.
- Yellow gradient endpoints are `#ECEE98` and `#DFE35E`. Gradients belong inside the approved symbol and selected broad accents. Text and primary actions stay solid and readable.
- Space Grotesk, 600 for headings, 500 for labels/buttons, 400 for body. Type steps: 14, 16, 20, 28, 36, 48 and 72px. Responsive headings interpolate between those steps.
- Whitespace steps: 4, 8, 12, 16, 24, 32, 48, 64 and 96px. Controls use a 10px radius; cards use 20px. Avatars, switches and status dots keep their functional circular shapes.
- Error/destructive states retain a separate red semantic palette. Third-party Google artwork keeps its official colors. User images are not recolored.

`src/styles/palette.json` owns numeric colors and direct compatibility aliases. Run `npm run theme:sync` after changing it; commit generated `palette.css`. Alias targets must name a canonical color, so changing petrol once updates existing teal consumers too. Serialized image/manifest colors read those same canonical values. `theme.css` owns semantic aliases, type/radius/spacing tokens. Existing teal, gold, blue, orange and sage keys map into v8 to preserve component contracts. Clay keys support existing destructive/error states. Feature accent helpers use the green family for ordinary presentation.

Space Grotesk is self-hosted from the [typeface author's repository](https://github.com/floriankarsten/space-grotesk), with the complete upstream variable WOFF2 and its SIL Open Font License in `public/fonts`. It is not the embedded PDF subset. Static 400/500/600 faces supply the social-image renderer; the 600 face comes from the official Google Fonts API. See `public/fonts/README.md` for provenance. Code blocks may use a system monospace fallback.

## Approved artwork dependency

Use the authentic supplied master. Horizontal is the default at 180px or larger; symbol at 32px or larger. Clear space is at least 25% of the symbol height. Preserve proportions, the Y opening, speech tails and gradient direction. Do not trace or reconstruct the logo.

The v8 PDF/logo bundle was not found in the repository or the narrowly searched local Downloads/Documents filenames. The older source ZIP contains earlier artwork. Existing logo SVGs, star artwork, favicon and social-image marks are preserved pending delivery of the authentic v8 assets. This is an implementation checkpoint, not a complete or publishable rebrand.

No authentication, database, security policy or account configuration changes are part of this refresh. Production publication requires the independent review gate coordinated by the parent task.
