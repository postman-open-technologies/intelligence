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

    var links = event.links;
    var check_urls = "";
    var sql_begin = 'INSERT INTO github_targets(name,url,account)  VALUES';
    var sql = "";

    user.name = jsonData.name;
    user.path = jsonData.path;
    user.url = jsonData.url;

    for (let i = 0; i < links.length; i++) {
      check_urls += "'" + links[i].url + "',";
    }
    
    var counter =1;
    
    check_urls = check_urls.substr(0,check_urls.length-1);
    
     var sql1 = "SELECT url FROM github_targets WHERE url IN(" + check_urls + ")";
      connection.query(sql1, function (error, targetResults, fields) {   

          // Loop through all users
          for (let i = 0; i < links.length; i++) {
            
            var already_exist = 0;
            for (let j = 0; j < targetResults.length; j++) {
              if(users[i].link == targetResults[j].url){
                already_exist = 1;  
                }
              }
            
            if(already_exist == 0){
              
              var name = users[i].name;
              var url = users[i].url;
            
              sql += '(' + connection.escape(name) + ',' + connection.escape(users[i].url) + '),';                       
              
            }
          
          if(sql != ''){
            
            sql = sql.substr(0,sql.length-1);
            
            sql = sql_begin + sql;

            connection.query(sql, function (error, result, fields) {        
              if(error){
                var response = {};
                response.insert = 0
                callback( null, response);
              }
              else{
                if(result.affectedRows){
                var response = {};
                response.insert = result.affectedRows;
                callback( null, response );
                }
                }
              }); 
            }
          else{
            console.log("2");
            callback( null, "Nothing to INSERT" );
          }
        
      });    

});