Meteor.publish('records',function(){
	return Records.find({});
});

Meteor.publish('channels',function(){
	return Channels.find({});
});

Meteor.publish('documentsByRC',function(record_id){
	return DocumentsByRC.find({record: record_id});
});

Meteor.publish('commentsRC',function(record_id){
	return CommentsRC.find({record: record_id});
});