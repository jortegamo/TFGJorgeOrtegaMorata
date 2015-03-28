Records = new Mongo.Collection ('records');

Meteor.methods ({
	insertRecord: function(record){
		var id = Records.insert(record);
		console.log("me han llamado");
		console.log(id);
		return {_id: id};
	}

})