var source;
function sseInvoke() {
    source = new EventSource("../sseupdates");
    source.onmessage = function (event) {
        const data = JSON.parse(event.data);
        processMessage(data)
     }
}
console.log("connecting using SSE")
sseInvoke();