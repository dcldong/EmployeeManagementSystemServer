FROM  node:14.18.3

WORKDIR /home

COPY . /home
RUN npm install

EXPOSE 80
CMD ["npm", "run","serve"]