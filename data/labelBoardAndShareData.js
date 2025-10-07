module.exports = {
  labelScenarios: [
    { title: 'nombre valido', input: 'Etiqueta QA', color: 'celeste', id: '07', tag: 'alta', mark:'@smoke @positive @regression' },
    { title: 'nombre vacío', input: '', color: 'celeste', id: '08', tag: 'media', mark:'@positive @regression' },
    { title: 'nombre con solo caracteres especiales', input: '!@#$%&*', color: 'celeste', id: '09', tag: 'media', mark:'@positive @regression' }
  ],
  editLabel: [
    { input: 'Etiqueta editada verde', color: 'lime_dark', ariaColor: 'lima intenso' },
  ],
  boardUsers: [
    { input: 'David Gregori Rodriguez Calle', title: 'se pueda asiganar un miembro por su nombre' , ok: true, id: '01', tag: 'positive'},
    { input: 'www.str_hpl@hotmail.com', title: 'se pueda asiganar un miembro por su email',ok: true, id: '02', tag: 'positive' },
    { input: 'usuarioquenoexiste', title: 'no se pueda asiganar un miembro que no exista en Trello', ok: false, id: '03', tag: 'negative' }]
};
