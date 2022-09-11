$(document).ready(function(){
  async function longPollInvoke() {
    await axios.get('http://localhost:3000', { timeout: 10000 })
        .then(function (response) {
            response.data.forEach(event => {
                console.log(event);
                document.write(event);
            })
        })
        .catch(function (error) {
            console.log('Error:', error);
        });
  }
  
  longPollInvoke();
 });
