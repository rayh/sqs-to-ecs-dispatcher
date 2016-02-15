FROM node

ADD . /dispatcher

ENTRYPOINT ["node", "/dispatcher/dispatch.js"]
