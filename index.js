const express = require('express');
const ParseServer = require('parse-server').ParseServer;
const ParseDashboard = require('parse-dashboard');

process.env.PARSE_SERVER_APPLICATION_ID = "mOYkwNZq5afeNePzifsH"
process.env.PARSE_SERVER_MASTER_KEY = 'fUPMwubo9BW5lVPyH5fx'


if (process.env.LOG_LEVEL === "DEBUG") {
  console.log('ENVIRONMENT VARIABLES: ', {
    PARSE_SERVER_DATABASE_URI: process.env.PARSE_SERVER_DATABASE_URI,
    PARSE_SERVER_URL: process.env.PARSE_SERVER_URL,
    PORT: process.env.PORT,
    PARSE_SERVER_APPLICATION_ID: process.env.PARSE_SERVER_APPLICATION_ID,
    PARSE_SERVER_MOUNT_PATH: process.env.PARSE_MOUNT_PATH,
    DASHBOARD_MOUNT: process.env.DASHBOARD_MOUNT_PATH,
    APP_NAME: process.env.PARSE_SERVER_APP_NAME
  })
}

if (!process.env.PARSE_SERVER_DATABASE_URI) {
  console.warn('PARSE_SERVER_DATABASE_URI not specified, falling back to: mongodb://localhost:27017/app.');
}
if (!process.env.PARSE_SERVER_URL) {
  console.warn('SERVER_URL not specified, falling back to: http://localhost:1337/parse.');
}
if (!process.env.PORT) {
  console.warn('PORT not specified, falling back to default port: 1337.');
}
if (!process.env.PARSE_MOUNT_PATH) {
  console.warn('PARSE_MOUNT not specified, falling back to default: /parse.');
}
if (!process.env.DASHBOARD_MOUNT_PATH) {
  console.warn('DASHBOARD_MOUNT not specified, falling back to default: /dashboard.');
}

const databaseConnectionUri = process.env.PARSE_SERVER_DATABASE_URI || 'mongodb://localhost:27017/app';
const serverUrl = process.env.PARSE_SERVER_URL || 'http://localhost:1337/parse';
const port = process.env.PORT || 1337;
const cloudFunctionsPath = __dirname + '/cloud/main.js'
const parseMountPath = process.env.PARSE_MOUNT_PATH || '/parse';
const dashboardMountPath = process.env.DASHBOARD_MOUNT_PATH || '/dashboard';
const appName = process.env.PARSE_SERVER_APP_NAME || 'my-parse-server';

const apiConfig = {
  databaseURI: databaseConnectionUri,
  appId: process.env.PARSE_SERVER_APPLICATION_ID,
  masterKey: process.env.PARSE_SERVER_MASTER_KEY,
  serverURL: serverUrl,
  cloud: cloudFunctionsPath,


  // accountLockout: {
  //   duration: 5,
  //   threshold: 3,
  //   unlockOnPasswordReset: true,
  // },
  
  // passwordPolicy: {    
  //   validatorPattern: /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.{8,})/,
  //   doNotAllowUsername: true,
  //   maxPasswordHistory: 5,
  // }
};

const dashboardConfig = {
  appId: process.env.PARSE_SERVER_APPLICATION_ID,
  masterKey: process.env.PARSE_SERVER_MASTER_KEY,
  serverURL: serverUrl,
  appName: appName
};


const app = express();

// serve the Parse API on the PARSE_MOUNT path
const api = new ParseServer(apiConfig);
app.use(parseMountPath, api);


// make the Parse Dashboard available at DASHBOARD_MOUNT path
const dashboard = new ParseDashboard({
  apps: [dashboardConfig]
})
app.use(dashboardMountPath, dashboard);


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
  apiConfig
};
