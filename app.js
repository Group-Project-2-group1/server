const app = require('express')()
const server = require('http').createServer(app)
const io = require('socket.io')(server)
const port = process.env.PORT || 3000

let player = ''
let roomname = []


io.on('connection', (socket) => {
  console.log('Socket.io client connected');
  socket.emit('roomname', roomname)
  socket.on('addNewRoom', (payload) => {
    roomname.push(payload)
    io.emit('roomname', roomname)
    socket.join(payload);
  })

  socket.on('goToRoom', (payload) => {
    // buat join guard disini 
    if (io.sockets.adapter.rooms[payload]) {
      if (io.sockets.adapter.rooms[payload].length < 4) {
        socket.join(payload);
        io.to(payload).emit('currentPlayer', io.sockets.adapter.rooms[payload].length)
        io.to(payload).emit('toRoute', "GameRoom")
      } else {
        socket.emit('toLobby', { path: '/' })
      }
    } 
  })

  socket.on('addUser', ({ room, payload }) => {
    io.to(room).emit('addUser', payload)
  })

  socket.on('addPlayer', (payload) => {
    player = payload
    socket.emit('username', player)
  })

  socket.on('start', ({ room, payload }) => {
    io.to(room).emit('start', payload)
  })

  socket.on('changeStart', ({ room, payload }) => {
    io.to(room).emit('changeStart', payload)
  })

  socket.on('attack', ({ room, payload }) => {
    console.log(room, payload);
    io.to(room).emit('currentHp', payload)
    socket.emit('myScore', 1)
    socket.emit('init', payload)
  })
})

server.listen(port, () => {
  console.log(('Listening on port: ' + port));
})
