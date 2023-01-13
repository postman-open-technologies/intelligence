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

    var sql = 'INSERT INTO apis_file (name,url,channel,vocabulary,format,pull_path,publish_path,pull_name,pull_size,pull_format,publish_metadata_path) ';
    sql += "VALUES('" + event.body.name + "','" + event.body.url + "','" + event.body.channel + "','" + event.body.vocabulary + "','" + event.body.format + "','" + event.body.pull_path + "','" + event.body.publish_path + "','" + event.body.pull_name + "','" + event.body.pull_size + "','" + event.body.pull_format + "','" + event.body.publish_metadata_path + "')";
    
    connection.query(sql, function (error, results, fields) {

    callback( null, sql );

  });
  connection.end();
});