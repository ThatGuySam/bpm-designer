EchoTracks = new Mongo.Collection('echotracks');

const RESULTS_COUNT = 6;

if (Meteor.isClient) {
	Meteor.subscribe("echotracks");
	
	var value = 0;
	var bpminput;
	var inputTimer;
	
	var bpmItemTypes = {
		multiples:	{ 
			icon: "×", 
			outputs: [2, 0.5, 3, 4], 
			getOutputs: function (bpm,x) { return bpm * x; }
		}, 
		divisibles:	{ 
			icon: "÷", 
			outputs: [1, 2, 3, 4], 
			getOutputs: function (bpm,x) { return (bpm / 60) * x; }, 
		}//TODO: detect if icon is value letters and add as class	
		//colors: 	{},//TODO: Sets of common colors for this BPM or speed/mood
		//songs:		{},//TODO: detect popular songs with this bpm from http://developer.echonest.com/
		//video:		{},
	};
	
	var multiples = bpmItemTypes.multiples;
	var divisibles = bpmItemTypes.divisibles;
	
	
	//Web Font Loader
	WebFontConfig = {
		typekit: { id: 'xes4zaz' }
	};
	
	(function(d) {
		var wf = d.createElement('script'), s = d.scripts[0];
		wf.src = 'https://ajax.googleapis.com/ajax/libs/webfont/1.5.18/webfont.js';
		s.parentNode.insertBefore(wf, s);
	})(document);
	
	
	//Initial BPM Values
	Session.set('bpmValue', []);
	
	Session.set('bpmContainer', { classes: "empty" });
	
	//Is number
	function isInt(value) {
		return !isNaN(value) && 
		parseInt(Number(value)) == value && 
		!isNaN(parseInt(value, 10));
	}
	
	function parseBPM(val){
		
		var bpm = parseInt(val);
		
		var output = [];
		
		t = 0; 
		for (var key in bpmItemTypes) {
			if ( is.object(bpmItemTypes) ) {
				
				var itemType = bpmItemTypes[key];
				var outputType = {};
				
				outputType.icon = itemType.icon;
				
				//outputType.subHeader
				
				outputType.header = (Math.round( itemType.getOutputs(bpm,itemType.outputs[0]) * 100 ) / 100).toString();
				
				outputType.secondary = "";
				
				outputType.animDelay = (200 * t) + 50;
				
				for (i = 1; i < itemType.outputs.length; i++) { 
					
					var number = (Math.round( itemType.getOutputs(bpm,itemType.outputs[i]) * 100 ) / 100).toString();
					
					outputType.secondary += number + " ";
				}
				
				output.push( outputType );
				
				t++;
			}
		}
		
		return output;
		
	}
	
	function getBPM(songs) {
		
		var output = [];
		
		//console.log( songs );
		
		if( is.undefined( songs.length ) ) {console.log(val); console.log(songs);}
		
		for (t = 0; t < songs.length; t++) {
			
			var song = songs[t];
			var songOutput = {};
			var bpm = song.audio_summary.tempo;
			
			//TODO: Check if it's cached first
			
			Meteor.call("cacheTrack", song);//TODO: Move Serverside for smarter security
			
			songOutput.subHeader = song.title + " - " + song.artist_name;
			
			songOutput.header = (Math.round( bpm * 100 ) / 100).toString();
			
			//songOutput.secondary = song.artist_name;
			
/*
			for (i = 0; i < multiples.outputs.length; i++) { 
				
				var number = (Math.round( multiples.getOutputs(bpm,multiples.outputs[i]) * 100 ) / 100).toString();
				
				multiples.secondary += number + " ";
			}
*/
			
			songOutput.animDelay = (200 * t) + 50;
			
			output.push( songOutput );
		}
		
		return output;
		
	}
	
	function generateOutput(output, classes) {
		
		console.log( "Output: " );
		console.log( output );
				
		Session.set('bpmValue', output);
		Session.set('bpmContainer', { classes: "has-items" });
		Session.set('bpmContainer', { maxHeight: RESULTS_COUNT + "px" });
		
	}
	
	//Templating Functions
	Template.body.helpers({
		message: function() {
			
			//var output = JSON.stringify( Session.get('message') );
			
			//console.log( Session.get('message') );
			
			//return output;
		},
	});
	
	
	Template.body.events({
		'keyup #bpminput': function(event){//Keyup Listener
			
			var	val = event.target.value;
			var output;
			
			inputTimer && clearTimeout(inputTimer);
			
			//Is it empty?
			if( val != "" ) {
				
				//var bpmInt = parseInt(val);
				var classes = "has-items";
				
					
				inputTimer = setTimeout(function() {
					
					if( isInt(val) ){
						output = parseBPM(val);
					} else {
					
						console.log( "Search started" );
						
						Meteor.call("echonest", val, function(err, data) {
							if (err)
								console.log(err);
							
							Session.set('message', data);
							
						});
						
						var songs = Session.get('message');
						
						output = getBPM(songs);
						
						generateOutput(output, classes);
						
					}
					
				}, 750);//inputTimer function
					
				//console.log( Session.get('bpmValue') );
				
			} else if( val == "" ){
				Session.set('bpmValue', []);
				Session.set('bpmContainer', { classes: "empty" });
			}
			 
			//event.target.title.value = "";
			 
			return false;
		 
		}
		//'keydown': function(e) {}//TODO: Focus on keydown
	});
	

	
	//
	//Front-end UI stuff
	//
	
	Template.bpmContainer.helpers({
		bpmItems: function() {
			
			var output = Session.get('bpmValue');
			
			return output;
		},
		
		classes: function() {
			
			var bpmContainerProperties = Session.get('bpmContainer');
			
			var output = bpmContainerProperties.classes;//Session.get('bpmContainer');
			
			return output;
		}
	});
	
	Template.bpmItem.animations({
	  ".item": {
	    container: ".bpm-output", // container of the ".item" elements
	    insert: {
	      class: "fadeInUp", // class applied to inserted elements
	      before: function(attrs, element, template) {}, // callback before the insert animation is triggered
	      after: function(attrs, element, template) {}, // callback after an element gets inserted
	      delay: 0 // Delay before inserted items animate
	    },
	    remove: {
	      class: "fadeOutDown", // class applied to removed elements
	      before: function(attrs, element, template) {}, // callback before the remove animation is triggered
	      after: function(attrs, element, template) {}, // callback after an element gets removed
	      delay: 0 // Delay before removed items animate
	    },
	    animateInitial: true, // animate the elements already rendered
	    animateInitialStep: 200, // Step between animations for each initial item
	    animateInitialDelay: 200 // Delay before the initial items animate
	  }
	});
	
	//When Template is ready
	Template.bpmContainer.rendered = function() {//When the BPM interface is loaded...
		
		//Define Number Input
		bpminput = document.getElementById("bpminput");
		
		//Onload Focus 
		bpminput.focus();
		
	};
	

}

