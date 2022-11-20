const vandium = require('vandium');
const mysql  = require('mysql');
const https = require('https');

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
        
      console.log("hostname: " + url.hostname);
      console.log("pathname: " + url.pathname);

      var options = {
        hostname: url.hostname,
        path: url.pathname,
        method: 'get',
        port: 443,
        headers: {
             'Accept': 'application/json',
             'User-Agent': 'Postman+Open+Tech',
             'Authorization': 'Bearer ' + process.env.github_token
           }
      };
      console.log(options);
        const req = https.request(options, (res) => {
            let body = '';

            res.on('data', (chunk) => {
                body += chunk.toString();
            });
            
            res.on('end', () => {
                console.log('Body: ', body);
                callback( null, body ); 
            });
            
        });
        req.end();      

  });
  connection.end();
});