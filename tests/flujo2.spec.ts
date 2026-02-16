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

    // Ir a /home (evitar networkidle: no se cumple en SPAs)
    await page.goto('https://testing.recorvet.com/home');
    await expect(page).toHaveURL(/\/home/, { timeout: 300000 });

    // Buscar y hacer clic en "Pacientes" en el menú
    await page.getByRole('link', { name: /pacientes/i }).first().click();
    await expect(page).toHaveURL(/paciente/, { timeout: 300000 });

    // Buscar paciente "maximus"
    const searchInput = page.getByPlaceholder(/buscar|search/i).or(
      page.getByRole('searchbox')
    ).or(page.locator('input[type="search"]')).first();
    await searchInput.waitFor({ state: 'visible', timeout: 10000 });
    await searchInput.fill('maximus');

    // Esperar a que se aplique el filtro y aparezcan resultados
    await page.getByText('maximus', { exact: false }).first().waitFor({ state: 'visible', timeout: 15000 });

    // Clic en el nombre del paciente
    await page.getByRole('link', { name: /maximus/i }).or(
      page.getByText('maximus', { exact: false }).first()
    ).first().click();

    // Esperar a que cargue el perfil y desaparezcan los overlays de carga (evitan el clic)
    await page.getByRole('link', { name: /nuevo evento/i }).waitFor({ state: 'visible', timeout: 15000 });
    await page.locator('#page_overlay').waitFor({ state: 'hidden', timeout: 150000 }).catch(() => {});
    await page.locator('#holdon-overlay').waitFor({ state: 'hidden', timeout: 100000 }).catch(() => {});

    // Clic en "Nuevo evento" (abre un modal con opciones de tipo de evento)
    await page.getByRole('link', { name: /nuevo evento/i }).click();

    // Esperar a que el modal "¿Qué evento deseas crear?" esté visible
    const modal = page.getByRole('dialog');
    await modal.waitFor({ state: 'visible', timeout: 100000 });

    // Dentro del modal, seleccionar "Remisión a especialista" (botón junto al heading del mismo nombre)
    await modal.getByRole('heading', { name: /remisión a especialista|remision a especialista/i }).locator('xpath=preceding-sibling::button[1]').click();

    // El formulario de remisión se muestra en un modal; esperar el dialog que contiene el campo especialidad
    const formModal = page.getByRole('dialog').filter({ has: page.getByLabel(/especialidad/i) });
    await formModal.waitFor({ state: 'visible', timeout: 100000 });

    await formModal.getByLabel(/nombre/i).or(formModal.getByPlaceholder(/nombre/i)).first().fill('laura');
    await formModal.getByLabel(/email|correo/i).or(formModal.getByPlaceholder(/email|correo/i)).first().fill('lauda@gmaill.com');
    await formModal.getByLabel(/dirección|direccion/i).or(formModal.getByPlaceholder(/dirección|direccion/i)).first().fill('ibague');
    await formModal.getByLabel(/celular|teléfono|telefono/i).or(formModal.getByPlaceholder(/celular|teléfono|telefono/i)).first().fill('3111111111');

    await formModal.getByLabel(/Motivos de Remisión a especialista|motivo de remision/i)
      .or(formModal.getByPlaceholder(/motivo/i))
      .first()
      .fill('especialista otitis');

    await formModal.getByLabel(/Diagnostico Presuntivo|diagnostico presuntivo/i)
      .or(formModal.getByPlaceholder(/Diagnostico Presuntivo|diagnostico/i))
      .first()
      .fill('sangrado');

    await formModal.getByLabel(/Detalle de la solicitud|detalle de la solicitud/i)
      .or(formModal.getByPlaceholder(/detalle de la solicitud/i))
      .first()
      .fill('detalle de la solicitud');

    await formModal.getByRole('button', { name: /Guardar|Guardar cambios/i }).click();
  });
});
