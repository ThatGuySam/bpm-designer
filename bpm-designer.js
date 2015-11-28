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
	
	Session.set('bpmValue', [
		{
			icon:		"×",
			header:		"243",
			secondary:	"345 456 567"
		},
	]);
	
	//Is number
	function isInt(value) {
		return !isNaN(value) && 
		parseInt(Number(value)) == value && 
		!isNaN(parseInt(value, 10));
	}
	
	function parseBPM(bpm){
		
		var output = [];
		
		for (var key in bpmItemTypes) {
			if (bpmItemTypes.hasOwnProperty(key)) {
				
				var itemType = bpmItemTypes[key];
				var outputType = {};
				
				outputType.icon = itemType.icon;
				
				outputType.header = (Math.round( itemType.getOutputs(bpm,itemType.outputs[0]) * 100 ) / 100).toString();
				
				outputType.secondary = "";
				
				for (i = 1; i < itemType.outputs.length; i++) { 
					
					var number = (Math.round( itemType.getOutputs(bpm,itemType.outputs[i]) * 100 ) / 100).toString();
					
					outputType.secondary += number + " ";
				}
				
/*
				for (var key in itemType) {
					outputType.icon = 
				}
*/
				
				output.push( outputType );
				
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
			if( isNumber !== false ) {
				
				var bpmInt = parseInt(bpm);
				
				Session.set('bpmValue', parseBPM(bpmInt));
				
				//console.log("The front-end says: " + bpmInt);
				
				console.log( Session.get('bpmValue') );
				
			} else {//Not a number
				console.log("That's no M00N");
			}
			 
			//event.target.title.value = "";
			 
			return false;
		 
		}
	});
	

	
	//
	//Front-end UI stuff
	//
	
	Template.bpmContainer.helpers({
		bpmItems: function() {
			
			var output = Session.get('bpmValue');
			
			return output;
		}
	});
	
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
