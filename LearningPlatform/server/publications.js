//RECORDS
Meteor.publish('records',function(){
	return Records.find({});
});

Meteor.publish('record',function(record_id){
	return Records.find({_id: record_id});
});



//CHANNELS
Meteor.publish('channels',function(){
	return Channels.find({});
});

Meteor.publish('channel',function(channel_id){
	return Channels.find({_id: channel_id});
});



//DOCUMENTS
Meteor.publish('documents',function(){
	return Documents.find({});
});

Meteor.publish('documentsRecord',function(record_id){
	return Documents.find({record: record_id});
});



//COMMENTS
Meteor.publish('commentsRecord',function(record_id){
	return Comments.find({record: record_id});
});

Meteor.publish('commentsChannel',function(channel_id){
	return Comments.find({channel: channel_id});
});