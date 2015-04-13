Meteor.publish('records',function(){
	return Records.find({});
});

Meteor.publish('channels',function(){
	return Channels.find({});
});

Meteor.publish('documentsByRC',function(record_id){
	return DocumentsByRC.find({record: record_id});
});