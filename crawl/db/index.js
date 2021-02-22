let mysql = require('mysql');
let bluebird = require('bluebird');


let connection = mysql.createConnection({
    host:'localhost',
    port:'3306',
    password:'xdf_yanfadashi',
    user:'root',
    database:'crawl-create28'
})

connection.connect();

module.exports = bluebird.promisify(connection.query).bind(connection)