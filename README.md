# dobbe-discord

A Discord bot made by and for DDOS @ Datasektionen

## Launch development environment

### Node.js

This project requires Node.js and the packade manager npm. Instructions how to install can be found on the [official website](https://nodejs.org/en/).

### Discord application

You first need to create a [Discord bot](https://discord.com/developers). There are many guides how to do that on the web. Google, or DuckDuckGo, is your friend.

### .env

Rename the file `sample.env` to `.env` and replace `<TOKEN>` with your Discord bot's. You can also enable another command prefix if you dont want the default one (`*`).

### Developer environment

Run the following command in the terminal:

```console
$ npm install
$ npm run dev
```



### Docker Compose

This project uses docker-compose for easier deployment of the database. Instructions can be found [here](https://docs.docker.com/compose/gettingstarted/).

To start:
```console
$ docker-compose up -d
```

To stop:
```console
$ docker-compose down
```

Please note that the first time you run the project you need to create an database user within the mongodb container. To do so:
```console
$ docker ps # Find container id of mongodb
$ docker exec -it <ID> bash # Run bash inside container
$ mongosh -u root -p root # Log into mongo with root
test> use dobbe-discord
dobbe-discord> db.createUser({user:"user", pwd:"pass", roles:[{role:"readWrite", db:"dobbe-discord"}]})
```
Dont forget to add the mongodb user credentials to the .env file

### Tests

The project uses [Jest](https://jestjs.io/) for testing. Run with command:

```console
$ npm test
```

To run the tests with code coverage (currently fails due to un fulfilled global coverage threshold):

```console
$ npm run test:coverage
```
