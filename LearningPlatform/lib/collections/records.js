Records = new Mongo.Collection ('records');

Meteor.methods ({
	insertRecord: function(record){
		var id = Records.insert(record);
		return {_id: id};
	}
});