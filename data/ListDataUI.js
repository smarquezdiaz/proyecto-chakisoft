// data/dataList.js

export const testData = {
  board: {
    url: 'https://trello.com/b/AcEzc2Wb/mi-tablero-de-trello',
    targetBoard: 'pruebas mover',
    targetBoardUrl: 'https://trello.com/b/ISS7nUUQ/pruebas-mover'
  },
  
  lists: {
    // Flujo completo
    test1: 'Test Lista 1',
    test2: 'Test Lista 2',
    renamed: 'Test Lista RenombradaUI',
    
    // Tests avanzados
    moveTest: 'ejemplo2',
    archiveTest: 'ejemplo3 archivar',
    followTest: 'ejemplo seguir',
    
    // Límites de caracteres
    maxLength: 'T'.repeat(512),
    overMaxLength: 'T'.repeat(513),
    
    // Valores especiales
    emptyName: '',
    
    // Posiciones
    positions: {
      first: 1,
      second: 2,
      third: 3
    }
  },
    
  validation: {
    maxListNameLength: 512,
    minListNameLength: 1
  }
};