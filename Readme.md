# Assignment 6 - Group A-68

Streaming Wars Simulation developed in Java Spring Boot and React.js

## Prerequisites

Install and run [docker](https://docs.docker.com/docker-for-windows/install/)

## Start back-end server
Open a terminal window, and navigate to the **back-end** folder. Then type in the following commands in sequence:
```bash
docker build . -t group/streamingwars
docker run -p 8080:8080 group/streamingwars
```
Wait for the server to start. When you see something like this in your console:
```bash
2020-11-19 15:21:15.122 INFO 1 --- [ main] o.s.s.concurrent.ThreadPoolTaskExecutor : Initializing ExecutorService 'applicationTaskExecutor'

2020-11-19 15:21:15.522 INFO 1 --- [ main] o.s.b.w.embedded.tomcat.TomcatWebServer : Tomcat started on port(s): 8080 (http) with context path ''

2020-11-19 15:21:15.526 INFO 1 --- [ main] d.s.w.p.DocumentationPluginsBootstrapper : Context refreshed

2020-11-19 15:21:15.572 INFO 1 --- [ main] d.s.w.p.DocumentationPluginsBootstrapper : Found 1 custom documentation plugin(s)

2020-11-19 15:21:15.648 INFO 1 --- [ main] s.d.s.w.s.ApiListingReferenceScanner : Scanning for api listing references

2020-11-19 15:21:16.442 INFO 1 --- [ main] com.model.StreamingServiceApplication : Started StreamingServiceApplication in 11.309 seconds (JVM running for 13.61)
```
The back-end is now up and running. You can move on to the front-end section.

## Start front-end server
Open a **new** terminal window, and navigate to the **front-end** folder. Then type in the following command:
```bash
docker-compose up
```
This command will take a couple of minutes to complete as it has to download and install a lot of packages. Once you see something like this in your console:
```bash
streaming-wars-fe |

streaming-wars-fe | > streaming-wars@0.1.0 start /app

streaming-wars-fe | > react-scripts start

streaming-wars-fe |

streaming-wars-fe | ? ?wds?: Project is running at http://172.21.0.2/

streaming-wars-fe | ? ?wds?: webpack output is served from

streaming-wars-fe | ? ?wds?: Content not from webpack is served from /app/public

streaming-wars-fe | ? ?wds?: 404s will fallback to /

streaming-wars-fe | Starting the development server...

streaming-wars-fe |

streaming-wars-fe | Compiled with warnings.

streaming-wars-fe |
```
The front-end server is up and running. You can navigate to [localhost:3000](http://localhost:3000/) and start using the application.

## Note for testing the application
* When the application is first started up (fresh state), the only person that can log in to the system is admin. Log in as an admin using the account:\
 **username**: admin\
 **password**: password
* When admin creates a new entity, such as a demographic group, a studio, or a streaming service, he also creates a new user account whose username is the short name of that entity. You can then log in to that entity with the **password**: password.\
For example, if you create a new streaming service with the following details:
```JSON
shortName: netflix,
longName: Netflix Streaming Service 
```

You can log in to netflix with:\
**username**: netflix\
**password**: password

