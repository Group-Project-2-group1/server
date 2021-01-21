const { listen } = require('socket.io')

const app = require('express')()
const server = require('http').createServer(app)
const io = require('socket.io')(server)
const port = process.env.PORT || 3000

io.on('connection', (socket) => {
  console.log('Socket.io client connected');
  // socket.emit()
})

server.listen(port, () => {
  console.log(('Listening on port: ' + port));
})
