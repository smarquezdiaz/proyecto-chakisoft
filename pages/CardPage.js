// pages/CardPage.js
import { expect } from "@playwright/test";

export class CardPage {
  /**
   * @param {import('@playwright/test').Page} page
   */
  constructor(page) {
    this.page = page;
  }

  /**
   * Navegar al tablero de Trello
   */
  async irAlTablero(url) {
    await this.page.goto(url, { waitUntil: "networkidle", timeout: 60000 });

    // Esperar a que aparezca al menos una lista
    await this.page.waitForSelector('[data-testid="list"]', {
      timeout: 30000,
      state: "visible",
    });

    console.log("✓ Tablero cargado correctamente");
  }

  /**
   * Obtener locator de una lista por su nombre
   */
  listaPorNombre(nombreLista) {
    return this.page
      .locator('[data-testid="list"]')
      .filter({ has: this.page.getByRole("heading", { name: nombreLista }) });
  }

  /**
   * Crear una tarjeta en una lista específica
   */
  async crearTarjetaEnLista(nombreLista, titulo) {
    console.log(`📝 Creando tarjeta "${titulo}" en lista "${nombreLista}"...`);

    const lista = this.listaPorNombre(nombreLista);

    // Asegurar que la lista es visible
    await lista.waitFor({ state: "visible", timeout: 10000 });

    // Buscar y hacer click en el botón para agregar tarjeta
    const btnAdd = lista.getByRole("button", { name: /añadir una tarjeta/i });
    const btnVisible = await btnAdd.isVisible().catch(() => false);

    if (btnVisible) {
      await btnAdd.click();
    } else {
      // Alternativa: buscar por texto
      await lista.getByText(/añadir una tarjeta/i, { exact: false }).click();
    }

    // Esperar al compositor y escribir el título
    const composer = lista.getByTestId("list-card-composer-textarea");
    await composer.waitFor({ state: "visible", timeout: 5000 });
    await composer.fill(titulo);

    // Click en botón "Añadir tarjeta"
    await lista
      .getByRole("button", { name: /añadir tarjeta/i })
      .first()
      .click();

    // Esperar a que la tarjeta aparezca en la lista
    await this.page.waitForTimeout(1000); // Dar tiempo a que se renderice

    const tarjeta = lista
      .locator('[data-testid="card"]')
      .filter({ has: this.page.getByText(titulo, { exact: true }) })
      .first();

    await tarjeta.waitFor({ state: "visible", timeout: 10000 });

    console.log(`✓ Tarjeta "${titulo}" creada exitosamente`);
  }

  /**
   * Verificar que una tarjeta existe en una lista
   */
  async verificarTarjetaExiste(nombreLista, titulo) {
    console.log(`🔍 Verificando que la tarjeta "${titulo}" existe...`);

    const lista = this.listaPorNombre(nombreLista);

    const tarjeta = lista
      .locator('[data-testid="card"]')
      .filter({ has: this.page.getByText(titulo, { exact: true }) })
      .first();

    // Verificar que la tarjeta está visible
    await expect(tarjeta).toBeVisible({ timeout: 10000 });

    console.log(`✓ Tarjeta "${titulo}" verificada correctamente`);
  }

  /**
   * Archivar una tarjeta desde la lista usando el menú rápido
   */
  async archivarTarjetaDesdeLista(nombreLista, titulo) {
    console.log(`🗄️ Archivando tarjeta "${titulo}"...`);

    // Cerrar cualquier modal o overlay abierto
    await this.page.keyboard.press("Escape").catch(() => {});
    await this.page.waitForTimeout(500);

    const lista = this.listaPorNombre(nombreLista);

    // Localizar la tarjeta
    const tarjeta = lista
      .locator('[data-testid="card"]')
      .filter({ has: this.page.getByText(titulo, { exact: true }) })
      .first();

    // Hacer scroll y hover sobre la tarjeta
    await tarjeta.scrollIntoViewIfNeeded();
    await this.page.waitForTimeout(500);
    await tarjeta.hover();

    // Click en el botón de menú rápido (icono de lápiz)
    const quickMenuBtn = tarjeta.locator(
      '[data-testid="card-quick-menu-button"]'
    );
    await quickMenuBtn.waitFor({ state: "visible", timeout: 5000 });
    await quickMenuBtn.click();

    // Esperar a que aparezca el menú de edición rápida
    await this.page
      .locator('[data-testid="quick-card-editor"]')
      .waitFor({ state: "visible", timeout: 5000 });

    await this.page.waitForTimeout(500);

    // Click en el botón "Archivar"
    const btnArchivar = this.page.getByRole("button", { name: /archivar/i });
    await btnArchivar.waitFor({ state: "visible", timeout: 5000 });
    await btnArchivar.click();

    // Esperar a que la tarjeta desaparezca
    await tarjeta.waitFor({ state: "hidden", timeout: 10000 });

    console.log(`✓ Tarjeta "${titulo}" archivada exitosamente`);
  }

  /**
   * Verificar que una tarjeta NO existe (fue archivada)
   */
  async verificarTarjetaNoExiste(nombreLista, titulo) {
    console.log(`🔍 Verificando que la tarjeta "${titulo}" fue archivada...`);

    const lista = this.listaPorNombre(nombreLista);

    // Verificar que la tarjeta ya no está visible
    const tarjetas = lista
      .locator('[data-testid="card"]')
      .filter({ has: this.page.getByText(titulo, { exact: true }) });

    await expect(tarjetas).toHaveCount(0, { timeout: 5000 });

    console.log(`✓ Tarjeta "${titulo}" confirmada como archivada`);
  }
}
