import { expect, test } from '@playwright/test';

// recorrido de un visitante sin cuenta: explora, filtra, ve un detalle y no puede entrar a zonas protegidas
test.describe('Visitante sin cuenta', () => {
  test('explora el listado, filtra por categoría y abre el detalle de un lugar', async ({ page }) => {
    await page.goto('/');
    await expect(page.getByRole('heading', { name: 'Descubrí lugares increíbles' })).toBeVisible();

    const cards = page.locator('app-place-card');
    await expect(cards.first()).toBeVisible();

    // filtra por la primera categoría real (después de "Todos") y verifica que todas las cards sean de esa categoría
    const categoryPill = page.locator('.filtros-scroll .pill').nth(1);
    const categoryName = (await categoryPill.innerText()).trim();
    await categoryPill.click();
    await expect(categoryPill).toHaveClass(/activa/);
    for (const pill of await page.locator('app-place-card .category-pill').all()) {
      await expect(pill).toHaveText(categoryName);
    }

    // abre el detalle: un invitado puede verlo, pero para recomendar tiene que iniciar sesión
    await page.locator('.filtros-scroll .pill').first().click();
    const firstName = (await cards.first().locator('.card-title').innerText()).trim();
    await cards.first().click();
    await expect(page).toHaveURL(/\/places\/\d+$/);
    await expect(page.getByRole('heading', { level: 1 })).toHaveText(firstName);
    await expect(page.getByText('para recomendar este lugar')).toBeVisible();
  });

  test('la búsqueda sin resultados muestra el estado vacío', async ({ page }) => {
    await page.goto('/');
    await page.getByLabel('Buscar lugares').fill('zzz-lugar-que-no-existe');
    await expect(page.getByText('No encontramos lugares con ese filtro.')).toBeVisible();
  });

  test('las rutas protegidas redirigen al login', async ({ page }) => {
    await page.goto('/admin');
    await expect(page).toHaveURL(/\/login\?returnUrl=%2Fadmin$/);

    await page.goto('/favorites');
    await expect(page).toHaveURL(/\/login\?returnUrl=%2Ffavorites$/);
  });
});
