const app = require('express')()
const server = require('http').createServer(app)
const io = require('socket.io')(server)
const port = process.env.PORT || 3000

let hp = 10

io.on('connection', (socket) => {
  console.log('Socket.io client connected');
  socket.emit('init', hp)
  
  socket.on('attack', (payload) => {
    hp = hp - payload
    io.emit('currentHp', payload)
    socket.emit('myScore', payload)
  })
})

server.listen(port, () => {
  console.log(('Listening on port: ' + port));
})
