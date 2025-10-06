module.exports = {
  commentType: [
    { comment: 'En todo tiempo ama el amigo, y el hermano nace para el tiempo de angustia', type: 'normal'},
    { comment: 'Yo estoy a la puerta y llamo; si alguno oye mi voz y abre la puerta, entraré y cenaré con él, y él conmigo', type: 'en negrilla'},
    { comment: 'Porque de tal manera amó Dios al mundo, que ha dado a su Hijo unigénito, para que todo aquel que en él cree, no se pierda, mas tenga vida eterna', type: 'con formato lista'}
  ],
  commentEditDelete: [
    { input: ' Salmo 23:1 ("El Señor es mi pastor, nada me falta")', 
      edit: 'Juan 3:16 sobre el amor de Dios por el mundo, y Filipenses 4:13 ("Todo lo puedo en Cristo que me fortalece")'},
  ],
  commentLarge: [
    { input: 'x'.repeat(25000), type: 'truncado'},
    { input: 'x'.repeat(20000), type: 'txt'}
  ]
};