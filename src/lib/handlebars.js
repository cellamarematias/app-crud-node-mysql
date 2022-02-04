//acá config algunas librerías
const { format } = require('timeago.js');

const helpers = {}; // creo este objeto para poder usarlo en las vistas


helpers.timeago = (savedTimestamp) => {
    return format(savedTimestamp);
}



module.exports = helpers;


