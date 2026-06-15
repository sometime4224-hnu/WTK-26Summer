# C10 Reading Source Audit

- Source checked: `서울대 한국어 3B SB.pdf`, PDF page 36, book page 36.
- Section: 10과 `읽고 쓰기 | Reading and Writing`.
- Passage title: `김영희의 연애 칼럼`.
- Extracted passage location: `c10/reading.html` main reading section.
- Current sentence-cut data location: `c10/writing-cut-split-data.js`.
- Legacy integrated activity location: `c10/_backup/20260611-writing-cut-legacy/`.

## Result

- Compared the page image from the original SB with the current C10 reading page.
- Corrected one missing source phrase in `c10/reading.html`: the first paragraph now includes `사랑에도` before `유통 기한`.
- The writing-cut data already included that phrase and did not need changes. The current production activity now reads the split data file.
