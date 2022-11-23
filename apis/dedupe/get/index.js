const vandium = require('vandium');
const mysql  = require('mysql');

exports.handler = vandium.generic()
  .handler( (event, context, callback) => {

    var connection = mysql.createConnection({
    host     : process.env.host,
    user     : process.env.user,
    password : process.env.password,
    database : process.env.database
    });
  

    var sql = "DELETE S1 FROM apis AS S1 INNER JOIN apis AS S2 WHERE S1.id < S2.id AND S1.url = S2.url;";
    connection.query(sql, function (error, results, fields) {

    callback( null, results );

  });
  connection.end();
});