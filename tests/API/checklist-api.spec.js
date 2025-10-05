const { test, expect } = require('@playwright/test');
const ChecklistPage = require('../../pages/ChecklistPageAPI');
const SchemaValidator = require('../../utils/schemaValidator');
const testData = require('../../data/checklistTestDataAPI.json');
let checklistPage;
let schemaValidator;
let checklistId;

test.describe.configure({ mode: 'serial' });
test.describe('Trello Checklists API - POM + Data-Driven + Schema Validation', () => {
  
  test.beforeAll(async () => {
    schemaValidator = new SchemaValidator();
  });

  test.beforeEach(async ({ request }) => {
    checklistPage = new ChecklistPage(request);
  });

  test('1. POST - Crear checklist con validación de schema', async () => {
    const testChecklist = testData.validChecklists[0];
    const response = await checklistPage.createChecklist(
      testData.cardIds.valid,
      testChecklist.name
    );

    expect(response.status()).toBe(testData.expectedStatusCodes.success);

    const responseBody = await response.json();
    console.log('✓ Checklist creado:', responseBody);

    checklistId = responseBody.id;

    const validation = schemaValidator.validateCreateChecklist(responseBody);
    expect(validation.valid).toBeTruthy();
    if (!validation.valid) {
      console.error('Errores de schema:', schemaValidator.formatErrors(validation.errors));
    }

    expect(responseBody.name).toBe(testChecklist.name);
    expect(responseBody.idCard).toBe(testData.cardIds.valid);
    expect(Array.isArray(responseBody.checkItems)).toBeTruthy();
  });

  test('2. GET - Obtener checklist con validación de schema', async () => {
    expect(checklistId).toBeDefined();

    const response = await checklistPage.getChecklist(checklistId);

    expect(response.status()).toBe(testData.expectedStatusCodes.success);

    const responseBody = await response.json();
    console.log('✓ Checklist obtenido:', responseBody);

    const validation = schemaValidator.validateGetChecklist(responseBody);
    expect(validation.valid).toBeTruthy();
    if (!validation.valid) {
      console.error('Errores de schema:', schemaValidator.formatErrors(validation.errors));
    }

    expect(responseBody.id).toBe(checklistId);

    expect(checklistPage.validateGetResponse(responseBody)).toBeTruthy();
  });

  test('3. PUT - Actualizar checklist con validación de schema', async () => {
    expect(checklistId).toBeDefined();

    const newName = testData.updateNames[0];
    const response = await checklistPage.updateChecklist(checklistId, newName);

    expect(response.status()).toBe(testData.expectedStatusCodes.success);

    const responseBody = await response.json();
    console.log('✓ Checklist actualizado:', responseBody);

    const validation = schemaValidator.validateGetChecklist(responseBody);
    expect(validation.valid).toBeTruthy();
    if (!validation.valid) {
      console.error('Errores de schema:', schemaValidator.formatErrors(validation.errors));
    }

    expect(responseBody.name).toBe(newName);
    expect(responseBody.id).toBe(checklistId);
  });

  test('4. DELETE - Eliminar checklist con validación de schema', async () => {
    expect(checklistId).toBeDefined();

    const response = await checklistPage.deleteChecklist(checklistId);

    expect(response.status()).toBe(testData.expectedStatusCodes.success);

    const responseBody = await response.json();
    console.log('✓ Checklist eliminado:', responseBody);

    const validation = schemaValidator.validateDeleteChecklist(responseBody);
    expect(validation.valid).toBeTruthy();
    if (!validation.valid) {
      console.error('Errores de schema:', schemaValidator.formatErrors(validation.errors));
    }

    expect(checklistPage.validateDeleteResponse(responseBody)).toBeTruthy();
  });

  test('5. GET - Verificar eliminación', async () => {
    expect(checklistId).toBeDefined();

    const response = await checklistPage.getChecklist(checklistId);

    expect(response.status()).not.toBe(testData.expectedStatusCodes.success);
    console.log('✓ Checklist verificado como eliminado. Status:', response.status());
  });
});

