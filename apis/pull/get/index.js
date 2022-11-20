const vandium = require('vandium');
const mysql  = require('mysql');
const https = require('https');
var req = require('request');

exports.handler = vandium.generic()
  .handler( (event, context, callback) => {

    var connection = mysql.createConnection({
    host     : process.env.host,
    user     : process.env.user,
    password : process.env.password,
    database : process.env.database
    });

    var sql = "SELECT * FROM apis e WHERE pulled = 0 LIMIT 1";
    connection.query(sql, function (error, results, fields) {

      const url = new URL(results[0].url);
      
    const params = {
        url: results[0].url,
        headers: {
             'Accept': 'application/json',
             'User-Agent': 'Postman+Open+Tech',
             'Authorization': 'Bearer ' + process.env.github_token
           }
    };
    req.post(params, function(err, res, body) {
        if(err){
            console.log('------error------', err);
        } else{
            console.log('------success--------', body);
        }
    });  

  });
  connection.end();
});