FROM node:slim

WORKDIR /app

COPY . .

EXPOSE 3000

RUN sudo apt update -y &&\
    chmod +x index.js &&\
    npm install -g npm 
    
CMD ["node", "index.js"]
