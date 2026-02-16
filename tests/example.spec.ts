import { expect, test } from '@playwright/test';

const LOGIN_URL = 'https://testing.recorvet.com/login';
const EMAIL = 'diego@pixeling.co';
const PASSWORD = 'password';

test.describe('Login en testing.recorvet.com', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(LOGIN_URL);
  });

  test('debe iniciar sesión correctamente con credenciales válidas', async ({ page }) => {
    // Campo email: por placeholder, label o type
    const emailInput = page
      .getByPlaceholder(/email|correo|e-mail/i)
      .or(page.getByLabel(/email|correo|e-mail/i))
      .or(page.locator('input[type="email"]'))
      .first();
    await emailInput.waitFor({ state: 'visible', timeout: 10000 });
    await emailInput.fill(EMAIL);

    // Campo contraseña
    const passwordInput = page
      .getByPlaceholder(/password|contraseña|clave/i)
      .or(page.getByLabel(/password|contraseña|clave/i))
      .or(page.locator('input[type="password"]'))
      .first();
    await passwordInput.fill(PASSWORD);

    // Botón de envío (la página usa "Ingresar")
    await page.getByRole('button', { name: /ingresar|iniciar sesión/i }).click();

    // Esperar navegación post-login (evitar networkidle: suele no cumplirse en SPAs)
    await expect(page).not.toHaveURL(/\/login/, { timeout: 15000 });

    // Verificación: tras login correcto la URL ya no debe ser la de login
    const currentUrl = page.url();
    expect(currentUrl).not.toContain('/login');

    // Ir a /home
    await page.goto('https://testing.recorvet.com/home');
    await page.waitForLoadState('networkidle');
    await expect(page).toHaveURL(/\/home/);

    // Buscar y hacer clic en "Pacientes" en el menú
    await page.getByRole('link', { name: /pacientes/i }).first().click();
    await page.waitForLoadState('networkidle');

    // Buscar paciente "maximus"
    const searchInput = page.getByPlaceholder(/buscar|search/i).or(
      page.getByRole('searchbox')
    ).or(page.locator('input[type="search"]')).first();
    await searchInput.waitFor({ state: 'visible', timeout: 10000 });
    await searchInput.fill('maximus');

    // Esperar a que se aplique el filtro y aparezcan resultados
    await page.waitForLoadState('networkidle');
    await page.getByText('maximus', { exact: false }).first().waitFor({ state: 'visible', timeout: 15000 });

    // Clic en el nombre del paciente
    await page.getByRole('link', { name: /maximus/i }).or(
      page.getByText('maximus', { exact: false }).first()
    ).first().click();
    await page.waitForLoadState('networkidle');

    // Clic en "Nuevo evento"
    await page.getByRole('button', { name: /nuevo evento/i })
      .or(page.getByRole('link', { name: /nuevo evento/i }))
      .first()
      .click();
    await page.waitForLoadState('networkidle');
  });
});
