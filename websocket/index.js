$(document).ready(function(){
  function webSocketInvoke() {
    var socket = io('http://localhost:3000');
    socket.on('event', (value) => {
      document.write(value);
    });
  }
  
  webSocketInvoke();
 });
