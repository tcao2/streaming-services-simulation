# StreamingService
StreamingService Backend

Clone this project.

Go the repository root.

Run the docker command :  docker build . -t group/streamingwars

Start the docker image using : 

Then start the app : docker run -p 8080:8080 group/streamingwars

you can now access the app using http://localhost:8080

All the endpoints with inputs are defined in the file : /src/test/HttpReq.http

Open API spec can be found here : http://localhost:8080/v2/api-docs

Please use this "https://editor.swagger.io/" and paste the open api spec to view the endpoints.
