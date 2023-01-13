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

    var sql = '';
    sql += 'INSERT INTO apis(channel,format,vocabulary,url) VALUES';  

    Object.keys(event).forEach(entry => {
      
      for (const [key, value] of Object.entries(event.urls)) {
        sql += "('" + event.channel + "','" + event.format + "','" + event.vocabulary + "'," + connection.escape(value) + "),";
      }
      
    });
  
    sql = sql.substring(0, sql.length-1);
    connection.query(sql, function (error, results, fields) {

      callback( null, results );
  
    });    
    
    connection.end();   

});