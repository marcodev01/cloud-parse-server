'use strict';

const express = require('express');
const ParseServer = require('parse-server').ParseServer;
const ParseDashboard = require('parse-dashboard');

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

const apiConfig = {
  databaseURI: process.env.PARSE_SERVER_DATABASE_URI,
  appId: process.env.PARSE_SERVER_APPLICATION_ID,
  masterKey: process.env.PARSE_SERVER_MASTER_KEY,
  readOnlyMasterKey: process.env.PARSE_READ_ONLY_MASTER_KEY,
  serverURL: process.env.PARSE_SERVER_URL,
  cloud: __dirname + '/cloud/main.js',
  // prevent clients can create new classes
  allowClientClassCreation: false,
  liveQuery: {
    // enable live queries via ws protocol for specific class names
    classNames: ['RatingEntry']
  },
  passwordPolicy: {
    // password of at least 3 characters which contain at least 1 lower case, 1 upper case and 1 digit
    validatorPattern: /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.{3,})/,
    doNotAllowUsername: true,
    maxPasswordHistory: 5,
  }
  // further options see: https://parseplatform.org/parse-server/api/master/ParseServerOptions.html
};

const dashboardConfig = {
  appId: process.env.PARSE_SERVER_APPLICATION_ID,
  masterKey: process.env.PARSE_SERVER_MASTER_KEY,
  readOnlyMasterKey: process.env.PARSE_READ_ONLY_MASTER_KEY,
  serverURL: process.env.PARSE_SERVER_URL,
  appName: process.env.PARSE_SERVER_APP_NAME,
  production: false
};


const app = express();

// serve the Parse API on the PARSE_MOUNT path
const api = new ParseServer(apiConfig);
app.use(process.env.PARSE_MOUNT_PATH || '/parse', api);


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
});
app.use(process.env.DASHBOARD_MOUNT_PATH || '/dashboard', dashboard);

// provide static ressources by expressJS - see: https://expressjs.com/en/starter/static-files.html
app.use(express.static('public'));

const httpServer = require('http').createServer(app);
httpServer.listen(process.env.PORT, function () {
  console.log(`parse-server running on port: ${process.env.PORT}.`);
});
ParseServer.createLiveQueryServer(httpServer);

module.exports = {
  app,
  apiConfig
};
