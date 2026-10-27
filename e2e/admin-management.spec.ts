import { expect, test } from '@playwright/test';
import { adminCredentials, apiLogin, apiRequest, uniqueSuffix } from './support/api';

// CUU del administrador: crea una categoría y un lugar, lo edita y lo elimina
test.describe.serial('Administrador', () => {
  const suffix = uniqueSuffix();
  const categoryName = `E2E Categoría ${suffix}`;
  const placeName = `E2E Lugar ${suffix}`;

  // limpieza por API por si algún paso falla a mitad de camino
  test.afterAll(async () => {
    const { email, password } = adminCredentials();
    const token = await apiLogin(email, password);
    const places = await apiRequest<Array<{ id: number; name: string }>>('GET', '/places?search=E2E%20Lugar%20' + suffix);
    for (const place of places) await apiRequest('DELETE', `/places/${place.id}`, token);
    const categories = await apiRequest<Array<{ id: number; name: string }>>('GET', '/categories');
    for (const c of categories.filter((c) => c.name === categoryName)) await apiRequest('DELETE', `/categories/${c.id}`, token);
  });

  test.beforeEach(async ({ page }) => {
    const { email, password } = adminCredentials();
    await page.goto('/login');
    await page.getByLabel('Email').fill(email);
    await page.getByLabel('Contraseña').fill(password);
    await page.locator('form').getByRole('button', { name: 'Ingresar' }).click();
    await expect(page).toHaveURL('/');
    await page.goto('/admin');
    await expect(page.getByRole('heading', { name: 'Panel de Administración' })).toBeVisible();
  });

  test('crea una categoría', async ({ page }) => {
    await page.getByRole('tab', { name: 'Categorías' }).click();
    await page.getByRole('button', { name: '+ Nueva categoría' }).click();
    await page.getByLabel('Nombre *').fill(categoryName);
    await page.getByLabel('Descripción').fill('Creada por un test e2e');
    await page.getByRole('button', { name: 'Crear categoría' }).click();

    await expect(page.getByText('Categoría creada')).toBeVisible();
    await expect(page.locator('tr', { hasText: categoryName })).toBeVisible();
  });

  test('crea un lugar con ubicación en esa categoría y aparece en el listado público', async ({ page }) => {
    await page.getByRole('button', { name: '+ Nuevo lugar' }).click();
    await page.getByLabel('Nombre *').fill(placeName);
    await page.getByLabel('Categoría *').selectOption({ label: categoryName });
    await page.getByLabel('Dirección').fill('Bv. Oroño 1000, Rosario');
    await page.getByLabel('Latitud').fill('-32.9442');
    await page.getByLabel('Longitud').fill('-60.6505');
    await page.getByRole('button', { name: 'Crear lugar' }).click();
    await expect(page.getByText('Lugar creado')).toBeVisible();

    // el visitante lo encuentra filtrando por la categoría nueva
    await page.goto('/');
    await page.locator('.pill', { hasText: categoryName }).click();
    await expect(page.locator('app-place-card')).toHaveCount(1);
    await expect(page.locator('app-place-card')).toContainText(placeName);
    await expect(page.locator('app-place-card')).toContainText('Sin reseñas todavía');
  });

  test('valida los campos obligatorios al crear un lugar', async ({ page }) => {
    await page.getByRole('button', { name: '+ Nuevo lugar' }).click();
    await page.getByRole('button', { name: 'Crear lugar' }).click();
    await expect(page.getByText('El nombre y la categoría son obligatorios')).toBeVisible();
  });

  test('edita el lugar', async ({ page }) => {
    const row = page.locator('tr', { hasText: placeName });
    await row.getByRole('button', { name: 'Editar lugar' }).click();
    await page.getByLabel('Descripción').fill('Descripción editada por e2e');
    await page.getByRole('button', { name: 'Guardar cambios' }).click();
    await expect(page.getByText('Lugar actualizado')).toBeVisible();
  });

  test('no deja borrar una categoría que tiene lugares', async ({ page }) => {
    await page.getByRole('tab', { name: 'Categorías' }).click();
    const row = page.locator('tr', { hasText: categoryName });
    await row.getByRole('button', { name: 'Eliminar categoría' }).click();
    await row.getByRole('button', { name: 'Sí' }).click();
    await expect(page.getByText(/No se puede eliminar: la categoría tiene 1 lugar/)).toBeVisible();
    await expect(row).toBeVisible();
  });

  test('borra el lugar y después la categoría vacía', async ({ page }) => {
    const placeRow = page.locator('tr', { hasText: placeName });
    await placeRow.getByRole('button', { name: 'Eliminar lugar' }).click();
    await placeRow.getByRole('button', { name: 'Sí' }).click();
    await expect(page.getByText('Lugar eliminado')).toBeVisible();
    await expect(placeRow).toHaveCount(0);

    await page.getByRole('tab', { name: 'Categorías' }).click();
    const categoryRow = page.locator('tr', { hasText: categoryName });
    await categoryRow.getByRole('button', { name: 'Eliminar categoría' }).click();
    await categoryRow.getByRole('button', { name: 'Sí' }).click();
    await expect(page.getByText('Categoría eliminada')).toBeVisible();
    await expect(categoryRow).toHaveCount(0);
  });
});
