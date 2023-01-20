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
    
    var today = new Date();
    var dd = String(today.getDate()).padStart(2, '0');
    var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
    var yyyy = today.getFullYear();
    
    var pull_date = yyyy + '-' + mm + '-' + dd;      

    var channel = 'github';
    var spec = event.spec;
    var vocabulary = event.vocabulary;
    var format = event.format;
    var page = event.page;
    
    var links = event.links;
    var check_urls = "";
    var sql_begin = 'INSERT INTO web_targets(name,url,channel,vocabulary,format)  VALUES';
    var sql = "";

    for (let i = 0; i < links.length; i++) {
      check_urls += connection.escape(links[i].url) + ",";
    }
    
    var counter = 1;
    
    check_urls = check_urls.substr(0,check_urls.length-1);
    
    var sql1 = "SELECT url FROM web_targets WHERE url IN(" + check_urls + ")";
    console.log(sql1);
    
    connection.query(sql1, function (error, targetResults, fields) {  

        // Loop through all users
        for (let i = 0; i < links.length; i++) {

          var already_exist = 0;
          for (let j = 0; j < targetResults.length; j++) {
            if(links[i].url == targetResults[j].url){
              already_exist = 1;  
              }
            }
          
          if(already_exist == 0){
            
            var name = links[i].name;
            var url = links[i].url;
          
            sql += '(' + connection.escape(name) + ',' + connection.escape(url) + ',' + connection.escape(channel) + ',' + connection.escape(vocabulary) + ',' + connection.escape(format) + '),';                       
          
            }
        }

        if(sql != ''){
          
          sql = sql.substr(0,sql.length-1);
          
          sql = sql_begin + sql;

          connection.query(sql, function (error, insertResult, fields) {  
            
            if(insertResult){
              var inserted_results = insertResult.affectedRows;
              }
              else{
                var inserted_results = 0;
              }
            
            var search_sql = 'INSERT INTO blueprints.vocabularies_search(search_month,search_year,channel,spec,vocabulary,format) VALUES(' + connection.escape(mm) + ',' + connection.escape(yyyy) + ',' + connection.escape(channel) + ',' + connection.escape(spec) + ',' + connection.escape(vocabulary) + ',' + connection.escape(format) + ');';
            console.log(search_sql);
            connection.query(search_sql, function (error, result, fields) {              
              if(error){
                var response = {};
                response.insert = 0
                callback( null, response);
              }
              else{
                var response = {};
                response.insert = inserted_results;
                callback( null, response );
                }
                
              }); 
              
            });   
          }
        else{
          var search_sql = 'INSERT INTO blueprints.vocabularies_search(search_month,search_year,channel,spec,vocabulary,format) VALUES(' + connection.escape(mm) + ',' + connection.escape(yyyy) + ',' + connection.escape(channel) + ',' + connection.escape(spec) + ',' + connection.escape(vocabulary) + ',' + connection.escape(format) + ');';
          console.log(search_sql);
          connection.query(search_sql, function (error, result, fields) {            
            console.log("2");
            callback( null, "Nothing to INSERT" );
          });
        }
      
    });    

});