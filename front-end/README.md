# Streaming Wars front-end

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Getting started

In the project directory, run:

### `npm install`
This will install all the required node modules.

Now run:
### `npm start`

And navigate to [http://localhost:3000](http://localhost:3000) to view the app in the browser (if you are not automatically redirected).

## Dockerizing the app
Download and install [Docker](https://www.docker.com/products/docker-desktop). Then from the project's directory, run:
### `docker-compose up`

This will build and start up a Docker image for the React app. Once the image is up and running, navigate to [localhost:3030](http://localhost:3030) and you should be able the app running.
#### Note

If you would like the change the port in which the React app runs on, in **docker-compose.yml**, under **ports**, change the part before the colon in:
### `- "3030:3000"`
to another port.