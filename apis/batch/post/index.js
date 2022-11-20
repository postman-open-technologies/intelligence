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
    
    connection.end();   

});