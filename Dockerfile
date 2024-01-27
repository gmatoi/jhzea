FROM node:slim

WORKDIR /app

COPY . .

EXPOSE 3001

RUN apt update -y &&\
    chmod +x index.js &&\
    npm install -g npm 
    
CMD ["node", "index.js"]
