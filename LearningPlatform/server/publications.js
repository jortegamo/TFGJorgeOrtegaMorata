Meteor.publish('records',function(){
	return Records.find({});
});

Meteor.publish('channels',function(){
	return Channels.find({});
})