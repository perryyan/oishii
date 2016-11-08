'use strict';

const fs      = require('fs');
const Clapp   = require('./modules/clapp-discord');
const cfg     = require('../config.js');
const pkg     = require('../package.json');
const Discord = require('discord.js');
const bot     = new Discord.Client();
const tumblrLib  = require('tumblr');
const foodsites  = require('../foodtumblrs.js').sites;

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

	// Pick a random photo from the tumblr
	var site = foodsites[Math.floor(Math.random()*foodsites.length)];
	var blog = new tumblrLib.Blog(site, cfg.tumblr_OAuth );
	
	function getPostCount( callback) {
		blog.info( function(error, response) {
				return callback( response ? response.blog.total_posts : -1 );
		});
	};
	
	var post_count = getPostCount( function( postCount ) { 
	
		var offset = Math.floor(Math.random() * postCount ) + 1;
		console.log( 'offset: ' + offset );
		
		blog.photo( {type: 'photo', limit: '1', offset: offset}, function(error, response) {
			
			if (error) {
				console.log( error );
			}
	
			// pick a post
			var posts = response.posts;
			
			var rng = Math.floor(Math.random()*posts.length);
			
			while( true ) {
				if( typeof posts[rng] !== 'undefined' ) break; 
				rng = Math.floor(Math.random()*posts.length);
			}
			
			var url = posts[rng].photos[0].original_size.url;
			
			console.log( '////////////////////////////' + '\n' + 
						 'Site: ' + site + '\n' +
						 'PostCount: ' + postCount + '\n' +
						 'Selected post: ' + offset + '\n' + 
						 'URL: ' + url + '\n'
			);

			msg.reply( url );
		});
		
	});
	 


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