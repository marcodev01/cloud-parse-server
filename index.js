'use strict';

const express = require('express');
const ParseServer = require('parse-server').ParseServer;
const ParseDashboard = require('parse-dashboard');

// default values if no env variable is defined. Should only be used for local development!
const DEFAULT_PARSE_SERVER_DATABASE_URI = 'mongodb://localhost:27017/app';
const DEFAULT_PARSE_SERVER_URL = 'http://localhost:1337/parse';
const DEFAULT_PORT = 1337;
const DEFAULT_PARSE_MOUNT_PATH = '/parse';
const DEFAULT_DASHBOARD_MOUNT_PATH = '/dashboard';
const DEFAULT_PARSE_SERVER_APP_NAME = 'my-parse-server';


if (process.env.LOG_LEVEL === 'DEBUG') {
  console.log('ENVIRONMENT VARIABLES: ', {
    PARSE_SERVER_DATABASE_URI: process.env.PARSE_SERVER_DATABASE_URI,
    PARSE_SERVER_URL: process.env.PARSE_SERVER_URL,
    PORT: process.env.PORT,
    PARSE_SERVER_APPLICATION_ID: process.env.PARSE_SERVER_APPLICATION_ID,
    PARSE_MOUNT_PATH: process.env.PARSE_MOUNT_PATH,
    DASHBOARD_MOUNT: process.env.DASHBOARD_MOUNT_PATH,
    APP_NAME: process.env.PARSE_SERVER_APP_NAME
  })
}

if (!process.env.PARSE_SERVER_DATABASE_URI) {
  console.info(`PARSE_SERVER_DATABASE_URI not specified, falling back to: ${DEFAULT_PARSE_SERVER_DATABASE_URI}`);
}
if (!process.env.PARSE_SERVER_URL) {
  console.info(`SERVER_URL not specified, falling back to: ${DEFAULT_PARSE_SERVER_URL}`);
}
if (!process.env.PORT) {
  console.info(`PORT not specified, falling back to default port: ${DEFAULT_PORT}`);
}
if (!process.env.PARSE_MOUNT_PATH) {
  console.info(`PARSE_MOUNT not specified, falling back to default: ${DEFAULT_PARSE_MOUNT_PATH}`);
}
if (!process.env.DASHBOARD_MOUNT_PATH) {
  console.info(`DASHBOARD_MOUNT not specified, falling back to default: ${DEFAULT_DASHBOARD_MOUNT_PATH}`);
}

const databaseConnectionUri = process.env.PARSE_SERVER_DATABASE_URI || DEFAULT_PARSE_SERVER_DATABASE_URI;
const serverUrl = process.env.PARSE_SERVER_URL || DEFAULT_PARSE_SERVER_URL;
const port = process.env.PORT || DEFAULT_PORT;
const cloudFunctionsPath = __dirname + '/cloud/main.js'
const parseMountPath = process.env.PARSE_MOUNT_PATH || DEFAULT_PARSE_MOUNT_PATH;
const dashboardMountPath = process.env.DASHBOARD_MOUNT_PATH || DEFAULT_DASHBOARD_MOUNT_PATH;
const appName = process.env.PARSE_SERVER_APP_NAME || DEFAULT_PARSE_SERVER_APP_NAME;

const apiConfig = {
  databaseURI: databaseConnectionUri,
  appId: process.env.PARSE_SERVER_APPLICATION_ID,
  masterKey: process.env.PARSE_SERVER_MASTER_KEY,
  readOnlyMasterKey: process.env.PARSE_READ_ONLY_MASTER_KEY,
  serverURL: serverUrl,
  cloud: cloudFunctionsPath,
  // prevent clients can create new classes
  allowClientClassCreation: false,
  liveQuery: {
    // enable live queries via ws protocol for specific class names
    classNames: ['RatingEntry']
  },
  passwordPolicy: {
    // password of at least 6 characters which contain at least 1 lower case, 1 upper case and 1 digit
    validatorPattern: /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.{6,})/,
    doNotAllowUsername: true,
    maxPasswordHistory: 5,
  }
  // further options see: https://parseplatform.org/parse-server/api/master/ParseServerOptions.html
};

const dashboardConfig = {
  appId: process.env.PARSE_SERVER_APPLICATION_ID,
  masterKey: process.env.PARSE_SERVER_MASTER_KEY,
  readOnlyMasterKey: process.env.PARSE_READ_ONLY_MASTER_KEY,
  serverURL: serverUrl,
  appName: appName,
  production: false
};


const app = express();

// serve the Parse API on the PARSE_MOUNT path
const api = new ParseServer(apiConfig);
app.use(parseMountPath, api);


// make the Parse Dashboard available at DASHBOARD_MOUNT path
const dashboard = new ParseDashboard({
  apps: [dashboardConfig],
  // if used behind load balancer: https://github.com/parse-community/parse-dashboard#security-considerations
  trustProxy: 1,
  users: [
    {
      user: "admin",
      pass: "$2a$12$0W1dmfJfsO5fULkJHCMC1edmeInQ8G3xbsLSbknVRs/1MUrYKkEbm" // admin1
    },
    {
      user: "read",
      pass: "$2a$12$FGNhCH6JkXqrScx/X8JUWuFMwVHNIr0Yy.5MgH0fM8KrhimhAQ0Gm", // reader1
      readOnly: true,
    }
  ],
  "useEncryptedPasswords": true
})
app.use(dashboardMountPath, dashboard);

const httpServer = require('http').createServer(app);
httpServer.listen(port, function () {
  console.log(`parse-server running on port: ${port}.`);
});
ParseServer.createLiveQueryServer(httpServer);

module.exports = {
  app,
  apiConfig
};
