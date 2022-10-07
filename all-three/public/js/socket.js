
function webSocketInvoke() {
    var socket = io('http://localhost:3000', { path: '/websocketupdates'});
    socket.on('event', (value) => {
      processMessage(value)
    });
  }

  
console.log("connecting using websockets")
webSocketInvoke();

