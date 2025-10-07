const { test, expect } = require('@playwright/test');
const ChecklistPage = require('../../utils/requestChecklist');
const SchemaValidator = require('../../utils/schemaChecklist/schemaValidator');
const testData = require('../../data/checklistTestDataAPI.json');
const logger = require ('../../utils/logger');
const { allure } = require('allure-playwright');
let checklistPage;
let schemaValidator;
let checklistId;

test.describe.configure({ mode: 'serial' });

test.describe('Trello Checklists', () => {
  
  test.beforeAll(async () => {
    schemaValidator = new SchemaValidator();
    logger.info('Schema validator inicializado');
  });

  test.beforeEach(async ({ request }) => {
    checklistPage = new ChecklistPage(request);
    logger.info('ChecklistPage inicializado para el test');
  });

  test('DL-API-TC01 Crear checklist @smoke @regression @positive', async () => {
    allure.owner('Diego Lomar');
    allure.severity('medium');
    const testChecklist = testData.validChecklists[0];
    
    logger.info(`Iniciando test de creación de checklist: ${testChecklist.name}`);
    logger.info('request enviado');
    const response = await checklistPage.createChecklist(
      testData.cardIds.valid,
      testChecklist.name
    );

    logger.info('respuesta recibida');

    expect(response.status()).toBe(testData.expectedStatusCodes.success);
    logger.success(`Status code validado: ${response.status()}`);

    const responseBody = await response.json();
    logger.success('✓ Checklist creado:', responseBody);

    checklistId = responseBody.id;
    logger.info(`Checklist ID guardado: ${checklistId}`);

    const validation = schemaValidator.validateCreateChecklist(responseBody);
    expect(validation.valid).toBeTruthy();
    
    if (!validation.valid) {
      logger.error('Errores de schema: ' + schemaValidator.formatErrors(validation.errors));
    } else {
      logger.success('Schema validado correctamente');
    }

    expect(responseBody.name).toBe(testChecklist.name);
    expect(responseBody.idCard).toBe(testData.cardIds.valid);
    expect(Array.isArray(responseBody.checkItems)).toBeTruthy();
    
    logger.success(`Checklist creado exitosamente: ${testChecklist.name}`);
  });

  test('DL-API-TC02 Obtener el checklist creado @smoke  @positive ', async () => {
    allure.owner('Diego Lomar');
    allure.severity('medium');
    expect(checklistId).toBeDefined();
    logger.info(`Iniciando test para obtener checklist por ID: ${checklistId}`);
    logger.info('request enviado');

    const response = await checklistPage.getChecklist(checklistId);

    logger.info('respuesta recibida');

    expect(response.status()).toBe(testData.expectedStatusCodes.success);
    logger.success(`Status code validado: ${response.status()}`);

    const responseBody = await response.json();
    logger.success('✓ Checklist obtenido:', responseBody);

    const validation = schemaValidator.validateGetChecklist(responseBody);
    expect(validation.valid).toBeTruthy();
    
    if (!validation.valid) {
      logger.error('Errores de schema: ' + schemaValidator.formatErrors(validation.errors));
    } else {
      logger.success('Schema validado correctamente');
    }

    expect(responseBody.id).toBe(checklistId);
    logger.success('ID del checklist coincide');

    expect(checklistPage.validateGetResponse(responseBody)).toBeTruthy();
    logger.success('Checklist obtenido exitosamente');
  });

  test('DL-API-TC03 Actualizar checklist @regression, @positive', async () => {
    allure.owner('Diego Lomar');
    allure.severity('critical');
    allure.description('Verificar que se puede actualizar el nombre de un checklist existente');

    expect(checklistId).toBeDefined();

    const newName = testData.updateNames[0];
    logger.info(`Iniciando test para actualizar checklist ID: ${checklistId}`);
    logger.info(`Nuevo nombre: ${newName}`);
    logger.info('request enviado');

    const response = await checklistPage.updateChecklist(checklistId, newName);

    logger.info('respuesta recibida');

    expect(response.status()).toBe(testData.expectedStatusCodes.success);
    logger.success(`Status code validado: ${response.status()}`);

    const responseBody = await response.json();
    logger.success('✓ Checklist actualizado:', responseBody);

    const validation = schemaValidator.validateGetChecklist(responseBody);
    expect(validation.valid).toBeTruthy();
    
    if (!validation.valid) {
      logger.error('Errores de schema: ' + schemaValidator.formatErrors(validation.errors));
    } else {
      logger.success('Schema validado correctamente');
    }

    expect(responseBody.name).toBe(newName);
    expect(responseBody.id).toBe(checklistId);
    
    logger.success(`Checklist actualizado exitosamente a: ${newName}`);
  });

  test('DL-API-TC04 Eliminar checklist @smoke @psitive', async () => {
    allure.owner('Diego Lomar');
    allure.severity('hight');

    expect(checklistId).toBeDefined();
    logger.info(`Iniciando test para eliminar checklist ID: ${checklistId}`);
    logger.info('request enviado');

    const response = await checklistPage.deleteChecklist(checklistId);

    logger.info('respuesta recibida');


    expect(response.status()).toBe(testData.expectedStatusCodes.success);
    logger.success(`Status code validado: ${response.status()}`);


    const responseBody = await response.json();
    logger.success('✓ Checklist eliminado:', responseBody);

    const validation = schemaValidator.validateDeleteChecklist(responseBody);
    expect(validation.valid).toBeTruthy();
    
    if (!validation.valid) {
      logger.error('Errores de schema: ' + schemaValidator.formatErrors(validation.errors));
    } else {
      logger.success('Schema validado correctamente');
    }

    expect(checklistPage.validateDeleteResponse(responseBody)).toBeTruthy();
    logger.success('Checklist eliminado exitosamente');
  });

  test('DL-API-TC05 Verificar eliminación @regression @negative', async () => {
    allure.owner('Diego Lomar');
    allure.severity('normal');


    expect(checklistId).toBeDefined();
    logger.info(`Verificando eliminación del checklist ID: ${checklistId}`);
    logger.info('request enviado');

    const response = await checklistPage.getChecklist(checklistId);

    logger.info('respuesta recibida');

    expect(response.status()).not.toBe(testData.expectedStatusCodes.success);
    logger.success(`Checklist verificado como eliminado. Status: ${response.status()}`);
  });
});


