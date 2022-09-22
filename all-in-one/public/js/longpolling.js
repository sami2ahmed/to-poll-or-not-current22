var onFlag=true;
async function longPollInvoke() {
    while(onFlag){
        await axios.get('http://localhost:3000/longpollingupdates', { timeout: 10000})
        .then(function (response) {
            response.data.forEach(event => {
                console.log(event);
                processMessage(event);
            })
            longPollInvoke()
        })
        .catch(function (error) {
            console.log('Error:', error);
            longPollInvoke()
        });
    }
  }

function stopLongPoll(){
    onFlag=false;
}

function startLongPoll(){
    onFlag=true;
}

