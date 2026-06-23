const { test, expect } = require('@playwright/test');

const LANGUAGES = [
  {
    code: 'ko',
    label: '한국어',
    title: '한국어 이유 문법',
    group: '가장 보편적인 이유',
    cardText: '가장 기본적이고 널리 쓰이는 이유 문법',
    search: '직접 경험',
    searchTarget: '-았더니/었더니'
  },
  {
    code: 'en',
    label: 'English',
    title: "Korean Grammar for 'Reason'",
    group: 'Most Common Reasons',
    cardText: "The most basic and widely used grammar",
    search: 'sudden',
    searchTarget: '-는 바람에'
  },
  {
    code: 'vi',
    label: 'Tiếng Việt',
    title: "Ngữ pháp tiếng Hàn chỉ 'Lý do'",
    group: 'Lý do phổ biến nhất',
    cardText: 'Ngữ pháp lý do cơ bản',
    search: 'đột ngột',
    searchTarget: '-는 바람에'
  },
  {
    code: 'ar',
    label: 'العربية',
    title: 'قواعد التعبير عن السبب في الكورية',
    group: 'أكثر صيغ السبب شيوعا',
    cardText: 'أبسط صيغة وأكثرها استعمالا',
    search: 'مفاجئ',
    searchTarget: '-는 바람에'
  },
  {
    code: 'mn',
    label: 'Монгол',
    title: 'Солонгос хэлний шалтгааны дүрэм',
    group: 'Хамгийн түгээмэл шалтгаан',
    cardText: 'Шалтгаан илэрхийлэх хамгийн үндсэн',
    search: 'гэнэтийн',
    searchTarget: '-는 바람에'
  },
  {
    code: 'kk',
    label: 'Қазақша',
    title: 'Корей тіліндегі себеп грамматикасы',
    group: 'Ең жиі қолданылатын себептер',
    cardText: 'Себеп білдіретін ең негізгі',
    search: 'кенет',
    searchTarget: '-는 바람에'
  },
  {
    code: 'th',
    label: 'ไทย',
    title: 'ไวยากรณ์บอกเหตุผลในภาษาเกาหลี',
    group: 'เหตุผลที่ใช้บ่อยที่สุด',
    cardText: 'ไวยากรณ์บอกเหตุผลที่พื้นฐาน',
    search: 'กะทันหัน',
    searchTarget: '-는 바람에'
  },
  {
    code: 'ja',
    label: '日本語',
    title: '韓国語の「理由」文法',
    group: '最も一般的な理由',
    cardText: '最も基本的で広く使われる理由',
    search: '予期せぬ',
    searchTarget: '-는 바람에'
  },
  {
    code: 'zh',
    label: '中文',
    title: '韩语“原因”语法',
    group: '最常见的原因',
    cardText: '最基本、广泛使用的原因语法',
    search: '突发',
    searchTarget: '-는 바람에'
  }
];

async function blockExternalRequests(page) {
  await page.route('https://www.googletagmanager.com/**', (route) => route.abort());
}

async function expectNoHorizontalOverflow(page) {
  const hasOverflow = await page.evaluate(() => (
    document.documentElement.scrollWidth > window.innerWidth + 1
  ));
  expect(hasOverflow).toBe(false);
}

async function selectLanguage(page, lang) {
  const button = page.locator(`.lang-btn[data-lang="${lang.code}"]`);
  await expect(button).toBeVisible();
  await expect(button).toContainText(lang.label);
  await button.click();
  await expect(button).toHaveClass(/active-lang/);
  await expect(page.locator('html')).toHaveAttribute('lang', lang.code);
  await expect(page.locator('body')).toHaveAttribute('data-active-lang', lang.code);
}

test('c12 grammar1 reason page switches all nine languages and searches current-language content', async ({ page }) => {
  await blockExternalRequests(page);
  await page.goto('/c12/grammar1-reason.html', { waitUntil: 'domcontentloaded' });

  await expect(page.locator('.lang-btn')).toHaveCount(9);

  for (const lang of LANGUAGES) {
    await selectLanguage(page, lang);

    await expect(page.locator('#app-title')).toHaveText(lang.title);
    await expect(page.locator('#group1-title')).toHaveText(lang.group);
    await expect(page.locator('.grammar-card')).toHaveCount(12);
    await expect(page.locator('.grammar-card[data-grammar="-아/어서"]')).toContainText(lang.cardText);

    await page.locator('#search-input').fill(lang.search);
    const targetHidden = await page
      .locator(`.grammar-card[data-grammar="${lang.searchTarget}"]`)
      .evaluate((el) => el.classList.contains('hidden'));
    expect(targetHidden).toBe(false);

    const visibleCards = await page.locator('.grammar-card:not(.hidden)').count();
    expect(visibleCards).toBeGreaterThan(0);
    expect(visibleCards).toBeLessThan(12);

    await page.locator('#search-input').fill('');
  }
});

test('c12 grammar1 reason page supports Arabic RTL in cards, modal, and comparison view', async ({ page }) => {
  await blockExternalRequests(page);
  await page.goto('/c12/grammar1-reason.html', { waitUntil: 'domcontentloaded' });
  await selectLanguage(page, LANGUAGES.find((lang) => lang.code === 'ar'));

  await expect(page.locator('html')).toHaveAttribute('dir', 'rtl');
  await expect(page.locator('.grammar-card[data-grammar="-아/어서"] .grammar-token')).toHaveCSS('direction', 'ltr');

  await page.locator('.grammar-card[data-grammar="-아/어서"]').click();
  await expect(page.locator('#grammarModal')).toBeVisible();
  await expect(page.locator('#infoTab')).toContainText('أبسط صيغة');
  await page.locator('.tab-btn[data-tab="examples"]').click();
  await expect(page.locator('#examplesTab')).toContainText('لأن الجو بارد');
  await page.locator('#grammarModal .close-button').click();

  await page.locator('#toggle-compare-mode').click();
  await page.locator('.grammar-card[data-grammar="-아/어서"]').click();
  await page.locator('.grammar-card[data-grammar="-(으)니까"]').click();
  await page.locator('#compare-selected-btn').click();

  await expect(page.locator('#compareModal')).toBeVisible();
  await expect(page.locator('#compareTitle')).toHaveText('جدول مقارنة القواعد');
  await expect(page.locator('#reasonCompareTabs')).toContainText('بطاقات القرار');
  await expect(page.locator('.reason-decision-card').first()).toContainText('هل تحتاج فقط إلى سبب حيادي');
  await page.locator('.reason-compare-tab[data-view="table"]').click();
  await expect(page.locator('#compareContent')).toContainText('القاعدة');
});

test('c12 grammar1 reason multilingual controls avoid horizontal overflow', async ({ page }) => {
  await blockExternalRequests(page);

  for (const viewport of [
    { width: 1280, height: 900 },
    { width: 390, height: 844 }
  ]) {
    await page.setViewportSize(viewport);
    await page.goto('/c12/grammar1-reason.html', { waitUntil: 'domcontentloaded' });

    for (const lang of LANGUAGES) {
      await selectLanguage(page, lang);
      await expect(page.locator('.grammar-card')).toHaveCount(12);
      await expectNoHorizontalOverflow(page);
    }
  }
});
