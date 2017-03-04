# oishii
Delivers images of food over chat applications (Discord, etc)

## Get started
To get started, clone this git repo then set up your environment variables

Examples:

```bash
export PORT=<webserver port>
export DISCORD_APPLICATION_TOKEN=<DISCORD API TOKEN>
export TUMBLR_OAUTH_CONSUMER_KEY=<TUMBLR CONSUMER KEY>
export TUMBLR_OAUTH_CONSUMER_SECRET=<TUMBLR CONSUMER SECRET>
export TUMBLR_OAUTH_TOKEN=<TUMBLR TOKEN>
export TUMBLR_OAUTH_TOKEN_SECRET=<TUMBLR TOKEN SECRET>
```

## Run the bot:
```bash
npm install
npm start
```

## Currently supported chat functions:
When this bot is added to your discord server, it will respond to the following actions:
* !food - pick a random food photo from tumblr
* !shibe - pick a random shiba inu photo from tumblr

## Heroku
This application runs great on heroku servers too. Just fork this repo and deploy it with the environment variables configured as above.

## Docker
Included in this repo is a dockerfile and a docker-compose template.
Simply include the environment variables above in the docker-compose.yml and start it using docker-compose up.
Or, if you prefer to run it in a standalone container,
```
docker build -t oishii/latest -f oishii-dockerfile
docker run  -p 49160:6969 -d oishii/latest \
-e PORT=6969 \
-e DISCORD_APPLICATION_TOKEN=<DISCORD API TOKEN> \
-e TUMBLR_OAUTH_CONSUMER_KEY=<TUMBLR CONSUMER KEY> \
-e TUMBLR_OAUTH_CONSUMER_SECRET=<TUMBLR CONSUMER SECRET> \
-e TUMBLR_OAUTH_TOKEN=<TUMBLR TOKEN> \
-e TUMBLR_OAUTH_TOKEN_SECRET=<TUMBLR TOKEN SECRET>
```
