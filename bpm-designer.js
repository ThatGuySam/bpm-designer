if (Meteor.isClient) {
	
	var value = 0;
	var bpminput;
	
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
	
	WebFontConfig = {
		typekit: { id: 'xes4zaz' }
	};
	
	(function(d) {
		var wf = d.createElement('script'), s = d.scripts[0];
		wf.src = 'https://ajax.googleapis.com/ajax/libs/webfont/1.5.18/webfont.js';
		s.parentNode.insertBefore(wf, s);
	})(document);
	
	Session.set('bpmValue', []);
	
	Session.set('bpmContainer', { classes: "empty" });
	
	//Is number
	function isInt(value) {
		return !isNaN(value) && 
		parseInt(Number(value)) == value && 
		!isNaN(parseInt(value, 10));
	}
	
	function parseBPM(bpm){
		
		var output = [];
		
		t = 0; 
		for (var key in bpmItemTypes) {
			if (bpmItemTypes.hasOwnProperty(key)) {
				
				var itemType = bpmItemTypes[key];
				var outputType = {};
				
				outputType.icon = itemType.icon;
				
				outputType.header = (Math.round( itemType.getOutputs(bpm,itemType.outputs[0]) * 100 ) / 100).toString();
				
				outputType.secondary = "";
				
				outputType.animDelay = (200 * t) + 50;
				
				for (i = 1; i < itemType.outputs.length; i++) { 
					
					var number = (Math.round( itemType.getOutputs(bpm,itemType.outputs[i]) * 100 ) / 100).toString();
					
					outputType.secondary += number + " ";
				}
				
				output.push( outputType );
				
				t++;
			} else {
				//console.log( bpmItemTypes[key] );
			}
		}
		
		return output;
		
	}
	
	
	//Templating Functions
	Template.body.helpers({
		
	});
	
/*
	Template.registerHelper function (name, func) {                                                                             
		Blaze._globalHelpers[name] = func;                                                                                   
	} 
*/
	
	
	
	Template.body.events({
		'keyup #bpminput': function(event){//Keyup Listener
			
			var	bpm = event.target.value;
			
			//console.log( event.target.value );
			
			var isNumber = isInt(bpm);
			
			//Is it a number
			if( isNumber !== false && bpm != "" ) {
				
				var bpmInt = parseInt(bpm);
				
				Session.set('bpmValue', parseBPM(bpmInt));
				Session.set('bpmContainer', { classes: "has-items" })
				
				//console.log( Session.get('bpmValue') );
				
			} else if( bpm == "" ){
				Session.set('bpmValue', []);
				Session.set('bpmContainer', { classes: "empty" });
			} else {//Not a number
				console.log("That's no M00N");
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
		
		//Can you see it?
		//console.log(bpminput);
		
		//Onload Focus 
		bpminput.focus();
		
	};
	
/*
	Template.bpmContainer.bpmItems = function() {
	    var objects = Template.bpmContainer.objects();
	
	    for(var i = 0; i=objects.length; i++) {
	        objects[i].index = i;
	    }
	
	    return objects;
	}
*/
	

}

if (Meteor.isServer) {
	Meteor.startup(function () {
		// code to run on server at startup
	});
}


//Server Side Processing
Meteor.methods({
	deleteResolution: function(id) {
		var res = Resolutions.findOne(id);
		
		if( res.owner !== Meteor.userId() ) {
			throw new Meteor.error('not-authorized');
		}
		
		Resolutions.remove(id);
	},
	setPrivate: function(id, private) {
		var res = Resolutions.findOne(id);
		
		if( res.owner !== Meteor.userId() ) {
			throw new Meteor.error('not-authorized');
		}
		
		Resolutions.update(id, {$set: {private: private}});
		
	}
});
