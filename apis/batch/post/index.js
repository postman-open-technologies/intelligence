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

    for (let i = 0; i < event.length; i++) {

      var sql = 'INSERT INTO apis(';
      
      var total_properties = Object.keys(event[i]).length;
      
      var property_count = 1;
      for (const [key, value] of Object.entries(event[i])) {
        sql += key;
        if(property_count != total_properties){
          sql += ',';
        }
        property_count++;
      }
        
      sql += ')';

      sql += ' VALUES(';
      
      var property_count = 1;
      for (const [key, value] of Object.entries(event[i])) {
        sql += connection.escape(value);
        if(property_count != total_properties){
          sql += ',';
        }
        property_count++;
      }

      sql += ")";
    
      connection.query(sql, function (error, results, fields) {
    
        if(i =- event.length){
        var response = {};
        response['results'] = "Inserted " + event.length + " rows.";

        callback( null, response );
        }

      });

    }

});