test.describe('Crear múltiples checklists', () => {
  
  test.beforeEach(async ({ request }) => {
    allure.owner('Diego Lomar');
    checklistPage = new ChecklistPage(request);
    schemaValidator = new SchemaValidator();
    logger.info('Setup completado');
  });

  for (const [index, checklistData] of testData.validChecklists.entries()) {
    test(`DL-API-TC06 ${index + 1} - Crear y validar: "${checklistData.name}" @regression @positive`, async () => {
      allure.owner('Diego Lomar');
      allure.severity('normal');
      
      logger.info(`Iniciando test  ${index + 1}: ${checklistData.name}`);
      logger.info('request enviado');

      const response = await checklistPage.createChecklist(
        testData.cardIds.valid,
        checklistData.name
      );

      logger.info('respuesta recibida');

      expect(response.status()).toBe(testData.expectedStatusCodes.success);
      logger.success(`Status code validado: ${response.status()}`);

      const responseBody = await response.json();
      console.log(`✓ Checklist  ${index + 1} creado:`, checklistData.name);

      const validation = schemaValidator.validateCreateChecklist(responseBody);
      expect(validation.valid).toBeTruthy();
      
      if (validation.valid) {
        logger.success('Schema validado correctamente');
      } else {
        logger.error('Error en validación de schema');
      }

      expect(responseBody.name).toBe(checklistData.name);
      expect(responseBody.idCard).toBe(testData.cardIds.valid);
      logger.success(`Checklist ${index + 1} validado correctamente`);

      logger.info(`Eliminando checklist  ${index + 1}`);
      const deleteResponse = await checklistPage.deleteChecklist(responseBody.id);
      expect(deleteResponse.status()).toBe(testData.expectedStatusCodes.success);
      logger.success(`Checklist  ${index + 1} eliminado`);
    });
  }
});


test.describe('Actualizar nombres', () => {
  let tempChecklistId;

  test.beforeEach(async ({ request }) => {
    allure.owner('Diego Lomar');
    checklistPage = new ChecklistPage(request);
    schemaValidator = new SchemaValidator();

    logger.info('Creando checklist temporal para test de actualización');
    // Crear checklist temporal para las pruebas
    const response = await checklistPage.createChecklist(
      testData.cardIds.valid,
      'Checklist Temporal'
    );
    const body = await response.json();
    tempChecklistId = body.id;
    logger.success(`Checklist temporal creado: ${tempChecklistId}`);
  });

  test.afterEach(async () => {
    // Limpiar: Eliminar checklist temporal
    if (tempChecklistId) {
      logger.info(`Limpiando checklist temporal: ${tempChecklistId}`);
      await checklistPage.deleteChecklist(tempChecklistId);
      logger.success('Checklist temporal eliminado');
    }
  });

  for (const [index, newName] of testData.updateNames.entries()) {
    test(`DL-API-TC07 ${index + 1} - Actualizar nombre a: "${newName}" @regression @positive`, async () => {
      allure.owner('Diego Lomar');
      allure.severity('normal');
      allure.description(`Test data-driven: Actualizar checklist a nombre "${newName}"`);

      logger.info(`Iniciando test DDT actualización ${index + 1}: ${newName}`);
      logger.info('request enviado');

      const response = await checklistPage.updateChecklist(tempChecklistId, newName);

      logger.info('respuesta recibida');

      expect(response.status()).toBe(testData.expectedStatusCodes.success);
      logger.success(`Status code validado: ${response.status()}`);

      const responseBody = await response.json();
      console.log(`✓ Nombre actualizado a: ${newName}`);

      // Validar schema
      const validation = schemaValidator.validateGetChecklist(responseBody);
      expect(validation.valid).toBeTruthy();
      
      if (validation.valid) {
        logger.success('Schema validado correctamente');
      } else {
        logger.error('Error en validación de schema');
      }

      // Validar que el nombre cambió
      expect(responseBody.name).toBe(newName);
      expect(responseBody.id).toBe(tempChecklistId);
      logger.success(`Nombre actualizado exitosamente a: ${newName}`);
    });
  }
});

