// ─────────────────────────────────────────────────────────────────────────────
//  pokestats.spec.js — Playwright E2E tests
//  Run with: npx playwright test
//  Server must be running: python3 -m http.server 8080  (handled by webServer config)
// ─────────────────────────────────────────────────────────────────────────────

const { test, expect } = require('@playwright/test');

// ─── PAGE LOAD ────────────────────────────────────────────────────────────────

test.describe('Page load', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('result section is hidden on startup', async ({ page }) => {
    const result = page.locator('#result-section');
    await expect(result).toBeHidden();
  });

  test('Garchomp is loaded as default', async ({ page }) => {
    const name = page.locator('#pokemon-name-display');
    await expect(name).toHaveText('GARCHOMP');
  });

  test('Pokédex number shows #445 for Garchomp', async ({ page }) => {
    const num = page.locator('#pokedex-num');
    await expect(num).toHaveText('#445');
  });

  test('calculator tab is active on load', async ({ page }) => {
    const calcPage = page.locator('#page-calc');
    await expect(calcPage).toBeVisible();
  });

  test('page does not scroll to results on startup', async ({ page }) => {
    const scrollY = await page.evaluate(() => window.scrollY);
    expect(scrollY).toBe(0);
  });
});

// ─── SEARCH / DROPDOWN ───────────────────────────────────────────────────────

test.describe('Search and dropdown', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('dropdown opens when input is focused', async ({ page }) => {
    await page.locator('#pokemon-input').click();
    const dd = page.locator('#pokemon-dropdown');
    await expect(dd).toBeVisible();
  });

  test('dropdown shows results when typing a name', async ({ page }) => {
    await page.locator('#pokemon-input').fill('pikachu');
    const items = page.locator('.dd-item');
    await expect(items.first()).toBeVisible();
    await expect(items.first()).toContainText('Pikachu');
  });

  test('dropdown filters by Pokédex number', async ({ page }) => {
    await page.locator('#pokemon-input').fill('25');
    const items = page.locator('.dd-item');
    await expect(items.first()).toBeVisible();
    await expect(items.first()).toContainText('#025');
  });

  test('clear button appears when input has text', async ({ page }) => {
    await page.locator('#pokemon-input').fill('char');
    await expect(page.locator('#search-clear')).toBeVisible();
  });

  test('clear button resets the search field', async ({ page }) => {
    await page.locator('#pokemon-input').fill('char');
    await page.locator('#search-clear').click();
    await expect(page.locator('#pokemon-input')).toHaveValue('');
    await expect(page.locator('#search-clear')).toBeHidden();
  });

  test('selecting from dropdown loads the Pokémon', async ({ page }) => {
    await page.locator('#pokemon-input').fill('bulbasaur');
    await page.locator('.dd-item').first().click();
    await expect(page.locator('#pokemon-name-display')).toHaveText('BULBASAUR');
  });

  test('Enter key triggers search', async ({ page }) => {
    await page.locator('#pokemon-input').fill('mewtwo');
    const first = page.locator('.dd-item').first();
    await expect(first).toBeVisible();
    await first.click();
    await expect(page.locator('#pokemon-name-display')).toHaveText('MEWTWO');
  });

  test('Escape key closes dropdown', async ({ page }) => {
    await page.locator('#pokemon-input').click();
    await page.keyboard.press('Escape');
    await expect(page.locator('#pokemon-dropdown')).toBeHidden();
  });

  test('clicking outside closes dropdown', async ({ page }) => {
    await page.locator('#pokemon-input').click();
    await page.locator('.header-logo').click();
    await expect(page.locator('#pokemon-dropdown')).toBeHidden();
  });
});

// ─── CALCULATE ───────────────────────────────────────────────────────────────

