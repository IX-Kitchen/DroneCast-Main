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

### Installing

```
git clone https://github.com/IX-Kitchen/DroneCast-Main.git
cd DroneCast-Main/
# Change to a stable commit
git checkout v1.0
```
Install dependencies
```
npm install
(cd client; npm install)
```
Set server url and port configuration in the file ./client/src/api-config.js if needed

Set the environment variables in the .env.example file and change its name to .env
(Default variables will work if everything is running in localhost)

Start backend server (Default port: 8080, nohup can be used to run the task in background)
```
# nohup node server.js &
node server.js
```
The console should show the following message

```
Server listening at port 8080
```
Start React development server
```
# (cd client: nohup npm start &)
(cd client ; npm start)
```

Now you can access the backend API at:
http://localhost:8080/api

and the frontend app at:
http://localhost:3000