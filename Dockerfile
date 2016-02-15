FROM node
MAINTAINER ray@wirestorm.net

ADD . /dispatcher

ENTRYPOINT ["node", "/dispatcher/index.js"]
