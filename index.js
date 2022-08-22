const express = require('express');
const ParseServer = require('parse-server').ParseServer;
const path = require('path');

if(process.env.LOG_LEVEL === "DEBUG") {
  console.log('ENVIRONMENT VARIABLES: ', {
    DATABASE_CONNECTION_URI: process.env.DATABASE_CONNECTION_URI,
    SERVER_URL: process.env.SERVER_URL,
    PORT: process.env.PORT,
    PARSE_APP_ID: process.env.PARSE_APP_ID,
    PARSE_MOUNT: process.env.PARSE_MOUNT,
    CLOUD_CODE_MAIN: process.env.CLOUD_CODE_MAIN,
  })
}

if (!process.env.DATABASE_CONNECTION_URI) {
  console.warn('DATABASE_CONNECTION_URI not specified, falling back to: mongodb://localhost:27017/app.');
}
if (!process.env.SERVER_URL) {
  console.warn('SERVER_URL not specified, falling back to: http://localhost:1337/parse.');
}
if (!process.env.PORT) {
  console.warn('PORT not specified, falling back to default port: 1337.');
}
if (!process.env.PARSE_MOUNT) {
  console.warn('PARSE_MOUNT not specified, falling back to default: /parse.');
}
if (!process.env.CLOUD_CODE_MAIN) {
  console.warn('CLOUD_CODE_MAIN not specified, falling back to default: ' + __dirname + '/cloud/main.js');
}
if (!process.env.PARSE_APP_ID) {
  console.error('No PARSE_APP_ID is specified!');
}
if (!process.env.PARSE_MASTER_KEY) {
  console.error('No PARSE_MASTER_KEY is specified!');
}

const databaseConnectionUri = process.env.DATABASE_CONNECTION_URI || 'mongodb://localhost:27017/app';
const serverUrl = process.env.SERVER_URL || 'http://localhost:1337/parse';
const port = process.env.PORT || 1337;

const config = {
  databaseURI: databaseConnectionUri ,
  appId: process.env.PARSE_APP_ID,
  masterKey: process.env.PARSE_MASTER_KEY,
  serverURL: serverUrl,
  cloud: process.env.CLOUD_CODE_MAIN || __dirname + '/cloud/main.js',
};


const app = express();

// Serve the Parse API on the PARSE_MOUNT URL prefix
const mountPath = process.env.PARSE_MOUNT || '/parse';
const api = new ParseServer(config);
app.use(mountPath, api);


// Parse Server plays nicely with the rest of your web routes
app.get('/', function (req, res) {
  res.status(200).send('This is a test response...');
});

const httpServer = require('http').createServer(app);
httpServer.listen(port, function () {
  console.log('parse-server running on port ' + port + '.');
});

module.exports = {
  app,
  config,
};