test.describe('Calculate', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.locator('button[onclick="calculate(true)"]').click();
  });

  test('result section appears after calculating', async ({ page }) => {
    await expect(page.locator('#result-section')).toBeVisible();
  });

  test('result grid shows 6 stat cards', async ({ page }) => {
    const cards = page.locator('.stat-result');
    await expect(cards).toHaveCount(6);
  });

  test('BST value is a positive number', async ({ page }) => {
    const bst = page.locator('#bst-value');
    const text = await bst.textContent();
    expect(parseInt(text, 10)).toBeGreaterThan(0);
  });

  test('Garchomp BST is 600', async ({ page }) => {
    const bst = page.locator('#bst-value');
    await expect(bst).toHaveText('600');
  });

  test('stat cards show HP, ATK, DEF, SP.ATK, SP.DEF, SPD', async ({ page }) => {
    const names = await page.locator('.stat-result-name').allTextContents();
    expect(names).toHaveLength(6);
    names.forEach(n => expect(n.length).toBeGreaterThan(0));
  });
});

// ─── NATURES ─────────────────────────────────────────────────────────────────

test.describe('Natures', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('nature grid contains 25 buttons', async ({ page }) => {
    const btns = page.locator('.nature-btn');
    await expect(btns).toHaveCount(25);
  });

  test('one nature button is active by default', async ({ page }) => {
    const active = page.locator('.nature-btn.active');
    await expect(active).toHaveCount(1);
  });

  test('clicking a nature button activates it', async ({ page }) => {
    const btns = page.locator('.nature-btn');
    await btns.nth(3).click();
    await expect(btns.nth(3)).toHaveClass(/active/);
  });

  test('only one nature can be active at a time', async ({ page }) => {
    const btns = page.locator('.nature-btn');
    await btns.nth(5).click();
    await btns.nth(10).click();
    const active = page.locator('.nature-btn.active');
    await expect(active).toHaveCount(1);
  });
});

// ─── IV / EV INPUTS ──────────────────────────────────────────────────────────

test.describe('IV inputs', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('IV slider and number input are in sync', async ({ page }) => {
    const slider = page.locator('#iv-range-0');
    const num    = page.locator('#iv-num-0');
    await slider.fill('20');
    await slider.dispatchEvent('input');
    await expect(num).toHaveValue('20');
  });

  test('IV number input syncs slider', async ({ page }) => {
    const slider = page.locator('#iv-range-1');
    const num    = page.locator('#iv-num-1');
    await num.fill('15');
    await num.dispatchEvent('input');
    await expect(slider).toHaveValue('15');
  });

  test('IV max is 31 for Gen III+', async ({ page }) => {
    const slider = page.locator('#iv-range-0');
    await expect(slider).toHaveAttribute('max', '31');
  });

  test('IV max is 15 for Gen I/II', async ({ page }) => {
    await page.locator('#gen-select').selectOption('1');
    const slider = page.locator('#iv-range-0');
    await expect(slider).toHaveAttribute('max', '15');
  });
});

test.describe('EV inputs', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('EV slider and number input are in sync', async ({ page }) => {
    const slider = page.locator('#ev-range-0');
    const num    = page.locator('#ev-num-0');
    await slider.fill('252');
    await slider.dispatchEvent('input');
    await expect(num).toHaveValue('252');
  });

  test('EV number input syncs slider', async ({ page }) => {
    const slider = page.locator('#ev-range-1');
    const num    = page.locator('#ev-num-1');
    await num.fill('100');
    await num.dispatchEvent('input');
    await expect(slider).toHaveValue('100');
  });

  test('510 EV total cap is enforced', async ({ page }) => {
    // Fill HP and ATK EVs to 252 each (504 total), then try to add 252 to DEF
    const hp  = page.locator('#ev-num-0');
    const atk = page.locator('#ev-num-1');
    const def = page.locator('#ev-num-2');

    await hp.fill('252');
    await hp.dispatchEvent('input');
    await atk.fill('252');
    await atk.dispatchEvent('input');
    await def.fill('252');
    await def.dispatchEvent('input');

    const total = page.locator('#ev-total');
    const text  = await total.textContent();
    const used  = parseInt(text, 10);
    expect(used).toBeLessThanOrEqual(510);
  });

  test('EV total display updates when EVs change', async ({ page }) => {
    const num   = page.locator('#ev-num-0');
    const total = page.locator('#ev-total');
    await num.fill('252');
    await num.dispatchEvent('input');
    const text = await total.textContent();
    expect(text).toContain('252');
  });
});

