module.exports = {
  commentNormal: [
    { comment: 'En todo tiempo ama el amigo, y el hermano nace para el tiempo de angustia', type: 'valido', id: '01' },
    { comment: '!, @, #, $, %, &, *, (, ), -, _, =, +, ¿, ¡, é, ñ,', type: 'con carateres especiales', id: '02' },
    { comment: '😊🚀', type: 'con emojis', id: '03' },
  ],
  commentVoid: [
    { comment: '   ', type: 'con solo espacios', id: '08' },
    { comment: '', type: 'vacio', id: '09' },
  ],
  commentLarge: [
    { comment: 'x'.repeat(20000), type: 'que supera el limite de caracteres' },
  ]
};