
function webSocketInvoke() {
    var socket = io('http://localhost:3000', { path: '/websocketupdates'});
    socket.on('event', (value) => {
      console.log(`Received event ${JSON.stringify(value)}`)
      processMessage(value)
    });
  }

  

function connect() {
  var radioButtons = document.querySelectorAll('input[name="connectiontype"]');
  let connectionType;
  for (const radioButton of radioButtons) {
    if (radioButton.checked) {
      connectionType = radioButton.value;
      break;
    }
  }
  if (connectionType='sockets') {
    webSocketInvoke();
  }
}

