
async function postData(url = '', data = {}) {
    // Default options are marked with *
    const response = await fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data) // body data type must match "Content-Type" header
    });
    return response.json(); // parses JSON response into native JavaScript objects
}

function setConnectionType() {
    var radioButtons = document.querySelectorAll('input[name="connectiontype"]');
    let connectionType;
    for (const radioButton of radioButtons) {
      if (radioButton.checked) {
        connectionType = radioButton.value;
        break;
      }
    }
    postData('../connectionType', { "connectionType": connectionType }).then((data) => {
        console.log(data); 
    });
}//config

function connect() {
    var radioButtons = document.querySelectorAll('input[name="connectiontype"]');
    let connectionType;
    for (const radioButton of radioButtons) {
      if (radioButton.checked) {
        connectionType = radioButton.value;
        break;
      }
    }
    console.log(connectionType)
    if (connectionType==='sockets') {
      stopLongPoll();
      webSocketInvoke();
    }
    if (connectionType==='longpolling') {
        startLongPoll();
        longPollInvoke();
    }
  }