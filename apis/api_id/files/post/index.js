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
    
    var total_properties = Object.keys(event.body).length;

    var sql = 'insert into apis_file (name,url,channel,vocabulary,format,pulled,pull_path,publish_path,pull_name,pull_size,pull_format,publish_metadata_path,valid) ';
    
    var property_count = 1;
    for (const [key, value] of Object.entries(event.body)) {
      sql += key + "'" + value + "'";
      if(property_count != total_properties){
        sql += ',';
      }
      property_count++;
    }

    sql += ")";
  
    connection.query(sql, function (error, results, fields) {

    callback( null );

  });
  connection.end();
});