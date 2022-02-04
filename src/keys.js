// get the client
const mysql = require('mysql2/promise');
require('dotenv').config()


// get the promise implementation, we will use bluebird
const bluebird = require('bluebird');

module.exports = {
    database: {
        host: process.env.HOST,
        user: process.env.USER,
        password: process.env.PASSWORD,
        database: process.env.DBNAME,
        Promise: bluebird        

    }
};

