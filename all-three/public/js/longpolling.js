const instance = axios.create({
    baseURL: 'http://localhost:3000'
  });
instance.defaults.timeout = 10000
instance.defaults.params = {offset: '0'}

let currentOffset;

async function longPollInvoke(offset) {
    if (offset===undefined){
        await instance.get('/longpollingupdates')
        .then(function (response) {
            response.data.forEach(event => {
                processMessage(event);
            })
            longPollInvoke(response.headers['currentoffset'])
        })
        .catch(function (error) {
            console.log('Error:', error);
            longPollInvoke(offset)
        });
    }
    else {
        await instance.get('/longpollingupdates', {params: {offset: offset}})
        .then(function (response) {
            response.data.forEach(event => {
                processMessage(event);
            })
            longPollInvoke(response.headers['currentoffset'])
        })
        .catch(function (error) {
            console.log('Error:', error);
            longPollInvoke(offset)
        });
    }
  }

console.log("connecting using longpolling")
longPollInvoke(currentOffset)

