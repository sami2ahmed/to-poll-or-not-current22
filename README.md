# to-poll-or-not-current22
repo for Sami and Amanda's Current '22 talk: "To Poll, or Not to Poll: Choosing the Right Streaming Protocol for Your Application". Watch the recording below, before it is removed in Nov. 2022.
[link](https://current22.mpeventapps.com/session-virtual/?v2477da705118cc74fd14460db021e1784e2eed5a7982c6482ec95cb2e86d259644b8741959f52a49e0e6908b82a9d860=18EBC7EDA78DEBFDB869C9E6C4AE36A24416DDDDB30A933368B4A64F62D5142E7288A2BA2B6EE462047C5FA2B9492D2D)

## pre-reqs

this code was built using nodejs 18.8.0.  

you'll need a confluent cloud cluster (probably makes sense to spin up a basic cluster for this use case).     

spin up an API key for the confluent cluster you want to display the data from & set up the following environment variables. For ease of reusing variables, use nodejs dontenv package as we do in each of the `consumer.js` code for SSE and Websockets. This will also allow the docker example to easily access your variables.

```
BOOTSTRAP_SERVERS="<BOOTSTRAP_SERVER>"
METADATA_BROKER_LIST="<BOOTSTRAP_SERVER>"
SASL_MECHANISMS="PLAIN"
SECURITY_PROTOCOL="SASL_SSL"
SASL_USERNAME="<API_KEY>"
SASL_PASSWORD="<API_SECRET>"
```
If you would like to use the same data we show in the demo (trading data). Then you will need to join a paid tier for retrieving api keys from [IEX Cloud](https://iexcloud.io/docs/api/#cryptocurrency-events). Then you will see instructions in the comments of the sse-producer.js found within the "SSE" dir for how to run the producer to populate your Confluent cluster.

## docker quickstart
To bring up the SSE and websocket applications with docker [like this](https://asciinema.org/a/Cc227lcxhhnF7oJJpU0wdpwT1) you can refer to the docker-compose.yml file.
I built each image by heading into the Websocket and SSE dirs respectively and building each image i.e.
```
docker build . -t ag/websockets-app6
docker build . -t sahmed/node-sse-app21
```
then from the root of this repo, you should be able to `docker compose up -d` and see the two containers start so you can conduct chaos tests etc. like I am doing in the Confluent Current video recap.

## Pumba (chaos tests)
The chaos tests I ran against the containers were these three, to test network egress delay and packet loss behaviors:
```
pumba -l info netem --duration 1000s delay --time 100000 websocket-app sse-app
pumba -l info netem --duration 2m delay --time 1000 -j 500 websocket-app sse-app
pumba netem --duration 5m corrupt --percent 8 websocket-app sse-app
```
You can get started with Pumba by following the instructions on their repo [here](https://github.com/alexei-led/pumba)

## run web sockets

run the server:      
```
cd websocket
npm install
node app.js
```

open a browser client by navigating to [localhost:3000](localhost:3000) and watch your topics stream in.   

## run SSE   

run the server:      
```
cd SSE
npm install
node app.js
```

open a browser client by navigating to [localhost:3010](localhost:3010) and watch your topics data stream in.   


## run long polling

run the server:      
```
cd longpolling
npm install
node app.js
```

open a browser client by navigating to [localhost:3000](localhost:3000) and watch your topics data stream in.   


## run all three (toggle on a browser)

run the server:      
```
cd all-three
npm install
node app.js
```

open a browser client by navigating to [localhost:3000](localhost:3000) and select the connection mechanism you want to use. You'll be redirected to a page with your data stream. You can toggle between types by selecting "Change Connection Type".  



# references

s/o to [Lucas Jellema's Online Meetup Code](https://github.com/AMIS-Services/online-meetups-introduction-of-kafka/tree/master/lab2b-topic-watcher) that served as the backbone for a lot of our front end code. This meetup showcased SSEs.
