# Country by IP
## General description
This service exposes an API to get the country code based on IP.
It is based on the `ipgeolocation.io` service and exposes the `country_code2` field as seen
in the [ip location api doc](https://ipgeolocation.io/ip-location-api.html).

## Building the service
### Prerequisites
Before building the service you need to have installed the following on your machine:
1. yarn
2. node
3. docker (with docker-compose support)

### Clone
Download or clone the service from github.  
```
git clone https://github.com/noamshabat/CountryByIp.git
```

### Update your .env file
The project requires updating a `.env` file with an api key for the ipgeolocation service. If you dont have one, you can sign up for a free account [here](https://ipgeolocation.io/signup.html).   
Copy the `.env.example` file to create a `.env` file, and update the IP_GEOLOCATION_KEY environment variable with your key.

### Build
```
yarn && npm run build
```   
This will fetch pre-requisite packages, build the codebase, and build the docker image required to run the service.

## Running the service
```
docker-compose up
```

## Using the service
By default, the service runs on port `5005`.   
It has 3 endpoints:
* http://localhost:5005/test - will simply return `OK` if the service is up and functioning.
* http://localhost:5005/shutdown - will shutdown the service and container.
* http://localhost:5005/getip?ip=SOME_IP - will return the country code of the `ip` provided by the `SOME_IP` query parameter. Supports ipv4 and ipv6. If an invalid ip is provided, the service will return http code 400 with `Invalid ip` and specify the bad input that was received.
* Any unknown route will return http code 404 and the message 'unknown route'

# Thanks
* Ip address regex validation:   
  * https://www.geeksforgeeks.org/how-to-validate-an-ip-address-using-regex/
* Dockerizing a nodejs app using docker-compose
  * https://snyk.io/blog/10-best-practices-to-containerize-nodejs-web-applications-with-docker/
  * https://docs.docker.com/compose/gettingstarted/

  