if (Meteor.isServer) {
	
	//Echnest API
	var echojs = Meteor.npmRequire('echojs');
	var echoClient = echojs({key: Meteor.settings.echonest.key });
	//Genius API
	var Genius = Meteor.npmRequire('node-genius');
	var geniusClient = new Genius( Meteor.settings.genius.token );
	
	Meteor.startup(function () {
		// code to run on server at startup
		
	});
	
	//Server Side Processing
	Meteor.methods({
		getTrack: function(song) {//Always runs
			
			//Check client data
			check( song, {
			  id: String
			});
			
			var echo = EchoTracks.findOne(song.id);
			
			//EchoTracks.update(id, {$set: { checked: checked}});
			
			return echo;
		},
		cacheTrack: function(song) {//Runs for new or outdated tracks
			
			EchoTracks.update(song.id, {
				$set: {
					createdAt:	new Date(),
					_id:		song.id,
					artist:		song.artist_name,
					title:		song.title,
					data:		song,
				}
			},
			{ upsert: 1 });

		},
		getHost: function() {
			var host = this.connection.httpHeaders.host;
			
			return host;
		},
		echonest: function(val) {
			
			check( val, String);
			
			var output = {};
			
			//Get Echonest results
			var output = Async.runSync(function(done) {//Wait get() to finish
				echoClient('song/search').get({
					combined:	val,
					//artist: "hillsong",
					results:	RESULTS_COUNT,
					limit: 		true,
					//sort: "artist_familiarity-asc",//song_hotttnesss-asc, artist_familiarity-asc, artist_hotttnesss-asc
					bucket: [
						"audio_summary",
						"song_type",
						"tracks",
						"id:spotify"
						//"id:spotify-WW"
						//"id:7digital-US"
					]
				}, function (err, json) {
					
					
					done( err.response, json.response);
					
					if( err.response || json.response.status.code != 0 ) console.log("Error: "+err.response);
					
					if( json.response.status.code == 429 ) console.log("Rate Limit Exceeded");
					
					//console.log(json.response.songs);
				});
				
			});
			
			return output.result.songs;
		},
		serverMessage: function() {
			
			var output = false;
			
			return output;
		}
	});

}