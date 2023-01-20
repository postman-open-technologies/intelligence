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

    var pull_url = event.pull_url;
    var pull_id = event.pull_id;
    var pull_path = event.pull_path;
    var publish_path = event.publish_path;
    var pull_name = event.pull_name;
    var pull_size = event.pull_size;
    var pull_format = event.pull_format;
    var publish_metadata_path = event.publish_metadata_path;
    var openapi = JSON.stringify(event.openapi);

    var sql1 = "UPDATE github_targets SET body=" + connection.escape(openapi) + ",pull_path=" + connection.escape(pull_path) + ",publish_path = " + connection.escape(publish_path) + ",pull_name = " + connection.escape(pull_name) + ",pull_size = " + connection.escape(pull_size) + ",publish_metadata_path = " + connection.escape(publish_metadata_path) + ",pulled=1,published_openapi=0  WHERE id = " + pull_id;
    connection.query(sql1, function (error, results, fields) {  
      callback( null, results ); 
      connection.end();
    });
});