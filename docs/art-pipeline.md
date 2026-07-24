# Stage 3.2 Art Pipeline

The current Stage 3.2 pass establishes a local raster pipeline with original provisional PNG placeholders. The selected direction is stylized dark-fantasy 2.5D painted placeholder art, not pixel art, so the renderer keeps linear filtering rather than `pixelArt: true`.

## Asset rules

- Runtime art loads from local `assets/` paths only.
- `assets/ATTRIBUTION.md` documents provenance; this pass uses only generated original placeholders.
- Phaser Graphics is allowed for debug/collision tooling only, not normal gameplay art.
- The logical tile size is 64 px; actors use 128 px frames with origins near the feet.

## Provisional asset list

- Kael dual-wield spritesheet and portrait.
- Corrupted Soldier spritesheet.
- Stone Brute spritesheet.
- Asteria tilemap and tileset.
- Props, shadows, telegraphs, sword effects, and status effects sheets.
- HUD, selector, skill icon, and missing-texture PNGs.

These assets are coherent placeholders and are not final production art.

## Binary-free PR workflow

The generated PNG files and copied runtime JSON files are local runtime artifacts under `public/assets/`, not tracked Git files, because this PR environment rejects binary files. Run `npm run assets:generate` manually if assets are missing; `postinstall`, `predev`, `pretest`, and `prebuild` also regenerate them automatically. Source atlas JSON, tilemap JSON, manifest metadata, and the generator script remain versioned as text under `assets/` and `src/`.
