FROM node:latest

RUN mkdir parse

ADD . /parse
WORKDIR /parse
RUN npm install

# Must be same port as specified in env variables
EXPOSE 1337

# Uncomment if you want to access cloud code outside of your container
# A main.js file must be present, if not Parse will not start
# VOLUME /parse/cloud               

CMD [ "npm", "start" ]
