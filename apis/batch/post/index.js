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
  var entry_count = 0;
  
    sql += 'INSERT INTO apis(';
    
    
    var total_properties = Object.keys(event[0]).length;
    var total_entries = Object.keys(event).length;
    
    console.log(total_properties);
    console.log(total_entries);

    var property_count = 1;
    for (const [key, value] of Object.entries(event[0])) {
      sql += key;
      if(property_count != total_properties){
        sql += ',';
      }
      property_count++;
    }
      
    sql += ')';

    sql += ' VALUES';  

    Object.keys(event).forEach(entry => {
      
      sql += '('; 
      
      var property_count = 1;
      for (const [key, value] of Object.entries(event[entry])) {
        sql += connection.escape(value);
        if(property_count != total_properties){
          sql += ',';
        }
        property_count++;
      }

      sql += ")";
      
      entry_count++;

      if(entry_count < total_entries){
        sql += ",";
      }

    });
    
    connection.query(sql, function (error, results, fields) {
      
      var response = {};
      response.inserted_rows = results.affectedRows;
      
      callback( null, response );

    });
    connection.end();   

});