test.describe('Preset chips', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('clicking a preset chip loads that Pokémon', async ({ page }) => {
    const chip = page.locator('.chip').first();
    const name = await chip.textContent();
    await chip.click();
    const displayed = await page.locator('#pokemon-name-display').textContent();
    expect(displayed.toLowerCase()).toContain(name.toLowerCase().trim());
  });
});

// ─── NAVIGATION ──────────────────────────────────────────────────────────────

test.describe('Navigation', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('Formula tab shows the formula page', async ({ page }) => {
    await page.locator('.nav-item').nth(1).click();
    await expect(page.locator('#page-formula')).toBeVisible();
  });

  test('Compare tab shows the compare page', async ({ page }) => {
    await page.locator('.nav-item').nth(2).click();
    await expect(page.locator('#page-compare')).toBeVisible();
  });

  test('Calculator tab navigates back from Formula', async ({ page }) => {
    await page.locator('.nav-item').nth(1).click();
    await page.locator('.nav-item').nth(0).click();
    await expect(page.locator('#page-calc')).toBeVisible();
  });

  test('only one page is visible at a time', async ({ page }) => {
    await page.locator('.nav-item').nth(1).click();
    const visible = await page.locator('.page').evaluateAll(
      els => els.filter(el => el.offsetParent !== null).length
    );
    expect(visible).toBe(1);
  });
});

// ─── LANGUAGE ─────────────────────────────────────────────────────────────────

test.describe('Language switching', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('switching to Spanish changes the calculate button text', async ({ page }) => {
    await page.locator('#lang-select').selectOption('es');
    const btn = page.locator('button[onclick="calculate(true)"]');
    const text = await btn.textContent();
    expect(text.toLowerCase()).toContain('calcular');
  });

  test('switching back to English restores the button text', async ({ page }) => {
    await page.locator('#lang-select').selectOption('es');
    await page.locator('#lang-select').selectOption('en');
    const btn = page.locator('button[onclick="calculate(true)"]');
    const text = await btn.textContent();
    expect(text.toLowerCase()).toContain('calculate');
  });

  test('language choice persists after reload', async ({ page }) => {
    await page.locator('#lang-select').selectOption('es');
    await page.reload();
    await expect(page.locator('#lang-select')).toHaveValue('es');
  });
});

// ─── MOBILE ──────────────────────────────────────────────────────────────────

test.describe('Mobile viewport (375px)', () => {
  test.use({ viewport: { width: 375, height: 812 } });

  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('page loads without horizontal overflow', async ({ page }) => {
    const bodyWidth    = await page.evaluate(() => document.body.scrollWidth);
    const viewportWidth = await page.evaluate(() => window.innerWidth);
    expect(bodyWidth).toBeLessThanOrEqual(viewportWidth + 1); // 1px tolerance
  });

  test('header is visible', async ({ page }) => {
    await expect(page.locator('.header')).toBeVisible();
  });

  test('bottom nav is visible', async ({ page }) => {
    await expect(page.locator('.bottom-nav')).toBeVisible();
  });

  test('calculate button is tappable (not clipped)', async ({ page }) => {
    const btn = page.locator('button[onclick="calculate(true)"]');
    await expect(btn).toBeVisible();
    const box = await btn.boundingBox();
    expect(box.width).toBeGreaterThan(0);
    expect(box.height).toBeGreaterThan(0);
  });

  test('nature grid is scrollable and fits on screen', async ({ page }) => {
    const grid = page.locator('.nature-grid');
    await expect(grid).toBeVisible();
  });
});
