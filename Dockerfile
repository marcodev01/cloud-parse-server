FROM node:latest

RUN mkdir parse

ADD . /parse
WORKDIR /parse
RUN npm install

ENV APP_ID mOYkwNZq5afeNePzifsH
ENV MASTER_KEY fUPMwubo9BW5lVPyH5fx
ENV DATABASE_URI mongodb+srv://admin:pw12345@casproject.4grft5j.mongodb.net/?retryWrites=true&w=majority

# Optional (default : 'parse/cloud/main.js')
# ENV CLOUD_CODE_MAIN cloudCodePath

# Optional (default : '/parse')
# ENV PARSE_MOUNT mountPath

EXPOSE 1337

# Uncomment if you want to access cloud code outside of your container
# A main.js file must be present, if not Parse will not start

# VOLUME /parse/cloud               

CMD [ "npm", "start" ]
