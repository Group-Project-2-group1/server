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
      } else {
        // jangan pindah routing
        // roomname.push(payload + "1")
        // socket.join(payload + "1");
      }
    } 
  })

  socket.on('addPlayer', (payload) => {
    player = payload
    socket.emit('username', player)
  })

  socket.on('attack', ({ room, payload }) => {
    console.log(room, payload);
    io.to(room).emit('currentHp', payload)
    socket.emit('myScore', payload)
    socket.emit('init', payload)
  })
})

server.listen(port, () => {
  console.log(('Listening on port: ' + port));
})
