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
      
      var property_count = 1;
      for (const [key, value] of Object.entries(event.urls)) {
        sql += "('" + event.channel + "','" + event.formatchannel + "','" + event.vocabulary + "'," + connection.escape(value) + "),";
      }
      
    });
    
    sql = sql.substr(0,sql.length-1);
    
    connection.query(sql, function (error, results, fields) {

      var response = {};
      response.inserted = results.affectedRows;
      
      var sql2 = 'DELETE S1 FROM apis AS S1 INNER JOIN apis AS S2 WHERE S1.id < S2.id AND S1.url = S2.url;  ';
      connection.query(sql2, function (error, results2, fields) {
  
        callback( null, response );
  
      });

    });
    connection.end();   

});