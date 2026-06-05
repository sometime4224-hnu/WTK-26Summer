# Vocabulary Translation Review

Date: 2026-06-05

## Scope

- Pages: `c10/vocabulary.html` through `c18/vocabulary.html`
- Total vocabulary items: 200
- Base language: Korean
- Standard support languages: English, Vietnamese, Mongolian, Arabic, Kazakh, Thai
- Excluded from this pass: listening pages and vocabulary subpage redesign work

## Completion Criteria

- Reviewed vocabulary glosses one language at a time.
- Corrected unnatural or semantically mismatched glosses in `shared/vocabulary-multilang-data.js`.
- Restored page wiring so the vocabulary pages load the shared multilingual data before rendering cards.
- Standardized vocabulary page rendering to the six support languages.
- Applied RTL direction only where needed for Arabic cards, list cells, and meaning quiz options.
- Verified no missing standard-language vocabulary data after runtime merge.
- Verified all c10-c18 vocabulary pages in the browser with no detected button, card, list, quiz, RTL, or overflow errors.

## Translation Corrections

Corrected translation fields: 59

English:

- `c10-vocab-05`, `c10-vocab-17`
- `c11-vocab-25`
- `c13-vocab-01`, `c13-vocab-09`
- `c14-vocab-09`, `c14-vocab-27`, `c14-vocab-28`
- `c15-vocab-01`
- `c16-vocab-15`
- `c17-vocab-05`, `c17-vocab-06`, `c17-vocab-08`, `c17-vocab-16`
- `c18-vocab-07`, `c18-vocab-15`

Vietnamese:

- `c10-vocab-02`, `c10-vocab-11`
- `c11-vocab-07`, `c11-vocab-10`, `c11-vocab-19`, `c11-vocab-20`, `c11-vocab-24`
- `c12-vocab-09`
- `c15-vocab-25`
- `c16-vocab-02`, `c16-vocab-05`
- `c17-vocab-16`
- `c18-vocab-09`

Mongolian:

- `c10-vocab-12`
- `c11-vocab-16`, `c11-vocab-20`
- `c14-vocab-09`, `c14-vocab-13`
- `c15-vocab-13`, `c15-vocab-17`, `c15-vocab-22`, `c15-vocab-24`
- `c16-vocab-02`, `c16-vocab-14`, `c16-vocab-16`, `c16-vocab-21`
- `c18-vocab-07`

Arabic:

- `c10-vocab-01`, `c10-vocab-08`
- `c11-vocab-25`
- `c14-vocab-15`
- `c15-vocab-22`
- `c16-vocab-01`, `c16-vocab-02`
- `c18-vocab-07`, `c18-vocab-09`

Kazakh:

- `c10-vocab-08`, `c10-vocab-10`
- `c11-vocab-19`
- `c12-vocab-10`
- `c14-vocab-15`
- `c15-vocab-17`, `c15-vocab-22`
- `c16-vocab-02`, `c16-vocab-16`

Thai:

- `c10-vocab-15`
- `c11-vocab-07`, `c11-vocab-24`
- `c13-vocab-14`
- `c14-vocab-17`
- `c15-vocab-17`, `c15-vocab-24`
- `c16-vocab-03`

## Implementation Notes

- `shared/vocabulary-multilang-data.js` is the source for standard vocabulary multilingual glosses.
- `c10`-`c18` vocabulary pages now load `../shared/vocabulary-multilang-data.js` before the page rendering script.
- `표준안 제작/templates/vocabulary.html` now uses the same standard language set and rendering behavior.
- `scripts/upgrade-vocabulary-pages.js` now preserves the standard language list instead of deriving it from legacy inline `vi/ja/zh` data.
- Existing Japanese and Chinese inline fields may remain in historical page data, but they are not exposed by the current standard language UI.

## Verification

- `node --check shared/vocabulary-multilang-data.js`: pass
- `node --check shared/multilang-toggle.js`: pass
- `node --check scripts/upgrade-vocabulary-pages.js`: pass
- Runtime data merge: 200 vocabulary items, 6 standard languages, missing data 0
- Browser audit: c10-c18 vocabulary pages, errors 0