test.describe('Data-Driven Tests - Crear múltiples checklists', () => {
  
  test.beforeEach(async ({ request }) => {
    checklistPage = new ChecklistPage(request);
    schemaValidator = new SchemaValidator();
  });

  for (const [index, checklistData] of testData.validChecklists.entries()) {
    test(`DDT ${index + 1} - Crear y validar: "${checklistData.name}"`, async () => {
      const response = await checklistPage.createChecklist(
        testData.cardIds.valid,
        checklistData.name
      );

      expect(response.status()).toBe(testData.expectedStatusCodes.success);

      const responseBody = await response.json();
      console.log(`✓ Checklist DDT ${index + 1} creado:`, checklistData.name);

      const validation = schemaValidator.validateCreateChecklist(responseBody);
      expect(validation.valid).toBeTruthy();

      expect(responseBody.name).toBe(checklistData.name);
      expect(responseBody.idCard).toBe(testData.cardIds.valid);

      const deleteResponse = await checklistPage.deleteChecklist(responseBody.id);
      expect(deleteResponse.status()).toBe(testData.expectedStatusCodes.success);
      console.log(`✓ Checklist DDT ${index + 1} eliminado`);
    });
  }
});

test.describe('Data-Driven Tests - Actualizar nombres', () => {
  let tempChecklistId;

  test.beforeEach(async ({ request }) => {
    checklistPage = new ChecklistPage(request);
    schemaValidator = new SchemaValidator();

    const response = await checklistPage.createChecklist(
      testData.cardIds.valid,
      'Checklist Temporal'
    );
    const body = await response.json();
    tempChecklistId = body.id;
  });

  test.afterEach(async () => {
    if (tempChecklistId) {
      await checklistPage.deleteChecklist(tempChecklistId);
      console.log('✓ Checklist temporal eliminado');
    }
  });

  for (const [index, newName] of testData.updateNames.entries()) {
    test(`DDT ${index + 1} - Actualizar nombre a: "${newName}"`, async () => {
      const response = await checklistPage.updateChecklist(tempChecklistId, newName);

      expect(response.status()).toBe(testData.expectedStatusCodes.success);

      const responseBody = await response.json();
      console.log(`✓ Nombre actualizado a: ${newName}`);

      const validation = schemaValidator.validateGetChecklist(responseBody);
      expect(validation.valid).toBeTruthy();

      expect(responseBody.name).toBe(newName);
      expect(responseBody.id).toBe(tempChecklistId);
    });
  }
});

test.describe('Data-Driven Tests - Escenarios de borde', () => {
  
  test.beforeEach(async ({ request }) => {
    checklistPage = new ChecklistPage(request);
  });

  for (const [index, scenario] of testData.invalidScenarios.entries()) {
    test(`Escenario ${index + 1}: ${scenario.scenario}`, async () => {
      console.log(`Probando: ${scenario.scenario}`);
      console.log(`Comportamiento esperado: ${scenario.expectedBehavior}`);

      const response = await checklistPage.createChecklist(
        testData.cardIds.valid,
        scenario.name
      );

      const responseBody = await response.json();
      console.log('Respuesta:', responseBody);

      expect([200, 400, 422]).toContain(response.status());

      if (response.status() === 200 && responseBody.id) {
        await checklistPage.deleteChecklist(responseBody.id);
        console.log('✓ Checklist de prueba eliminado');
      }
    });
  }
});

test.describe('Tests Negativos', () => {
  
  test.beforeEach(async ({ request }) => {
    checklistPage = new ChecklistPage(request);
  });

  test('GET - Checklist con ID inválido', async () => {
    const response = await checklistPage.getChecklist('invalid-id-99999');

    expect(response.status()).not.toBe(testData.expectedStatusCodes.success);
    console.log('✓ Error esperado recibido. Status:', response.status());
  });

  test('DELETE - Checklist inexistente', async () => {
    const response = await checklistPage.deleteChecklist('nonexistent-id-12345');

    expect(response.status()).not.toBe(testData.expectedStatusCodes.success);
    console.log('✓ Error esperado recibido. Status:', response.status());
  });

  test('UPDATE - Checklist inexistente', async () => {
    const response = await checklistPage.updateChecklist('nonexistent-id-12345', 'Nuevo Nombre');
    expect(response.status()).not.toBe(testData.expectedStatusCodes.success);
    console.log('✓ Error esperado recibido. Status:', response.status());
  });
});