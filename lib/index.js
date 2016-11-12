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

  
  if (msg.content === '!food') {
		getRandomPhoto( msg, foodsites );
  }
  
  else if (msg.content === '!shibe') {
  		getRandomPhoto( msg, shibesites );
  }
  
  else if (msg.content === '!birb') {
  		getRandomPhoto( msg, birbsites );
  }
  
  else if (msg.content === '!ducc') {
  		getRandomPhoto( msg, duccsites );
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
	
	var post_count = getPostCount( msg, blog, function( postCount ) { 
	
		if( !postCount || postCount < 1 ) {
			console.log( "Post count < 1 or not valid" );
			msg.reply( "Oops! Something went wrong. Try again later." );
		}
	
		else {
			var offset = Math.floor(Math.random() * postCount );
			var url = getURL( blog, offset );
			msg.reply( url );
		}
	});
};

/** gets the post count from a blog **/
function getPostCount( blog, callback ) {
	blog.info( function(error, response) {
		return callback( response ? response.blog.total_posts : -1 );
	});
};


function getURL( blog, offset, callback ) {
	blog.photo( {type: 'photo', limit: '20', offset: offset}, function(error, response) {
			
			if (error) {
				console.log( error );
			}
	
			// pick a post
			var posts = response.posts;
			
			var rng = Math.floor(Math.random()*posts.length);
			var attempts = 1;
			
			while( true ) {
				if ( posts[rng] || attempts > 20 ) break;
				rng = Math.floor(Math.random()*posts.length);
				attempts = attempts + 1;
			}
			
			console.log( '-------\n' +
				'Site: ' + site + '\n' +
				'PostCount: ' + postCount + '\n' +
				'Selected post: ' + offset + '\n' +
				'attempts : ' + attempts
			);
			
			if( attempts > 20 ) { 
				return "Oops! Something went wrong. Try again later.";
			}
			
			else {
				var url = posts[rng].photos[0].original_size.url;
				console.log( 'url: ' + url );
				return url;
			}
		});
	return "Oops! Something went wrong. Try again later.";
};