// Tests de escenarios inválidos
test.describe('Data-Driven Tests - Escenarios de borde', () => {
  
  test.beforeEach(async ({ request }) => {
    allure.owner('Diego Lomar');
    checklistPage = new ChecklistPage(request);
    logger.info('Setup completado para test de escenarios de borde');
  });

  for (const [index, scenario] of testData.invalidScenarios.entries()) {
    test(`DL-API-TC08 Escenario @negative  ${index + 1}: ${scenario.scenario}`, async () => {
      allure.owner('Diego Lomar');
      allure.severity('minor');
      allure.description(`Escenario de borde: ${scenario.scenario}`);

      logger.info(`Iniciando escenario ${index + 1}: ${scenario.scenario}`);
      logger.info(`Comportamiento esperado: ${scenario.expectedBehavior}`);
      logger.info('request enviado');

      const response = await checklistPage.createChecklist(
        testData.cardIds.valid,
        scenario.name
      );

      logger.info('respuesta recibida');

      const responseBody = await response.json();
      console.log('Respuesta:', responseBody);

      // Verificar que la API responde (puede ser 200 o error)
      expect([200, 400, 422]).toContain(response.status());
      logger.success(`Status code recibido: ${response.status()}`);

      // Si fue exitoso, limpiar
      if (response.status() === 200 && responseBody.id) {
        logger.info('Limpiando checklist de prueba');
        await checklistPage.deleteChecklist(responseBody.id);
        logger.success('Checklist de prueba eliminado');
      }
    });
  }
});

// Test negativo: ID de checklist inválido
test.describe('Tests Negativos', () => {
  
  test.beforeEach(async ({ request }) => {
    allure.owner('Diego Lomar');
    checklistPage = new ChecklistPage(request);
    logger.info('Setup completado para tests negativos');
  });

  test('DL-API-TC09 Checklist con ID inválido @regression @negative', async () => {
    allure.owner('Diego Lomar');
    allure.severity('normal');
    allure.description('Verificar que la API maneja correctamente peticiones con IDs inválidos');

    logger.info('Iniciando test negativo: GET con ID inválido');
    logger.info('request enviado');

    const response = await checklistPage.getChecklist('invalid-id-99999');

    logger.info('respuesta recibida');

    // Debe retornar error
    expect(response.status()).not.toBe(testData.expectedStatusCodes.success);
    logger.success(`Error esperado recibido. Status: ${response.status()}`);
  });

  test('DL-API-TC010 Checklist inexistente @regression @negative', async () => {
    allure.owner('Diego Lomar');
    allure.severity('normal');
    allure.description('Verificar que la API responde apropiadamente al eliminar checklist inexistente');

    logger.info('Iniciando test negativo: DELETE de checklist inexistente');
    logger.info('request enviado');

    const response = await checklistPage.deleteChecklist('nonexistent-id-12345');

    logger.info('respuesta recibida');

    // Debe retornar error
    expect(response.status()).not.toBe(testData.expectedStatusCodes.success);
    logger.success(`Error esperado recibido. Status: ${response.status()}`);
  });

  test('DL-API-TC011 Checklist inexistente @regression @negative ', async () => {
    allure.owner('Diego Lomar');
    allure.severity('normal');
    allure.description('Verificar que la API maneja correctamente intentos de actualización de checklists inexistentes');

    logger.info('Iniciando test negativo: UPDATE de checklist inexistente');
    logger.info('request enviado');

    const response = await checklistPage.updateChecklist('nonexistent-id-12345', 'Nuevo Nombre');

    logger.info('respuesta recibida');

    // Debe retornar error
    expect(response.status()).not.toBe(testData.expectedStatusCodes.success);
    logger.success(`Error esperado recibido. Status: ${response.status()}`);
  });
});