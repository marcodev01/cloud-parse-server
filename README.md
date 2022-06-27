# cloud-parse-server
Dockerized parser server for running in cloud

## Preconditions
 - Install docker desktop
 - (optional) install nodejs and npm

## Setup with mongo-db
1. Create [docker network](https://docs.docker.com/get-started/07_multi_container/): `docker network create parse-server`
2. Pull [offical mongo-db](https://hub.docker.com/_/mongo) docker image: `docker pull mongo`
3. Create parse server docker image: `docker build -t parse-server .`
4. Run mongo-db image inside `parse-server` network: `docker run -d --network parse-server --name mongo-db -p 27017:27017 mongo`
5. Run parse-server image: `docker run --network parse-server --name parse-server -p 1337:1337 parse-server`

## Documentation
- https://github.com/parse-community/parse-server
- https://docs.parseplatform.org/parse-server/guide/
- https://github.com/parse-community/parse-server-example