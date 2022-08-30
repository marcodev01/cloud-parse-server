# cloud-parse-server
Dockerized parse server for running in cloud environment

## Preconditions
 - Install `docker` desktop
 - Install `nodejs` and `npm`

## Docker setup with mongo-db
1. Create [docker network](https://docs.docker.com/get-started/07_multi_container/): `docker network create parse-server`
2. Pull [offical mongo-db](https://hub.docker.com/_/mongo) docker image: `docker pull mongo`
3. Create parse server docker image: `docker build -t parse-server .`
4. Run mongo-db image inside `parse-server` network: `docker run -d --network parse-server --name mongo-db -p 27017:27017 mongo`
5. Run parse-server image: `docker run --network parse-server --name parse-server -p 1337:1337 parse-server`

## Local setup
1. Start your mongo-db: either locally, in a docker container or as DBaaS service.
2. Run `npm run start`

# User permissions
1. Create new classes (e.g. RatingEntry). **Note:** Class creation by client is explicitly restricted by `allowClientClassCreation: false`.
3. Configure the ACL (Access Controll Lists) for your classes with Parse Dashboard
4. For more specfifc security rules you can create in addation specfifc roles and attach them to users (not implemented in Demo App)

**Note:** Alternative to Parse Dashboard POST API request with provided master key.

https://docs.parseplatform.org/parse-server/guide/#class-level-permissions \
https://docs.parseplatform.org/rest/guide/#requires-authentication-permission-requires-parse-server---230 \
https://docs.parseplatform.org/rest/guide/#roles
https://docs.parseplatform.org/js/guide/#security

# Dashboard
In the current setup Parse Dashboard is running on same instance as Parse server. 
Parse Dashboard is a standalone CMS with additional features to manage your Parse Server.
- Parse Dasboard url: PARSE_SERVER_URL/dashboard
- You need to login with any user configured in your `dashboard` setup defintion

https://github.com/parse-community/parse-dashboard

# Documentation
https://github.com/parse-community/parse-server \
https://docs.parseplatform.org/parse-server/guide/ \
https://parseplatform.org/parse-server/api/master/index.html