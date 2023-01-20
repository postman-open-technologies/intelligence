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

    var pull_id = event.pull_id;

    var sql1 = "UPDATE github_targets SET body='', published_openapi=1, published_metadata=0 WHERE id = " + pull_id;
    connection.query(sql1, function (error, results, fields) {  
      callback( null, sql1 ); 
    });
});