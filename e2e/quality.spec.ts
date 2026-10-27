import { expect, test } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import { adminCredentials, apiLogin } from './support/api';

const PUBLIC_PAGES = ['/', '/login', '/register'];

// controles de calidad transversales: accesibilidad, responsive, errores de consola y navegación
test.describe('Calidad', () => {
  for (const path of PUBLIC_PAGES) {
    test(`${path} no tiene problemas de accesibilidad graves (WCAG 2.1 AA)`, async ({ page }) => {
      await page.goto(path);
      await page.waitForLoadState('networkidle');
      const { violations } = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag21aa']).analyze();
      const serious = violations.filter((v) => ['serious', 'critical'].includes(v.impact ?? ''));
      expect(serious.map((v) => `${v.id}: ${v.help} (${v.nodes.length})`)).toEqual([]);
    });
  }

  test('en modo oscuro el inicio mantiene el contraste', async ({ page }) => {
    await page.addInitScript(() => localStorage.setItem('discoverit_theme', 'dark'));
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    const { violations } = await new AxeBuilder({ page }).withTags(['wcag2aa']).analyze();
    expect(violations.filter((v) => ['serious', 'critical'].includes(v.impact ?? '')).map((v) => v.id)).toEqual([]);
  });

  for (const path of ['/admin', '/profile', '/favorites']) {
    test(`${path} (como admin) no tiene problemas de accesibilidad graves`, async ({ page }) => {
      const { email, password } = adminCredentials();
      const token = await apiLogin(email, password);
      const user = await (await fetch('http://localhost:3000/api/users/me', { headers: { Authorization: `Bearer ${token}` } })).json();
      await page.addInitScript(([t, u]) => {
        localStorage.setItem('discoverit_token', t);
        localStorage.setItem('discoverit_user', u);
      }, [token, JSON.stringify({ id: user.id, nickname: user.nickname, email: user.email, isAdmin: user.isAdmin })]);
      await page.goto(path);
      await page.waitForLoadState('networkidle');
      const { violations } = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa']).analyze();
      const serious = violations.filter((v) => ['serious', 'critical'].includes(v.impact ?? ''));
      expect(serious.map((v) => `${v.id}: ${v.nodes.map((n) => n.target.join(' ')).slice(0, 3).join(', ')}`)).toEqual([]);
    });
  }

  test('el detalle de un lugar no tiene problemas de accesibilidad graves', async ({ page }) => {
    await page.goto('/');
    await page.locator('app-place-card').first().click();
    await page.waitForLoadState('networkidle');
    const { violations } = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa']).analyze();
    expect(violations.filter((v) => ['serious', 'critical'].includes(v.impact ?? '')).map((v) => v.id)).toEqual([]);
  });

  for (const path of [...PUBLIC_PAGES, '/places/1']) {
    test(`${path} no se desborda horizontalmente ni tira errores en consola`, async ({ page }) => {
      const errors: string[] = [];
      page.on('console', (m) => m.type() === 'error' && errors.push(m.text()));
      page.on('pageerror', (e) => errors.push(e.message));

      await page.goto(path === '/places/1' ? '/' : path);
      if (path === '/places/1') await page.locator('app-place-card').first().click();
      await page.waitForLoadState('networkidle');

      const overflow = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
      expect(overflow).toBeLessThanOrEqual(0);
      expect(errors).toEqual([]);
    });
  }

  test('recargar una página interna funciona (deep link)', async ({ page }) => {
    await page.goto('/');
    await page.locator('app-place-card').first().click();
    await expect(page).toHaveURL(/\/places\/\d+$/);
    const url = page.url();
    await page.reload();
    await expect(page).toHaveURL(url);
    await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
  });

  test('el mapa carga los tiles y un marcador por lugar con coordenadas', async ({ page }) => {
    await page.goto('/');
    await page.getByTitle('Vista mapa').click();
    await expect(page.locator('.leaflet-tile-loaded').first()).toBeVisible();
    await expect(page.locator('.leaflet-marker-icon').first()).toBeVisible();

    // el popup del marcador lleva al detalle sin recargar la app
    await page.locator('.leaflet-marker-icon').first().click();
    await page.getByRole('link', { name: 'Ver detalle →' }).click();
    await expect(page).toHaveURL(/\/places\/\d+$/);
  });

  test('el modo oscuro se aplica y se recuerda al recargar', async ({ page }) => {
    await page.goto('/');
    await page.getByRole('button', { name: 'Activar modo oscuro' }).click();
    await expect(page.locator('html')).toHaveClass(/dark/);
    await page.reload();
    await expect(page.locator('html')).toHaveClass(/dark/);
  });

  test('el menú lateral se abre y se cierra con Escape', async ({ page }) => {
    await page.goto('/');
    await page.getByLabel('Abrir menú').click();
    await expect(page.locator('.sidebar')).toHaveClass(/open/);
    await page.keyboard.press('Escape');
    await expect(page.locator('.sidebar')).not.toHaveClass(/open/);
  });
});
