Records = new Mongo.Collection ('records');

Meteor.methods ({
	insertRecord: function(record){
		var id = Records.insert(record);
		return {_id: id};
	},
	incrementRecordComment: function(record_id){
		Records.update(record_id,{$inc: {comments_count: 1}});
	}
});