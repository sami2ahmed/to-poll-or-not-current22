async function longPollInvoke() {
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

longPollInvoke()

