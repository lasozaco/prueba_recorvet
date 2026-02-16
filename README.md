# Pruebas E2E - Recorvet

Proyecto de pruebas end-to-end con **Playwright** para la aplicación Recorvet (`testing.recorvet.com`). Incluye validación de login, flujo de Nota Clínica y flujo de Remisión a Especialista.

## Requisitos

- Node.js 18+
- npm

## Instalación

```bash
npm install
npx playwright install
```

## Flujos de prueba

### Flujo 1 — Nota Clínica

**Objetivo:** Completar los campos obligatorios y validar que el botón de confirmación realice la acción esperada.

**Pasos:**

1. Inicio de sesión con credenciales válidas.
2. Navegación a **Home** → **Pacientes**.
3. Búsqueda del paciente (ej. "maximus") y acceso a su perfil.
4. Clic en **Nuevo evento** y selección de **Nota Clínica** en el modal.
5. Completar los **campos obligatorios** (ej. categoría, descripción de la nota).
6. Validar que el **botón Guardar** ejecute la acción esperada.

**Archivo:** `tests/flujo1.spec.ts`

**Ejecución:**

```bash
npm run flujo1
# Con navegador visible:
npm run flujo1:headed
```

```bash
npx playwright test tests/flujo1.spec.ts --project=chromium
npx playwright test tests/flujo1.spec.ts --project=chromium --headed
```

---

### Flujo 2 — Remisión a Especialista

**Objetivo:** Validar la lógica de los campos dinámicos (como el switch "Datos del Especialista") y el envío exitoso del formulario.

**Pasos:**

1. Inicio de sesión con credenciales válidas.
2. Navegación a **Home** → **Pacientes** → búsqueda del paciente y acceso a su perfil.
3. Clic en **Nuevo evento** y selección de **Remisión a especialista** en el modal.
4. **Campos dinámicos:** completar datos del especialista (nombre, email, dirección, celular).
5. Completar **Motivos de Remisión**, **Diagnóstico Presuntivo** y **Detalle de la solicitud**.
6. Clic en **Guardar** y validar el envío exitoso.

**Archivo:** `tests/flujo2.spec.ts`

**Ejecución:**

```bash
npm run flujo2
# Con navegador visible:
npm run flujo2:headed
```

```bash
npx playwright test tests/flujo2.spec.ts --project=chromium
npx playwright test tests/flujo2.spec.ts --project=chromium --headed
```

---

## Credenciales de prueba

| Campo        | Valor                                |
|-------------|---------------------------------------|
| **URL**     | `https://testing.recorvet.com/login` |
| **Email**   | `diego@pixeling.co`                  |
| **Contraseña** | `password`                        |

## Resumen

| Flujo | Descripción | Archivo | Comando |
|-------|-------------|---------|---------|
| **1** | Nota Clínica: campos obligatorios y botón de confirmación | `tests/flujo1.spec.ts` | `npm run flujo1` |
| **2** | Remisión a Especialista: campos dinámicos y envío exitoso | `tests/flujo2.spec.ts` | `npm run flujo2` |

## Ejecutar todos los tests

```bash
npx playwright test
```

## Reportes

```bash
npx playwright test --reporter=html
npx playwright show-report
```
