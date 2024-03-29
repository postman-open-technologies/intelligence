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
    
    var sql = "SELECT id,publish_path,body FROM web_sources e WHERE pulled = 1 AND body <> '' AND published_openapi = 0 AND valid = 1 ORDER BY RAND() LIMIT 1";
    connection.query(sql, function (error, results, fields) {

    callback( null, results );
    connection.end();  
  });  
});