const mysql = require('mysql2');
const { promisify } = require('util');
const { database } = require('./keys');


// el método pool es para mantener hilos que trabajan en secuencia // no soporta 'promises', es decir async await -- solo callbacks para esto uso el módulo util

const pool = mysql.createPool(database);

pool.getConnection((err, connection) => {
    if (err) {
      if (err.code === 'PROTOCOL_CONNECTION_LOST') {   // si se perdió la conexión
        console.error('Database connection was closed.');
      }
      if (err.code === 'ER_CON_COUNT_ERROR') { // demasiadas conexiones
        console.error('Database has to many connections');
      }
      if (err.code === 'ECONNREFUSED') {  // conexión rechazada
        console.error('Database connection was refused');
      }
    }

    if (connection) connection.release(); //método release para conectar 
         console.log('DB is Connected');

  return;
});


//para convertir promesas lo que antes era callbacks
pool.query = promisify(pool.query); // con esto puedo usar promises -> el async await

module.exports = pool; 
