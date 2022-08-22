const express = require('express');
const ParseServer = require('parse-server').ParseServer;
const ParseDashboard = require('parse-dashboard');

if (process.env.LOG_LEVEL === "DEBUG") {
  console.log('ENVIRONMENT VARIABLES: ', {
    DATABASE_CONNECTION_URI: process.env.DATABASE_CONNECTION_URI,
    SERVER_URL: process.env.SERVER_URL,
    PORT: process.env.PORT,
    PARSE_APP_ID: process.env.PARSE_APP_ID,
    PARSE_MOUNT: process.env.PARSE_MOUNT,
    DASHBOARD_MOUNT: process.env.DASHBOARD_MOUNT,
    APP_NAME: process.env.APP_NAME
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
if (!process.env.DASHBOARD_MOUNT) {
  console.warn('DASHBOARD_MOUNT not specified, falling back to default: /dashboard.');
}

const databaseConnectionUri = process.env.DATABASE_CONNECTION_URI || 'mongodb://localhost:27017/app';
const serverUrl = process.env.SERVER_URL || 'http://localhost:1337/parse';
const port = process.env.PORT || 1337;
const cloudFunctionsPath = __dirname + '/cloud/main.js'
const parseMountPath = process.env.PARSE_MOUNT || '/parse';
const dashboardMountPath = process.env.DASHBOARD_MOUNT || '/dashboard';
const appName = process.env.APP_NAME || 'my-parse-server';

const apiConfig = {
  databaseURI: databaseConnectionUri,
  appId: process.env.PARSE_APP_ID,
  masterKey: process.env.PARSE_MASTER_KEY,
  serverURL: serverUrl,
  cloud: cloudFunctionsPath,
};

const dashboardConfig = {
  appId: process.env.PARSE_APP_ID,
  masterKey: process.env.PARSE_MASTER_KEY,
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
