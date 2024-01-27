FROM node:slim

WORKDIR /app

COPY . .

EXPOSE 3000

RUN apt update -y &&\
    chmod +x index.js &&\
    npm install -g npm@latest 
    
CMD ["node", "index.js"]
