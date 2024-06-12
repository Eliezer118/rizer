const { usuarioRifa } = require('./modelodobancodedados');

async function updateUser(numero) {
  const filter = { codigo: numero };
  const update = { $set: { nome: null, pago: null, codigo: null } };

  try {
    const result = await usuarioRifa.updateOne(filter, update);
    console.log(`Documento atualizado com sucesso!`);
  } catch (err) {
    console.error(`Erro ao atualizar documento: ${err}`);
  }
}

module.exports.updateUser = updateUser;