const http = require('http')
const fs = require('fs')
const port = 3000

const server = http.createServer(function(req,res){ 
    res.writeHead(200, {'Content-Type':'text/html'})
    fs.readFile('main.html', function(error, data){
        if (error){
            res.writeHead(404)
            res.write('Error: file not found')
        } else {
            res.write(data)
        }
        res.end()
    })
})

server.listen(port, function(error){
    if (error){
        console.log('Error occured: ', error)
    } else {
        console.log('La madama C FRONT se está ejecutando en el puerto: ', port)
    }
})