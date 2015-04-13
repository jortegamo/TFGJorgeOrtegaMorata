Channels = new Mongo.Collection ('channels');

Meteor.methods ({
	insertChannel: function(channel){
		var id = Channels.insert(channel);
		return {_id: id};
	}

})