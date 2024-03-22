const pug = require('pug');
const http = require('http')
const fs = require('fs')
const port = 3001
  
const server = http.createServer((req, res) => {
    const headers = {
      'Access-Control-Allow-Origin': '*', /* @dev First, read about security */
      'Access-Control-Allow-Headers':req.headers.origin,
      'Access-Control-Allow-Headers':'content-type,hx-current-url,hx-request',
      'Access-Control-Allow-Methods': 'OPTIONS, POST, GET',
      'Access-Control-Max-Age': 2592000, // 30 days
      'Content-Type':'text/html'
    };
  
    if (req.method === 'OPTIONS') {
      res.writeHead(204, headers);
      res.end();
      return;
    }
  
    if (['GET', 'POST'].indexOf(req.method) > -1) {
      res.writeHead(200, headers);
      res.end(pug.renderFile('template.pug', {name: 'Madame C'}));
      return;
    }
  
    res.writeHead(405, headers);
    res.end(`${req.method} is not allowed for the request.`);
  })

server.listen(port, function(error){
    if (error){
        console.log('Error occured: ', error)
    } else {
        console.log('La madama C BACK se está ejecutando en el puerto: ', port)
    }
})