# cloud-parse-server
Dockerized parse server for running in cloud environment. Parse Server is meant to be mounted on an (ExpressJS)[https://expressjs.com/] app.

## Preconditions
 - Install `docker` desktop
 - Install `nodejs` and `npm`

## Docker setup with dockerized mongo-db
1. To run the docker image in **local environment** set in your `Dockerfile` the `start-local` script (with predifend env vars) as `CMD` instruction parameter  
1. Create [docker network](https://docs.docker.com/get-started/07_multi_container/): `docker network create parse-server`
1. Pull [offical mongo-db](https://hub.docker.com/_/mongo) docker image: `docker pull mongo`
1. Create parse server docker image: `docker build -t parse-server .`
1. Run mongo-db image inside `parse-server` network: `docker run -d --network parse-server --name mongo-db -p 27017:27017 mongo`
1. Run parse-server image: `docker run --network parse-server --name parse-server -p 1337:1337 parse-server`

## Local setup
1. Start your mongo-db: either locally, in a docker container or as DBaaS service.
1. Run `npm run start-local` (with predifend env vars)

# User permissions and security
- Create new classes (e.g. RatingEntry) by Parse Dasboard. **Note:** Class creation by client is explicitly restricted by `allowClientClassCreation: false` setting. See: https://docs.parseplatform.org/parse-server/guide/#class-level-permissions
- Configure the [ACL (Access Controll Lists)](https://docs.parseplatform.org/rest/guide/#access-control-lists) and/or [CLP (Class Level Permission)](https://docs.parseplatform.org/rest/guide/#requires-authentication-permission-requires-parse-server---230) for your classes via Parse Dashboard or Parse API
- For more coarse-grained control over access to pieces of your data, you can additionally specify [roles](https://docs.parseplatform.org/rest/guide/#roles) and attach them to users *(not implemented in demo app)*.
- See also: https://docs.parseplatform.org/js/guide/#security

# Dashboard
In this setup Parse Dashboard is running on **same instance** than Parse server. 
Parse Dashboard is a standalone CMS with additional features to manage your Parse Server.
- Access Parse Dasboard: `PARSE_SERVER_URL/dashboard`
- You need to login with any user configured in your `dashboard` setup defintion

For Parse Dasboard documentation see: https://github.com/parse-community/parse-dashboard 

# Cloud Code
To run logic on server side **Cloud Code** is built into Parse Server. In the projects `./cloud` folder some [Cloud Functions](https://docs.parseplatform.org/cloudcode/guide/#cloud-functions) and [Triggers](https://docs.parseplatform.org/cloudcode/guide/#save-triggers) are implemented for demo purposes. 
Furthermore [LiveQuery Triggers](https://docs.parseplatform.org/cloudcode/guide/#livequery-triggers) with underlying Weboscket connection are implemented for reactive data updates. 

For more details see Cloud Code documentation: https://docs.parseplatform.org/cloudcode/guide/

# Further documentation
https://github.com/parse-community/parse-server \
https://docs.parseplatform.org/parse-server/guide/ \
https://parseplatform.org/parse-server/api/master/index.html \
https://docs.parseplatform.org/rest/guide/