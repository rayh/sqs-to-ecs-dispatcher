FROM node

ADD . /dispatcher

ENTRYPOINT ["node", "/dispatcher/index.js"]
