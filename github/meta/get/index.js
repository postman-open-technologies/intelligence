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
    
    var sql = "SELECT id,pull_name,pull_path,url,publish_path,pull_format,pull_size,vocabulary,publish_metadata_path FROM github_targets e WHERE published_openapi = 1 AND published_metadata = 0 ORDER BY RAND() LIMIT 1";
    connection.query(sql, function (error, results, fields) {

    callback( null, results );
    connection.end();

  });
});