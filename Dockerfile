FROM node:latest

ENV APP_DIR /usr/src/app

# Prepare app directory
RUN mkdir -p $APP_DIR

# Trick to update image when dependency list is changed
COPY package.json $APP_DIR

# Install dependencies
WORKDIR $APP_DIR
RUN npm install

# Copy app resources
COPY . $APP_DIR

RUN npm run build-front

# Expose app port
EXPOSE 8000

# Run dev server
CMD npm start 
