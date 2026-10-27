import { expect, test } from '@playwright/test';
import { apiLogin, apiRequest, uniqueSuffix } from './support/api';

// recorrido completo de un usuario nuevo: se registra, recomienda, edita, guarda favoritos y se da de baja
test.describe.serial('Usuario registrado', () => {
  const suffix = uniqueSuffix();
  const user = { nickname: `e2e${suffix}`.slice(0, 30), email: `e2e${suffix}@test.com`, password: 'secreta123' };
  let placeName = '';

  // red de seguridad: si algún paso falla, la cuenta de prueba se borra igual (con sus recomendaciones y favoritos)
  test.afterAll(async () => {
    try {
      const token = await apiLogin(user.email, user.password);
      await apiRequest('DELETE', '/users/me', token);
    } catch { /* la cuenta ya fue eliminada por el propio test */ }
  });

  test('se registra y queda con la sesión iniciada', async ({ page }) => {
    await page.goto('/register');
    await page.getByLabel('Nombre de usuario').fill(user.nickname);
    await page.getByLabel('Email').fill(user.email);
    await page.getByLabel('Contraseña').fill(user.password);
    await page.getByRole('button', { name: 'Crear cuenta' }).click();

    await expect(page).toHaveURL('/');
    await expect(page.getByRole('button', { name: `Cuenta de ${user.nickname}` })).toBeVisible();
  });

  test('no puede registrarse dos veces con el mismo email', async ({ page }) => {
    await page.goto('/register');
    await page.getByLabel('Nombre de usuario').fill('otronombre');
    await page.getByLabel('Email').fill(user.email);
    await page.getByLabel('Contraseña').fill(user.password);
    await page.getByRole('button', { name: 'Crear cuenta' }).click();
    await expect(page.getByRole('alert')).toContainText('El email ya está registrado');
  });

  test('recomienda un lugar, la edita y la borra', async ({ page }) => {
    await login(page);
    await page.locator('app-place-card').first().click();
    placeName = (await page.getByRole('heading', { level: 1 }).innerText()).trim();

    // crear: 4 estrellas con opinión
    await page.getByRole('radio', { name: '4 estrellas' }).click();
    await page.getByPlaceholder('¿Qué te pareció este lugar?').fill('Muy lindo para ir con amigos');
    await page.getByRole('button', { name: 'Publicar recomendación' }).click();
    const mine = page.locator('.rec-item.mine');
    await expect(mine).toContainText('Muy lindo para ir con amigos');
    await expect(mine.getByLabel('4 de 5 estrellas')).toBeVisible();
    // ya recomendó: el formulario de alta desaparece
    await expect(page.getByRole('button', { name: 'Publicar recomendación' })).toBeHidden();

    // editar: pasa a 5 estrellas
    await mine.getByRole('button', { name: 'Editar' }).click();
    await page.getByRole('radio', { name: '5 estrellas' }).click();
    await page.getByRole('button', { name: 'Guardar cambios' }).click();
    await expect(page.locator('.rec-item.mine').getByLabel('5 de 5 estrellas')).toBeVisible();

    // borrar con confirmación
    await page.locator('.rec-item.mine').getByRole('button', { name: 'Eliminar' }).click();
    await page.locator('.rec-item.mine').getByRole('button', { name: 'Sí' }).click();
    await expect(page.locator('.rec-item.mine')).toHaveCount(0);
    await expect(page.getByRole('button', { name: 'Publicar recomendación' })).toBeVisible();
  });

  test('guarda un lugar en favoritos y lo quita desde "Mis favoritos"', async ({ page }) => {
    await login(page);
    await page.getByText(placeName, { exact: true }).click();
    await page.getByRole('button', { name: 'Guardar en favoritos' }).click();
    await expect(page.getByRole('button', { name: 'Quitar de favoritos' })).toBeVisible();

    await page.goto('/favorites');
    const card = page.locator('app-place-card', { hasText: placeName });
    await expect(card).toBeVisible();
    await card.getByRole('button', { name: 'Quitar de favoritos' }).click();
    await expect(page.getByText('Todavía no tenés favoritos')).toBeVisible();
  });

  test('edita su perfil', async ({ page }) => {
    await login(page);
    await page.goto('/profile');
    await page.getByRole('button', { name: 'Editar perfil' }).click();
    await page.getByLabel('Bio').fill('Fan de los atardeceres en la costanera');
    await page.getByLabel('Ubicación').fill('Rosario');
    await page.getByRole('button', { name: 'Guardar cambios' }).click();

    await expect(page.getByText('Fan de los atardeceres en la costanera')).toBeVisible();
    await expect(page.locator('.info-row', { hasText: 'Ubicación' })).toContainText('Rosario');
  });

  test('no puede entrar al panel de administración', async ({ page }) => {
    await login(page);
    await page.goto('/admin');
    await expect(page).toHaveURL('/');
  });

  test('se da de baja y ya no puede iniciar sesión', async ({ page }) => {
    await login(page);
    await page.goto('/profile');
    await page.getByRole('button', { name: 'Eliminar mi cuenta' }).click();
    await page.getByRole('button', { name: 'Sí, eliminar' }).click();
    await expect(page).toHaveURL('/');

    await page.goto('/login');
    await page.getByLabel('Email').fill(user.email);
    await page.getByLabel('Contraseña').fill(user.password);
    await page.getByRole('button', { name: 'Ingresar' }).last().click();
    await expect(page.getByRole('alert')).toContainText('Credenciales inválidas');
  });

  async function login(page: import('@playwright/test').Page) {
    await page.goto('/login');
    await page.getByLabel('Email').fill(user.email);
    await page.getByLabel('Contraseña').fill(user.password);
    await page.locator('form').getByRole('button', { name: 'Ingresar' }).click();
    await expect(page).toHaveURL('/');
  }
});
