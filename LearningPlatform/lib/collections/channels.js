Channels = new Mongo.Collection ('channels');

Meteor.methods ({
	insertChannel: function(channel){
		var id = Records.insert(record);
		return {_id: id};
	}

})