module.exports = {
  commentNormal: [
    { comment: 'En todo tiempo ama el amigo, y el hermano nace para el tiempo de angustia', type: 'valido' },
    { comment: '!, @, #, $, %, &, *, (, ), -, _, =, +, ¿, ¡, é, ñ,', type: 'con carateres especiales' },
    { comment: '😊🚀', type: 'con emojis' },
  ],
  commentVoid: [
    { comment: '   ', type: 'con solo espacios' },
    { comment: '', type: 'vacio' },
  ],
  commentLarge: [
    { comment: 'x'.repeat(20000), type: 'que supera el limite de caracteres' },
  ]
};