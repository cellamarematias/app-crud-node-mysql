const bcrypt = require('bcryptjs');

const helpers = {};

// encriptar el pass

helpers.encryptPassword = async (password) => {
  const salt = await bcrypt.genSalt(10); // q de veces que se ejecuta el algoritmo de encryp -- + veces + seguro
  const hash = await bcrypt.hash(password, salt);
  return hash;
};

helpers.matchPassword = async (password, savedPassword) => {
  try {
    return await bcrypt.compare(password, savedPassword);
  } catch (e) {
    console.log(e)
  }
};

module.exports = helpers;