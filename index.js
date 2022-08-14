const express = require('express');
const ParseServer = require('parse-server').ParseServer;

const databaseUri = process.env.DATABASE_URI;

if (!databaseUri) {
  console.log('DATABASE_URI not specified, falling back to localhost.');
}
const config = {
  databaseURI: databaseUri || 'mongodb://mongo-db:27017/app',
  appId: process.env.APP_ID,
  masterKey: process.env.MASTER_KEY, 
  serverURL:  'http://localhost:1337/parse',
};


const app = express();

// Serve the Parse API on the /parse URL prefix
const mountPath = process.env.PARSE_MOUNT || '/parse';
const api = new ParseServer(config);
app.use(mountPath, api);


// Parse Server plays nicely with the rest of your web routes
app.get('/', function (req, res) {
  res.status(200).send('I dream of being a website.  Please star the parse-server repo on GitHub!');
});

const port = process.env.PORT || 1337;

const httpServer = require('http').createServer(app);
httpServer.listen(port, function () {
  console.log('parse-server-example running on port ' + port + '.');
});

module.exports = {
  app,
  config,
};
