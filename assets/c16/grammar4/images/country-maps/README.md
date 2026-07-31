# C16 country map assets

These learner-facing maps combine exact administrative geometry with generated
terrain texture. The generated texture is clipped to the source silhouette and
the source boundary lines are rendered again on top. Labels and pins remain in
HTML so they can be updated, filtered, and read by assistive technology.

Run `scripts/build-c16-country-maps.js` with the workspace `sharp` dependency to
rebuild the four WebP files from the retained sources.

## Sources and licenses

- `mongolia-region-map.webp`
  - Geometry: Egzs, [Blank provincial map of Mongolia](https://commons.wikimedia.org/wiki/File:Blank_provincial_map_of_Mongolia.svg)
  - License: CC0 1.0
- `kazakhstan-region-map.webp`
  - Geometry: Incall, [Blank map of Kazakhstan](https://commons.wikimedia.org/wiki/File:Blank_map_of_Kazakhstan.svg)
  - License: CC BY-SA 4.0
  - This adapted map is provided under CC BY-SA 4.0.
- `syria-region-map.webp`
  - Geometry: Siirski, [Blank Syria map](https://commons.wikimedia.org/wiki/File:Blank_Syria_map.svg)
  - License: CC BY-SA 4.0
  - This adapted map is provided under CC BY-SA 4.0.
- `thailand-region-map.webp`
  - Geometry: NordNordWest and Pratchhemapanpairo,
    [Thailand provinces th](https://commons.wikimedia.org/wiki/File:Thailand_provinces_th.svg)
  - License: CC0 1.0

## Image generation

Mode: built-in ImageGen, reference-image edit.

Shared prompt structure:

> Use case: scientific-educational. Preserve the exact country silhouette,
> every internal administrative boundary, canvas composition, and margins from
> the supplied reference. Repaint only the country interior as a refined,
> softly illustrated topographic relief map. Keep boundaries readable and
> understated. Use a clean modern educational-atlas style with subtle
> watercolor-gouache texture and high legibility behind interactive HTML pins.
> Do not add text, labels, numbers, symbols, flags, pins, roads, a legend,
> compass, scale bar, title, frame, decoration, or watermark.

Country-specific terrain directions:

- Mongolia: northern sage and pine, western dusty mountain ridges, southern
  ochre Gobi, restrained blue-green water.
- Kazakhstan: golden and sage steppe, southern and western desert, Caspian blue
  in the west, snow-dusted relief in the southeast and east.
- Syria: Mediterranean green in the western belt, limestone beige and olive in
  the interior, ochre and rose-sand desert, a restrained Euphrates corridor;
  no conflict imagery.
- Thailand: misty northern mountains, central rice-field greens and river blue,
  tropical eastern and northeastern greens, turquoise southern coastal hints.
