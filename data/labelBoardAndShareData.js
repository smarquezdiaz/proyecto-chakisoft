module.exports = {
  labelScenarios: [
    { title: 'nombre valido', input: 'Etiqueta QA', color: 'celeste' },
    { title: 'nombre vacío', input: '', color: 'celeste' },
    { title: 'nombre con solo caracteres especiales', input: '!@#$%&*', color: 'celeste' }
  ],
  editLabel: [
    { input: 'Etiqueta editada verde', color: 'lime_dark', ariaColor: 'lima intenso' },
  ],
  boardUsers: [
    { input: 'David Gregori Rodriguez Calle', title: 'se pueda asiganar un miembro por su nombre' , ok: true },
    { input: 'www.str_hpl@hotmail.com', title: 'se pueda asiganar un miembro por su email',ok: true },
    { input: 'usuarioquenoexiste', title: 'no se pueda asiganar un miembro que no exista en Trello', ok: false }]
};
