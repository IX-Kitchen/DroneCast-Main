# DroneCast - WebRTC

App creation feature for the DroneCast platform.
Developed with React, Node.js and MongoDB

## Description

Web interface to create DroneCast apps and to upload content to the server.

## Getting Started

### Prerequisites

Node.js and MongoDB are needed:

* [Node.js](https://nodejs.org)
* [MongoDB](https://www.mongodb.com/download-center?jmp=nav#community)

### Deployment

1. Install dependencies
```
git clone https://github.com/IX-Kitchen/DroneCast-Main.git
cd DroneCast-Main/
npm install
(cd client && yarn install)
```
2. Set deployment variables

Change the variables in the file *.env.example* file and change its name to *.env*
(Default variables are for local deployment)
```
mv .env.example .env
```

By default, the client access the api using the same host. Example:
Client -> http://test.com:3000/
API -> http://test.com:8080/

The API URL can be hardcoded in the file *./client/src/api-config.js* if it is needed.

3. Start the application

Start backend server (Default port: 8080, nohup can be used to run the task not attached to the session):
```
# nohup node server.js &
# or
# node server.js
```
The console should show the following message

```
Server listening at port 8080
```
Start React development server (npm or yarn)
```
# (cd client: nohup npm start &)
# or
# (cd client && npm start)
```

Now you can access the backend API at:
http://HOST:8080/

and the frontend app at:
http://HOST:3000/