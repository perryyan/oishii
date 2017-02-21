'use strict';

const fs      = require('fs');
const Clapp   = require('./modules/clapp-discord');
const cfg     = require('../config.js');
const pkg     = require('../package.json');
const Discord = require('discord.js');
const bot     = new Discord.Client();
const tumblrLib  = require('tumblr');
const foodsites  = require('../foodtumblrs.js').sites;
const shibesites = require('../shibetumblrs.js').sites;
const birbsites = require('../birbtumblrs.js').sites;
const duccsites = require('../ducctumblrs.js').sites;
const comfysites = require('../comfytumblrs.js').sites;

// Heroku workaround
const http = require('http');

const server = http.createServer( (req, res) => {
	res.writeHead(200, {'Content-Type': 'text/plain'});
})
server.listen( process.env.PORT );


var app = new Clapp.App({
  name: cfg.name,
  desc: pkg.description,
  prefix: cfg.prefix,
  version: pkg.version,
  onReply: (msg, context) => {
    // Fired when input is needed to be shown to the user.

    context.msg.reply('\n' + msg).then(bot_response => {
      if (cfg.deleteAfterReply.enabled) {
        context.msg.delete(cfg.deleteAfterReply.time)
          .then(msg => console.log(`Deleted message from ${msg.author}`))
          .catch(console.log);
        bot_response.delete(cfg.deleteAfterReply.time)
          .then(msg => console.log(`Deleted message from ${msg.author}`))
          .catch(console.log);
      }
    });
  }
});

// Load every command in the commands folder
fs.readdirSync('./lib/commands/').forEach(file => {
  app.addCommand(require("./commands/" + file));
});

bot.on('message', msg => {
  // Fired when someone sends a message
  if (!msg.content.startsWith('!')) return;
  if (msg.author.bot) return;


  if (msg.content.toLowerCase() === '!food') {
		getRandomPhoto( msg, foodsites );
  }

  else if (msg.content.toLowerCase() === '!shibe') {
  	getRandomPhoto( msg, shibesites );
  }

  else if (msg.content.toLowerCase() === '!birb') {
  	getRandomPhoto( msg, birbsites );
  }

  else if (msg.content.toLowerCase() === '!ducc') {
  	getRandomPhoto( msg, duccsites );
  }

	else if (msg.content.toLowerCase() === '!comfy') {
		getRandomPhoto( msg, comfysites );
	}

  if (app.isCliSentence(msg.content)) {
    app.parseInput(msg.content, {
      msg: msg
      // Keep adding properties to the context as you need them
    });
  }
});

bot.login(cfg.token).then(() => {
  console.log('Discord bot running!');
});

function getRandomPhoto( msg, sites, callback ) {

	var site = sites[Math.floor(Math.random()*sites.length)];
	var blog = new tumblrLib.Blog(site, cfg.tumblr_OAuth );

	console.log( '------\nSite: ' + site + '\n' );

	blog.photo( {type: 'photo', limit: '1'}, function( error, response ) {

		if( response && response.total_posts ) {
			console.log( 'Total posts: ' + response.total_posts );
			var offset = Math.floor( Math.random() * response.total_posts );
			console.log( 'Offset: ' + offset );
			var url = getURL( blog, offset, function( url ) {
        console.log( "The URL: " + url );
				msg.reply( url );
			});
		}
		else {
				msg.reply( "Try again later." );
		}
	});
};


function getURL( blog, offset, callback ) {

	blog.photo( {type: 'photo', limit: '1', offset: offset}, function(error, response) {
		// pick a post
		var posts = response.posts;
		if( !posts ) {
			return callback( "Post is empty" );
		}

    if( posts.length < 1 || posts[0].photos.length < 1 )
    {
      return callback( "Post doesn't contain a URL!");
    }

		var url = posts[0].photos[0].original_size.url;
		return callback( url );
	});

};
