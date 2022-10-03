# to-poll-or-not-current22
repo for Sami and Amanda's Current '22 talk: "To Poll, or Not to Poll: Choosing the Right Streaming Protocol for Your Application"

## pre-reqs

this code was built using nodejs 18.8.0.  

you'll need a confluent cloud cluster (probably makes sense to spin up a basic cluster for this use case).     

spin up an API key for the kafka cluster you want to display the data from & set up the following environment variables : 
```
BOOTSTRAP_SERVERS="<BOOTSTRAP_SERVER>"
METADATA_BROKER_LIST="<BOOTSTRAP_SERVER>"
SASL_MECHANISMS="PLAIN"
SECURITY_PROTOCOL="SASL_SSL"
SASL_USERNAME="<API_KEY>"
SASL_PASSWORD="<API_SECRET>"
```

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



