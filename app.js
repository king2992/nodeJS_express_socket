var express = require('express')
var socket = require('socket.io')
var http = require('http')
var app = express()
var fs = require('fs')
var server = http.createServer(app)
var io = socket(server)

app.use('/css', express.static('./static/css'))
app.use('/js', express.static('./static/js'))

io.sockets.on('connection', function(socket){
    socket.on('newUser',function(name){
        console.log(name + "님이 접속하였습니다.")

        socket.name = name
         
        io.sockets.emit('update',{type:'connect', name :'SERVER', message : name+'님이 접속하였습니다.'})
    })

    socket.on('message', function(data){
        data.name = socket.name

        console.log(data)

        socket.broadcast.emit('update',data)
    })

    socket.on('disconnect', function(){
        console.log(socket.name + "님이 나가셨습니다.")

        socket.broadcast.emit('update', {type:'disconnect', name:'SERVER', message:socket.name + "님이 나가셨습니다."})
    })

})

server.listen(8080)

app.get('/', function(req, res){
    fs.readFile('./static/index.html', function(err, data){
        if(err) res.send('에러')
        else{
            res.writeHead(200, {'Content-Type' : 'texthtml'})
            res.write(data)
            res.end()
        }
    })
})

