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
!food - pick a random food photo from tumblr
!shibe - pick a random shiba inu photo from tumblr

## Heroku
This application runs great on heroku servers too. Just fork this repo and deploy it with the environment variables configured as above.
